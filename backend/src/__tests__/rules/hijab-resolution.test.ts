/**
 * MIZAN — Hijab Resolution Tests (Phase 6)
 *
 * Tests HijabResolverService using in-memory fixture rules
 * (bypasses DB via mocking).
 * Uses TEST_ONLY_FIXTURE tagged data.
 */

import { HijabResolverService } from '../../features/rules/services/hijab-resolver.service';
import { HijabRuleRegistryService } from '../../features/rules/services/hijab-rule-registry.service';
import type { HeirHijabStatus, HijabResolutionTrace } from '@mizan/shared';
import {
  FIXTURE_SON_BLOCKS_FULL_BROTHER,
  FIXTURE_SON_REDUCES_MOTHER_SHARE,
  FIXTURE_SON_BLOCKS_PAT_GRANDFATHER,
} from './fixtures/hijab-rule.fixture';

// Mock the registry to use in-memory fixtures
jest.mock('../../features/rules/services/hijab-rule-registry.service');
// Mock the audit service to avoid DB writes in tests
jest.mock('../../features/rules/services/hijab-audit.service', () => ({
  HijabAuditService: { writeAudit: jest.fn().mockResolvedValue(undefined) },
}));

const mockLoadRules = HijabRuleRegistryService.loadRulesForMadhhab as jest.MockedFunction<
  typeof HijabRuleRegistryService.loadRulesForMadhhab
>;

describe('HijabResolverService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolve — HIRMAN (complete exclusion)', () => {
    test('completely excludes fullBrothers when son is present', async () => {
      mockLoadRules.mockResolvedValue([FIXTURE_SON_BLOCKS_FULL_BROTHER]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { fullBrothers: 2, sons: 1 },
      }, true);

      expect(output.status).toBe('RESOLVED');

      const brotherStatus = output.heirStatuses.find((s: HeirHijabStatus) => s.heirKey === 'fullBrothers');
      expect(brotherStatus).toBeDefined();
      expect(brotherStatus!.isCompletelyExcluded).toBe(true);
      expect(brotherStatus!.isEligible).toBe(false);
      expect(brotherStatus!.effectType).toBe('HIRMAN');
      expect(brotherStatus!.appliedHijabRuleId).toBe('HIJAB-FULLBROTHERS-SONS-001');
    });

    test('does not exclude fullBrothers when son is absent', async () => {
      mockLoadRules.mockResolvedValue([FIXTURE_SON_BLOCKS_FULL_BROTHER]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { fullBrothers: 2, sons: 0 },
      }, true);

      const brotherStatus = output.heirStatuses.find((s: HeirHijabStatus) => s.heirKey === 'fullBrothers');
      expect(brotherStatus?.isCompletelyExcluded).toBe(false);
      expect(brotherStatus?.isEligible).toBe(true);
    });
  });

  describe('resolve — NUQSAN (partial reduction)', () => {
    test('reduces mother share when son is present', async () => {
      mockLoadRules.mockResolvedValue([FIXTURE_SON_REDUCES_MOTHER_SHARE]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { mother: 1, sons: 1 },
      }, true);

      const motherStatus = output.heirStatuses.find((s: HeirHijabStatus) => s.heirKey === 'mother');
      expect(motherStatus!.isReduced).toBe(true);
      expect(motherStatus!.isCompletelyExcluded).toBe(false);
      expect(motherStatus!.isEligible).toBe(true);
      expect(motherStatus!.effectType).toBe('NUQSAN');
      expect(motherStatus!.reducedFraction).toEqual({ numerator: 1, denominator: 6 });
    });
  });

  describe('resolve — HIRMAN takes precedence over NUQSAN', () => {
    test('HIRMAN is applied when both HIRMAN and NUQSAN rules exist for same heir', async () => {
      // Create a NUQSAN rule for fullBrothers too (hypothetical)
      const nuqsanBrother = {
        ...FIXTURE_SON_BLOCKS_FULL_BROTHER,
        hijabRuleId: 'HIJAB-FULLBROTHERS-DAUGHTERS-001',
        effectType: 'NUQSAN' as const,
        reducedFraction: { numerator: 1, denominator: 2 },
        blockingCause: 'daughters',
      };

      mockLoadRules.mockResolvedValue([FIXTURE_SON_BLOCKS_FULL_BROTHER, nuqsanBrother]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { fullBrothers: 1, sons: 1, daughters: 1 },
      }, true);

      const brotherStatus = output.heirStatuses.find((s: HeirHijabStatus) => s.heirKey === 'fullBrothers');
      // HIRMAN must win — completely excluded, not just reduced
      expect(brotherStatus!.isCompletelyExcluded).toBe(true);
      expect(brotherStatus!.effectType).toBe('HIRMAN');
    });
  });

  describe('resolve — no applicable rules', () => {
    test('returns NO_BLOCKING_RULES_APPLICABLE when registry returns empty', async () => {
      mockLoadRules.mockResolvedValue([]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { husband: 1, daughters: 2 },
      }, true);

      expect(output.status).toBe('NO_BLOCKING_RULES_APPLICABLE');
      expect(output.resolutionTrace).toHaveLength(0);
      // All heirs should be eligible
      output.heirStatuses.forEach((s: HeirHijabStatus) => {
        expect(s.isEligible).toBe(true);
        expect(s.isCompletelyExcluded).toBe(false);
      });
    });
  });

  describe('resolve — resolution trace', () => {
    test('trace includes all evaluated rules', async () => {
      mockLoadRules.mockResolvedValue([
        FIXTURE_SON_BLOCKS_FULL_BROTHER,
        FIXTURE_SON_REDUCES_MOTHER_SHARE,
        FIXTURE_SON_BLOCKS_PAT_GRANDFATHER,
      ]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { fullBrothers: 1, mother: 1, sons: 1 },
      }, true);

      expect(output.resolutionTrace).toHaveLength(3);

      const appliedRuleIds = output.resolutionTrace
        .filter((t: HijabResolutionTrace) => t.wasApplied)
        .map((t: HijabResolutionTrace) => t.hijabRuleId);

      // Son present and full brothers/mother present — two should be applied
      expect(appliedRuleIds).toContain('HIJAB-FULLBROTHERS-SONS-001');
      expect(appliedRuleIds).toContain('HIJAB-MOTHER-SONS-001');
      // Grandfather rule not applied — grandfather absent
      expect(appliedRuleIds).not.toContain('HIJAB-PATERNALGRANDFATHERS-SONS-001');
    });

    test('trace entries include evidenceRefs', async () => {
      mockLoadRules.mockResolvedValue([FIXTURE_SON_BLOCKS_FULL_BROTHER]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: { fullBrothers: 1, sons: 1 },
      }, true);

      const trace = output.resolutionTrace[0];
      expect(trace.evidenceRefs).toBeDefined();
      expect(trace.evidenceRefs.length).toBeGreaterThan(0);
    });
  });

  describe('resolve — resolvedAt timestamp', () => {
    test('output includes a valid ISO timestamp', async () => {
      mockLoadRules.mockResolvedValue([]);

      const output = await HijabResolverService.resolve({
        madhhab: 'HANAFI',
        presentHeirs: {},
      }, true);

      expect(output.resolvedAt).toBeDefined();
      expect(new Date(output.resolvedAt).getTime()).not.toBeNaN();
    });
  });
});
