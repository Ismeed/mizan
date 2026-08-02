import { ProfileChecksumService } from '../../features/profile/services/profile-checksum.service';
import { CalculationProfile } from '@mizan/shared';

describe('Profile Snapshot Immutability & Checksum Protection', () => {
  const sampleProfile: Partial<CalculationProfile> = {
    module: 'MIRATH',
    preferences: {
      madhhab: { selected: 'MALIKI', resolved: 'MALIKI', source: 'USER_PROFILE' },
      currency: { code: 'NGN', symbol: '₦', decimalPlaces: 2, locale: 'en-NG', source: 'USER_PROFILE' },
      language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
      region: { countryCode: 'NG', timezone: 'Africa/Lagos', source: 'USER_PROFILE' },
    },
    versions: {
      profileSchemaVersion: '1.0.0',
      ruleEngineVersion: '1.0.0',
      knowledgeReleaseVersion: '1.0.0',
      reportSchemaVersion: '1.0.0',
    },
  };

  test('Generates deterministic checksum for frozen profile snapshot', () => {
    const hash1 = ProfileChecksumService.generateChecksum(sampleProfile);
    const hash2 = ProfileChecksumService.generateChecksum(sampleProfile);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  test('Detects unauthorized tampering with frozen profile madhhab', () => {
    const originalChecksum = ProfileChecksumService.generateChecksum(sampleProfile);

    const tamperedProfile = {
      ...sampleProfile,
      preferences: {
        ...sampleProfile.preferences!,
        madhhab: { selected: 'HANAFI' as const, resolved: 'HANAFI' as const, source: 'USER_PROFILE' as const },
      },
    };

    const isMatch = ProfileChecksumService.verifyChecksum(tamperedProfile, originalChecksum);
    expect(isMatch).toBe(false);
  });

  test('Detects unauthorized tampering with currency code', () => {
    const originalChecksum = ProfileChecksumService.generateChecksum(sampleProfile);

    const tamperedProfile = {
      ...sampleProfile,
      preferences: {
        ...sampleProfile.preferences!,
        currency: { code: 'USD', symbol: '$', decimalPlaces: 2, locale: 'en-US', source: 'USER_PROFILE' as const },
      },
    };

    const isMatch = ProfileChecksumService.verifyChecksum(tamperedProfile, originalChecksum);
    expect(isMatch).toBe(false);
  });
});
