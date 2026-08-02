import crypto from 'crypto';
import { CalculationProfile } from '@mizan/shared';

export class ProfileChecksumService {
  /**
   * Generates a deterministic SHA-256 checksum for a CalculationProfile object.
   */
  static generateChecksum(profile: Partial<CalculationProfile>): string {
    const canonicalObj = {
      module: profile.module,
      madhhab: profile.preferences?.madhhab?.resolved,
      currencyCode: profile.preferences?.currency?.code,
      currencySymbol: profile.preferences?.currency?.symbol,
      currencyDecimalPlaces: profile.preferences?.currency?.decimalPlaces,
      currencyLocale: profile.preferences?.currency?.locale,
      languageTag: profile.preferences?.language?.tag,
      languageLocale: profile.preferences?.language?.locale,
      textDirection: profile.preferences?.language?.direction,
      countryCode: profile.preferences?.region?.countryCode,
      timezone: profile.preferences?.region?.timezone,
      profileSchemaVersion: profile.versions?.profileSchemaVersion || '1.0.0',
      ruleEngineVersion: profile.versions?.ruleEngineVersion || '1.0.0',
      knowledgeReleaseVersion: profile.versions?.knowledgeReleaseVersion || '1.0.0',
      reportSchemaVersion: profile.versions?.reportSchemaVersion || '1.0.0',
    };

    const jsonString = JSON.stringify(canonicalObj, Object.keys(canonicalObj).sort());
    return crypto.createHash('sha256').update(jsonString, 'utf8').digest('hex');
  }

  /**
   * Verifies if a profile matches its expected checksum.
   */
  static verifyChecksum(profile: Partial<CalculationProfile>, expectedChecksum: string): boolean {
    const actual = this.generateChecksum(profile);
    return actual === expectedChecksum;
  }
}
