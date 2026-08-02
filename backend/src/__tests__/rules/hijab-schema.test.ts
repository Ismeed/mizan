/**
 * MIZAN — Hijab Schema & Rule ID Tests (Phase 6)
 *
 * Tests the Zod schema validation for HijabRuleRecord
 * and HijabRule ID format compliance.
 */

import { HijabRuleRecordSchema } from '@mizan/shared';
import {
  FIXTURE_SON_BLOCKS_FULL_BROTHER,
  FIXTURE_SON_REDUCES_MOTHER_SHARE,
  ALL_HIJAB_TEST_FIXTURES,
} from './fixtures/hijab-rule.fixture';

describe('HijabRuleRecord Schema Validation', () => {

  describe('valid records pass schema', () => {
    test('FIXTURE_SON_BLOCKS_FULL_BROTHER passes schema', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_BLOCKS_FULL_BROTHER);
      expect(result.success).toBe(true);
    });

    test('FIXTURE_SON_REDUCES_MOTHER_SHARE passes schema', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_REDUCES_MOTHER_SHARE);
      expect(result.success).toBe(true);
    });

    test('all test fixtures pass schema', () => {
      for (const fixture of ALL_HIJAB_TEST_FIXTURES) {
        const result = HijabRuleRecordSchema.safeParse(fixture);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Hijab Rule ID format validation', () => {
    test('valid HIJAB-X-Y-NNN format passes', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_BLOCKS_FULL_BROTHER);
      expect(result.success).toBe(true);
    });

    test('invalid ID format fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        hijabRuleId: 'INVALID-ID',
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('ID without three-digit suffix fails', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        hijabRuleId: 'HIJAB-FULLBROTHERS-SONS-1',
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('governance constraints', () => {
    test('PRODUCTION test fixture fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        governance: {
          ...FIXTURE_SON_BLOCKS_FULL_BROTHER.governance,
          status: 'PRODUCTION',
          isTestFixture: true,
          fixtureTag: 'TEST_ONLY_FIXTURE',
        },
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('test fixture without fixtureTag fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        governance: {
          ...FIXTURE_SON_BLOCKS_FULL_BROTHER.governance,
          isTestFixture: true,
          fixtureTag: undefined,
        },
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('HIRMAN/NUQSAN constraints', () => {
    test('NUQSAN without reducedFraction fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_REDUCES_MOTHER_SHARE,
        effectType: 'NUQSAN',
        reducedFraction: undefined,
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('HIRMAN with reducedFraction fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        effectType: 'HIRMAN',
        reducedFraction: { numerator: 1, denominator: 6 },
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('HIRMAN without reducedFraction passes', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_BLOCKS_FULL_BROTHER);
      expect(result.success).toBe(true);
    });

    test('NUQSAN with reducedFraction passes', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_REDUCES_MOTHER_SHARE);
      expect(result.success).toBe(true);
    });
  });

  describe('evidence ref requirement', () => {
    test('rule with empty evidenceRefs fails schema', () => {
      const invalid = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        evidenceRefs: [],
      };
      const result = HijabRuleRecordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('rule with at least one evidenceRef passes', () => {
      const result = HijabRuleRecordSchema.safeParse(FIXTURE_SON_BLOCKS_FULL_BROTHER);
      expect(result.success).toBe(true);
    });
  });
});
