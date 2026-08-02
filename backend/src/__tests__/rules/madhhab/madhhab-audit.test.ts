import { MadhhabResolutionTrace, MadhhabResolutionOutput } from '@mizan/shared';

describe('Phase 5 — MadhhabResolutionAudit Trace Structure', () => {
  it('builds a valid resolution trace payload for audit logging', () => {
    const traceItem: MadhhabResolutionTrace = {
      ruleId: 'RULE-MIRATH-MOTHER-01',
      ruleVersion: '1.0.0',
      titleEn: 'Mother 1/6 Share',
      madhhab: 'HANAFI',
      selectionReason: 'Shared base rule for Sunni consensus',
      conditionCount: 2,
      priority: 0,
      wasOverridden: false,
      branchStrategy: 'SHARED_BASE',
      madhhabFiltered: true,
      overrideApplied: false,
    };

    expect(traceItem.ruleId).toBe('RULE-MIRATH-MOTHER-01');
    expect(traceItem.madhhabFiltered).toBe(true);
    expect(traceItem.branchStrategy).toBe('SHARED_BASE');
  });

  it('validates MadhhabResolutionOutput object fields', () => {
    const output: MadhhabResolutionOutput = {
      status: 'RESOLVED',
      resolvedRules: [],
      resolutionTrace: [],
      branchesSelected: [
        {
          ruleFamilyId: 'FAM-MOTHER-01',
          branchStrategy: 'SHARED_BASE',
          selectedRuleId: 'RULE-MIRATH-MOTHER-01',
        },
      ],
      resolvedAt: new Date().toISOString(),
    };

    expect(output.status).toBe('RESOLVED');
    expect(output.branchesSelected).toHaveLength(1);
  });
});
