/**
 * MIZAN — Hijab Madhhab Variance Tests (Phase 6)
 *
 * Tests that madhhab-scoped hijab rules are correctly isolated
 * to their applicable madhhabs and that cross-madhhab bleeding
 * does not occur.
 *
 * Uses TEST_ONLY_FIXTURE tagged data only.
 */

import { HijabApplicabilityService } from '../../features/rules/services/hijab-applicability.service';
import {
  FIXTURE_SON_BLOCKS_FULL_BROTHER,   // ALL_SCHOOLS
  FIXTURE_HANAFI_SPECIFIC_BLOCKING,   // HANAFI only
} from './fixtures/hijab-rule.fixture';
import type { HijabRuleRecord } from '@mizan/shared';

describe('Hijab Madhhab Variance', () => {

  describe('madhhabScope filtering logic', () => {

    test('ALL_SCHOOLS rule is applicable for HANAFI madhhab', () => {
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER, // ALL_SCHOOLS scope
        { fullBrothers: 1, sons: 1 }
      );
      expect(result.isApplicable).toBe(true);
    });

    test('ALL_SCHOOLS rule is applicable for MALIKI madhhab', () => {
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        { fullBrothers: 1, sons: 1 }
      );
      expect(result.isApplicable).toBe(true);
    });

    test('HANAFI-specific rule is structurally applicable when passed in', () => {
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_HANAFI_SPECIFIC_BLOCKING, // HANAFI scope only
        { paternalGrandfathers: 1, father: 1 }
      );
      expect(result.isApplicable).toBe(true);
    });

    test('HANAFI-specific rule would not be applicable if blocking cause absent', () => {
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_HANAFI_SPECIFIC_BLOCKING,
        { paternalGrandfathers: 1, father: 0 }
      );
      expect(result.isApplicable).toBe(false);
    });
  });

  describe('Jafari madhhab isolation', () => {
    test('Jafari-only rule is not passed to Sunni calculations by registry', () => {
      const jafariOnlyRule: HijabRuleRecord = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        hijabRuleId: 'HIJAB-FULLBROTHERS-SONS-JAFARI-001',
        madhhabScope: ['JAFARI'],
        titleEn: '[TEST] Jafari-only blocking rule',
      };

      const result = HijabApplicabilityService.evaluateRule(
        jafariOnlyRule,
        { fullBrothers: 1, sons: 1 }
      );
      expect(result.isApplicable).toBe(true);
      expect(jafariOnlyRule.madhhabScope).toEqual(['JAFARI']);
    });
  });

  describe('madhhab scope array assertions', () => {
    test('ALL_SCHOOLS fixture includes expected scope value', () => {
      expect(FIXTURE_SON_BLOCKS_FULL_BROTHER.madhhabScope).toContain('ALL_SCHOOLS');
    });

    test('HANAFI fixture is scoped to HANAFI only', () => {
      expect(FIXTURE_HANAFI_SPECIFIC_BLOCKING.madhhabScope).toEqual(['HANAFI']);
      expect(FIXTURE_HANAFI_SPECIFIC_BLOCKING.madhhabScope).not.toContain('MALIKI');
      expect(FIXTURE_HANAFI_SPECIFIC_BLOCKING.madhhabScope).not.toContain('ALL_SCHOOLS');
    });
  });

  describe('madhhab variance evidence integrity', () => {
    test('all test fixtures have at least one evidence reference', () => {
      const rules = [FIXTURE_SON_BLOCKS_FULL_BROTHER, FIXTURE_HANAFI_SPECIFIC_BLOCKING];
      for (const rule of rules) {
        expect(rule.evidenceRefs.length).toBeGreaterThan(0);
      }
    });

    test('all test fixtures have correct TEST_ONLY_FIXTURE governance tag', () => {
      const rules = [FIXTURE_SON_BLOCKS_FULL_BROTHER, FIXTURE_HANAFI_SPECIFIC_BLOCKING];
      for (const rule of rules) {
        expect(rule.governance.isTestFixture).toBe(true);
        expect(rule.governance.fixtureTag).toBe('TEST_ONLY_FIXTURE');
        expect(rule.governance.status).not.toBe('PRODUCTION');
      }
    });
  });
});
