import { prisma } from '../../../config/database';
import { CalculationProfileSnapshotService } from './calculation-profile-snapshot.service';
import { ProfileChecksumService } from './profile-checksum.service';

export class HistoricalProfileMigrationService {
  /**
   * Safely migrates existing historical calculations without profile snapshots.
   */
  static async migrateExistingCalculations(): Promise<{
    migratedCount: number;
    incompleteCount: number;
    errors: string[];
  }> {
    let migratedCount = 0;
    let incompleteCount = 0;
    const errors: string[] = [];

    const unmigratedCalculations = await prisma.calculation.findMany({
      where: { profile_snapshot_id: null },
      include: {
        inheritance: true,
        zakat: true,
      },
    });

    for (const calc of unmigratedCalculations) {
      try {
        let madhhab = 'MALIKI';
        let currency = 'NGN';
        let status = 'FROZEN';
        let madhhabSource = 'MIGRATED_VALUE';
        let currencySource = 'MIGRATED_VALUE';

        if (calc.type === 'INHERITANCE' && calc.inheritance) {
          madhhab = calc.inheritance.madhhab || 'MALIKI';
          currency = calc.inheritance.currency || 'NGN';
        } else if (calc.type === 'ZAKAT' && calc.zakat) {
          currency = calc.zakat.currency || 'NGN';
          madhhabSource = 'SYSTEM_DEFAULT'; // Zakat previously had no stored madhhab
          status = 'INCOMPLETE_HISTORICAL_CONTEXT';
        } else {
          status = 'INCOMPLETE_HISTORICAL_CONTEXT';
        }

        const profilePayload: any = {
          module: calc.type as any,
          preferences: {
            madhhab: { selected: madhhab, resolved: madhhab, source: madhhabSource },
            currency: { code: currency, symbol: currency === 'NGN' ? '₦' : '$', decimalPlaces: 2, locale: 'en-NG', source: currencySource },
            language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'MIGRATED_VALUE' },
            region: { countryCode: 'NG', timezone: 'Africa/Lagos', source: 'MIGRATED_VALUE' },
          },
          versions: {
            profileSchemaVersion: '1.0.0',
            ruleEngineVersion: '1.0.0',
            knowledgeReleaseVersion: '1.0.0',
            reportSchemaVersion: '1.0.0',
          },
        };

        const checksum = ProfileChecksumService.generateChecksum(profilePayload);

        const snapshot = await prisma.calculationProfileSnapshot.create({
          data: {
            calculation_id: calc.id,
            user_id: calc.user_id,
            module: calc.type,
            madhhab,
            madhhab_source: madhhabSource,
            currency_code: currency,
            currency_symbol_snapshot: currency === 'NGN' ? '₦' : '$',
            currency_decimal_places_snapshot: 2,
            currency_locale_snapshot: 'en-NG',
            currency_source: currencySource,
            language_tag: 'en',
            locale: 'en-US',
            text_direction: 'LTR',
            language_source: 'MIGRATED_VALUE',
            country_code: 'NG',
            timezone: 'Africa/Lagos',
            region_source: 'MIGRATED_VALUE',
            profile_schema_version: '1.0.0',
            rule_engine_version: '1.0.0',
            knowledge_release_version: '1.0.0',
            report_schema_version: '1.0.0',
            checksum,
            profile_status: status,
            frozen_at: calc.created_at,
          },
        });

        await prisma.calculation.update({
          where: { id: calc.id },
          data: { profile_snapshot_id: snapshot.id },
        });

        if (status === 'INCOMPLETE_HISTORICAL_CONTEXT') {
          incompleteCount++;
        } else {
          migratedCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to migrate calculation '${calc.id}': ${err.message}`);
      }
    }

    return { migratedCount, incompleteCount, errors };
  }
}
