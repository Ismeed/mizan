/**
 * MIZAN — Hijab Audit Service Tests (Phase 6)
 *
 * Tests the audit record writing logic using mocked Prisma.
 */

import { HijabAuditService } from '../../features/rules/services/hijab-audit.service';
import type { HijabResolutionAuditInput, HeirHijabStatus, HijabResolutionTrace } from '@mizan/shared';

// Mock Prisma
jest.mock('../../config/database', () => ({
  prisma: {
    hijabResolutionAudit: {
      create: jest.fn().mockResolvedValue({ id: 'test-audit-id' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    hijabRule: {
      findUnique: jest.fn().mockResolvedValue({ id: 'test-hijab-rule-db-id' }),
    },
    hijabResolutionAuditRuleLink: {
      upsert: jest.fn().mockResolvedValue({}),
    },
  },
}));

import { prisma } from '../../config/database';

const mockAuditCreate = (prisma as any).hijabResolutionAudit.create as jest.MockedFunction<any>;
const mockFindMany = (prisma as any).hijabResolutionAudit.findMany as jest.MockedFunction<any>;
const mockRuleUpsert = (prisma as any).hijabResolutionAuditRuleLink.upsert as jest.MockedFunction<any>;

const sampleHeirStatus: HeirHijabStatus = {
  heirKey: 'fullBrothers',
  isEligible: false,
  isCompletelyExcluded: true,
  isReduced: false,
  blockedBy: 'sons',
  appliedHijabRuleId: 'HIJAB-FULLBROTHERS-SONS-001',
  appliedHijabRuleVersion: '1.0.0',
  madhhab: 'HANAFI',
  effectType: 'HIRMAN',
};

const sampleTrace: HijabResolutionTrace = {
  hijabRuleId: 'HIJAB-FULLBROTHERS-SONS-001',
  hijabRuleVersion: '1.0.0',
  titleEn: '[TEST] Son blocks Full Brother',
  blockedHeirKey: 'fullBrothers',
  blockingCause: 'sons',
  effectType: 'HIRMAN',
  category: 'HAJB_BIL_SHAKHSY',
  madhhab: 'HANAFI',
  wasApplied: true,
  applicationReason: 'Blocking heir "sons" is present',
  evidenceRefs: [],
};

const sampleInput: HijabResolutionAuditInput = {
  calculationId: 'test-calc-001',
  madhhab: 'HANAFI',
  profileId: 'test-profile-001',
  presentHeirsJson: { fullBrothers: 2, sons: 1 },
  rulesEvaluatedCount: 3,
  rulesAppliedCount: 1,
  heirStatusesJson: [sampleHeirStatus],
  resolutionTraceJson: [sampleTrace],
  hasPartialResolution: false,
};

describe('HijabAuditService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('writeAudit', () => {
    test('writes audit record with correct data', async () => {
      await HijabAuditService.writeAudit(sampleInput);

      expect(mockAuditCreate).toHaveBeenCalledTimes(1);
      const callArgs = mockAuditCreate.mock.calls[0][0].data;
      expect(callArgs.calculation_id).toBe('test-calc-001');
      expect(callArgs.madhhab).toBe('HANAFI');
      expect(callArgs.rules_evaluated_count).toBe(3);
      expect(callArgs.rules_applied_count).toBe(1);
      expect(callArgs.has_partial_resolution).toBe(false);
    });

    test('creates rule link for applied hijab rule', async () => {
      await HijabAuditService.writeAudit(sampleInput);

      expect(mockRuleUpsert).toHaveBeenCalledTimes(1);
      const linkArgs = mockRuleUpsert.mock.calls[0][0];
      expect(linkArgs.create.was_applied).toBe(true);
      expect(linkArgs.create.blocked_heir_key).toBe('fullBrothers');
      expect(linkArgs.create.effect_type).toBe('HIRMAN');
    });

    test('does not create rule links when no hijab rules were applied', async () => {
      const inputNoApplied: HijabResolutionAuditInput = {
        ...sampleInput,
        heirStatusesJson: [{
          heirKey: 'husband',
          isEligible: true,
          isCompletelyExcluded: false,
          isReduced: false,
          madhhab: 'HANAFI',
          // No appliedHijabRuleId
        }],
        rulesAppliedCount: 0,
      };

      await HijabAuditService.writeAudit(inputNoApplied);

      expect(mockAuditCreate).toHaveBeenCalledTimes(1);
      expect(mockRuleUpsert).not.toHaveBeenCalled();
    });

    test('does not throw if audit write fails — audit errors must not crash calculations', async () => {
      mockAuditCreate.mockRejectedValueOnce(new Error('DB connection lost'));

      await expect(
        HijabAuditService.writeAudit(sampleInput)
      ).resolves.not.toThrow();
    });
  });

  describe('getAuditForCalculation', () => {
    test('returns audit records for a calculation', async () => {
      mockFindMany.mockResolvedValueOnce([{ id: 'audit-1' }]);

      const records = await HijabAuditService.getAuditForCalculation('test-calc-001');
      expect(records).toHaveLength(1);
    });

    test('returns empty array on DB error without throwing', async () => {
      mockFindMany.mockRejectedValueOnce(new Error('DB error'));

      const records = await HijabAuditService.getAuditForCalculation('test-calc-001');
      expect(records).toEqual([]);
    });
  });
});
