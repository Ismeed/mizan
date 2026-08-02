import { CalculationProfileSnapshotService } from './calculation-profile-snapshot.service';
import { CurrencyRegistryService } from '../registries/currency.registry';
import { MadhhabRegistryService } from '../registries/madhhab.registry';
import { LanguageRegistryService } from '../registries/language.registry';

export class ReportProfileService {
  /**
   * Constructs formatted report profile section metadata for PDF injection.
   */
  static async getReportProfileSection(calculationId: string) {
    const snapshot = await CalculationProfileSnapshotService.getSnapshotByCalculationId(calculationId);

    if (!snapshot) {
      return {
        profileStatus: 'INCOMPLETE_HISTORICAL_CONTEXT',
        madhhabName: 'Unrecorded',
        currencyName: 'Default',
        languageName: 'English',
        ruleEngineVersion: '1.0.0',
        knowledgeReleaseVersion: '1.0.0',
        formattedDate: new Date().toLocaleDateString('en-GB'),
      };
    }

    // Verify integrity before injecting into report
    await CalculationProfileSnapshotService.verifySnapshotIntegrity(calculationId);

    const madhhabDef = MadhhabRegistryService.get(snapshot.madhhab);
    const currencyDef = CurrencyRegistryService.get(snapshot.currency_code);
    const langDef = LanguageRegistryService.get(snapshot.language_tag);

    return {
      profileStatus: snapshot.profile_status,
      madhhabCode: snapshot.madhhab,
      madhhabName: madhhabDef?.name.en || snapshot.madhhab,
      currencyCode: snapshot.currency_code,
      currencySymbol: snapshot.currency_symbol_snapshot,
      currencyName: currencyDef?.name.en || snapshot.currency_code,
      languageTag: snapshot.language_tag,
      languageName: langDef?.name.en || snapshot.language_tag,
      ruleEngineVersion: snapshot.rule_engine_version,
      knowledgeReleaseVersion: snapshot.knowledge_release_version,
      formattedDate: new Date(snapshot.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      checksum: snapshot.checksum,
    };
  }
}
