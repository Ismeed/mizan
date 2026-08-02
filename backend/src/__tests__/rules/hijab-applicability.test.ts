/**
 * MIZAN — Hijab Applicability Tests (Phase 6)
 *
 * Tests the structural applicability determination logic for hijab rules.
 * Uses TEST_ONLY_FIXTURE tagged fixtures — no real Islamic rulings are tested.
 */

import { HijabApplicabilityService } from '../../features/rules/services/hijab-applicability.service';
import type { HijabRuleRecord } from '@mizan/shared';
import {
  FIXTURE_SON_BLOCKS_FULL_BROTHER,
  FIXTURE_SON_REDUCES_MOTHER_SHARE,
  FIXTURE_SON_BLOCKS_PAT_GRANDFATHER,
  ALL_HIJAB_TEST_FIXTURES,
} from './fixtures/hijab-rule.fixture';

describe('HijabApplicabilityService', () => {

  describe('evaluateRule — HIRMAN (person-based)', () => {
    test('marks rule applicable when blocking cause and blocked heir are both present', () => {
      const presentHeirs = { fullBrothers: 2, sons: 1 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        presentHeirs
      );

      expect(result.isApplicable).toBe(true);
      expect(result.blockedHeirPresent).toBe(true);
      expect(result.blockingCausePresent).toBe(true);
    });

    test('marks rule not applicable when blocking cause is absent', () => {
      const presentHeirs = { fullBrothers: 2, sons: 0 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        presentHeirs
      );

      expect(result.isApplicable).toBe(false);
      expect(result.blockingCausePresent).toBe(false);
      expect(result.blockedHeirPresent).toBe(true);
    });

    test('marks rule not applicable when blocked heir is absent', () => {
      const presentHeirs = { fullBrothers: 0, sons: 1 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        presentHeirs
      );

      expect(result.isApplicable).toBe(false);
      expect(result.blockedHeirPresent).toBe(false);
    });

    test('marks rule not applicable when both heirs absent', () => {
      const presentHeirs = { husband: 1, daughters: 2 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        presentHeirs
      );

      expect(result.isApplicable).toBe(false);
    });
  });

  describe('evaluateRule — NUQSAN (person-based)', () => {
    test('marks NUQSAN rule applicable when son and mother both present', () => {
      const presentHeirs = { mother: 1, sons: 1 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_REDUCES_MOTHER_SHARE,
        presentHeirs
      );

      expect(result.isApplicable).toBe(true);
      expect(result.rule.effectType).toBe('NUQSAN');
      expect(result.rule.reducedFraction).toEqual({ numerator: 1, denominator: 6 });
    });

    test('marks NUQSAN rule not applicable when mother absent', () => {
      const presentHeirs = { sons: 2 };
      const result = HijabApplicabilityService.evaluateRule(
        FIXTURE_SON_REDUCES_MOTHER_SHARE,
        presentHeirs
      );

      expect(result.isApplicable).toBe(false);
    });
  });

  describe('filterApplicable', () => {
    test('filters down to only applicable rules', () => {
      const presentHeirs = { fullBrothers: 1, sons: 1, mother: 1 };
      const applicable = HijabApplicabilityService.filterApplicable(
        ALL_HIJAB_TEST_FIXTURES,
        presentHeirs
      );

      // Should include son-blocks-fullBrothers and son-reduces-mother
      const ids = applicable.map((r: HijabRuleRecord) => r.hijabRuleId);
      expect(ids).toContain('HIJAB-FULLBROTHERS-SONS-001');
      expect(ids).toContain('HIJAB-MOTHER-SONS-001');
      // Grandfather rule not applicable — grandfather absent
      expect(ids).not.toContain('HIJAB-PATERNALGRANDFATHERS-SONS-001');
    });

    test('returns empty array when no heirs present', () => {
      const applicable = HijabApplicabilityService.filterApplicable(
        ALL_HIJAB_TEST_FIXTURES,
        {}
      );
      expect(applicable).toHaveLength(0);
    });

    test('returns empty array when no rules are applicable for present heirs', () => {
      const presentHeirs = { husband: 1, daughters: 2 };
      const applicable = HijabApplicabilityService.filterApplicable(
        ALL_HIJAB_TEST_FIXTURES,
        presentHeirs
      );
      expect(applicable).toHaveLength(0);
    });
  });

  describe('determineApplicableRules — bulk evaluation', () => {
    test('returns one result per rule', () => {
      const results = HijabApplicabilityService.determineApplicableRules(
        ALL_HIJAB_TEST_FIXTURES,
        { fullBrothers: 1, sons: 1 }
      );
      expect(results).toHaveLength(ALL_HIJAB_TEST_FIXTURES.length);
    });

    test('each result includes the original rule reference', () => {
      const results = HijabApplicabilityService.determineApplicableRules(
        [FIXTURE_SON_BLOCKS_FULL_BROTHER],
        { fullBrothers: 1, sons: 1 }
      );
      expect(results[0].rule.hijabRuleId).toBe('HIJAB-FULLBROTHERS-SONS-001');
    });
  });
});
