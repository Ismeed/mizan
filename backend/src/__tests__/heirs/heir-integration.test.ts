/**
 * MIZAN — Heir Integration Tests (Phase 7)
 *
 * Validates Q1 controlled one-way normalization adapter, Q3 PATERNAL_BROTHER alias rules,
 * and canonical facts integration.
 */

import { HeirNormalizationService } from '../../features/heirs/services/heir-normalization.service';
import { BASELINE_HEIR_ALIASES } from '@mizan/shared';

describe('Phase 7 Integration Tests', () => {

  describe('Q3 Directive: PATERNAL_BROTHER & PATERNAL_HALF_BROTHER', () => {
    test('PATERNAL_BROTHER is a permanent baseline canonical heir ID', () => {
      const alias = BASELINE_HEIR_ALIASES.find((a) => a.aliasText === 'paternalHalfBrothers');
      expect(alias).toBeDefined();
      expect(alias!.heirId).toBe('PATERNAL_BROTHER');
    });

    test('PATERNAL_HALF_BROTHER normalizes to PATERNAL_BROTHER', async () => {
      const result = await HeirNormalizationService.normalizeHeirInput({
        input: 'paternalHalfBrothers',
        languageTag: 'en',
      });

      expect(result.status).toBe('RESOLVED');
      expect(result.resolvedHeirId).toBe('PATERNAL_BROTHER');
    });
  });

  describe('Q1 Directive: Controlled One-Way Normalization Adapter', () => {
    test('legacy camelCase keys normalize cleanly to Canonical Heir IDs', async () => {
      const legacyKeys = [
        { legacy: 'fullBrothers', canonical: 'FULL_BROTHER' },
        { legacy: 'paternalHalfBrothers', canonical: 'PATERNAL_BROTHER' },
        { legacy: 'paternalGrandfathers', canonical: 'PATERNAL_GRANDFATHER' },
        { legacy: 'sonsOfFullBrothers', canonical: 'FULL_BROTHERS_SON' },
      ];

      for (const item of legacyKeys) {
        const result = await HeirNormalizationService.normalizeHeirInput({
          input: item.legacy,
          languageTag: 'en',
        });
        expect(result.status).toBe('RESOLVED');
        expect(result.resolvedHeirId).toBe(item.canonical);
      }
    });
  });
});
