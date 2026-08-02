import { prisma } from '../../../config/database';
import { CalculationProfile } from '@mizan/shared';
import { ProfileChecksumService } from './profile-checksum.service';

export class CalculationProfileSnapshotService {
  /**
   * Creates and freezes an immutable snapshot in the database for a calculation.
   */
  static async createFrozenSnapshot(profile: CalculationProfile, calculationId: string) {
    const checksum = ProfileChecksumService.generateChecksum(profile);
    const now = new Date();

    const snapshot = await prisma.calculationProfileSnapshot.create({
      data: {
        id: profile.calculationProfileId,
        calculation_id: calculationId,
        user_id: profile.userId,
        module: profile.module,
        madhhab: profile.preferences.madhhab.resolved,
        madhhab_source: profile.preferences.madhhab.source,
        currency_code: profile.preferences.currency.code,
        currency_symbol_snapshot: profile.preferences.currency.symbol,
        currency_decimal_places_snapshot: profile.preferences.currency.decimalPlaces,
        currency_locale_snapshot: profile.preferences.currency.locale,
        currency_source: profile.preferences.currency.source,
        language_tag: profile.preferences.language.tag,
        locale: profile.preferences.language.locale,
        text_direction: profile.preferences.language.direction,
        language_source: profile.preferences.language.source,
        country_code: profile.preferences.region.countryCode,
        timezone: profile.preferences.region.timezone,
        region_source: profile.preferences.region.source,
        profile_schema_version: profile.versions.profileSchemaVersion,
        rule_engine_version: profile.versions.ruleEngineVersion,
        knowledge_release_version: profile.versions.knowledgeReleaseVersion,
        report_schema_version: profile.versions.reportSchemaVersion,
        checksum,
        profile_status: 'FROZEN',
        frozen_at: now,
      },
    });

    // Wire snapshot ID back to calculation record
    await prisma.calculation.update({
      where: { id: calculationId },
      data: { profile_snapshot_id: snapshot.id },
    });

    return snapshot;
  }

  /**
   * Retrieves a snapshot by calculation ID.
   */
  static async getSnapshotByCalculationId(calculationId: string) {
    return prisma.calculationProfileSnapshot.findUnique({
      where: { calculation_id: calculationId },
    });
  }

  /**
   * Recalculates and verifies checksum for a saved snapshot.
   * Throws Error if checksum mismatch detected.
   */
  static async verifySnapshotIntegrity(calculationId: string): Promise<boolean> {
    const snapshot = await this.getSnapshotByCalculationId(calculationId);
    if (!snapshot) {
      throw new Error(`Profile snapshot for calculation '${calculationId}' not found.`);
    }

    const reconstructedProfile: Partial<CalculationProfile> = {
      module: snapshot.module as any,
      preferences: {
        madhhab: {
          selected: snapshot.madhhab as any,
          resolved: snapshot.madhhab as any,
          source: snapshot.madhhab_source as any,
        },
        currency: {
          code: snapshot.currency_code,
          symbol: snapshot.currency_symbol_snapshot,
          decimalPlaces: snapshot.currency_decimal_places_snapshot,
          locale: snapshot.currency_locale_snapshot,
          source: snapshot.currency_source as any,
        },
        language: {
          tag: snapshot.language_tag,
          locale: snapshot.locale,
          direction: snapshot.text_direction as any,
          source: snapshot.language_source as any,
        },
        region: {
          countryCode: snapshot.country_code,
          timezone: snapshot.timezone,
          source: snapshot.region_source as any,
        },
      },
      versions: {
        profileSchemaVersion: snapshot.profile_schema_version,
        ruleEngineVersion: snapshot.rule_engine_version,
        knowledgeReleaseVersion: snapshot.knowledge_release_version,
        reportSchemaVersion: snapshot.report_schema_version,
      },
    };

    const isMatch = ProfileChecksumService.verifyChecksum(reconstructedProfile, snapshot.checksum);
    if (!isMatch) {
      throw new Error(`SECURITY ALERT: Profile snapshot integrity check failed for calculation '${calculationId}'. Checksum mismatch!`);
    }

    return true;
  }
}
