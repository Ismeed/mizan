import { MadhhabResolutionService } from '../../../features/rules/services/madhhab-resolution.service';
import { CanonicalRule } from '@mizan/shared';

const buildRule = (id: string, familyId: string | undefined, scopeList: any[]): CanonicalRule => ({
  identity: { ruleId: id, ruleVersion: '1.0.0', ruleFamilyId: familyId },
  titles: { titleEn: `Rule ${id}`, descriptionEn: 'Test' },
  scope: { module: 'MIRATH', ruleType: 'MIRATH_FIXED_SHARE', madhhabScope: scopeList, knowledgeReleaseVersion: '1.0.0' },
  applicability: { conditions: { type: 'LEAF', factsPath: 'heirs.wife.count', operator: 'GREATER_THAN', value: 0 } as any },
  decisions: [],
  evidenceRefs: [],
  explanationRefs: [],
  governance: {
    status: 'APPROVED',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '1.0.0',
    createdBy: 'TEST',
    createdAt: new Date().toISOString(),
    updatedBy: 'TEST',
    updatedAt: new Date().toISOString(),
  },
  versioning: { contentChecksum: 'checksum' },
});

describe('Phase 5 — MadhhabResolutionService', () => {
  const baseRule = buildRule('RULE-BASE', 'FAM-WIFE-01', ['ALL_SUNNI']);
  const malikiRule = buildRule('RULE-MALIKI-OVERRIDE', 'FAM-WIFE-01', ['MALIKI']);
  const standaloneRule = buildRule('RULE-STANDALONE', undefined, ['ALL_SCHOOLS']);

  const candidateRules = [baseRule, malikiRule, standaloneRule];
  const facts = { heirs: { wife: { count: 1 } } };

  it('resolves MALIKI madhhab with NARROW_OVERRIDE strategy', async () => {
    const output = await MadhhabResolutionService.resolveForMadhhab({
      candidateRules,
      facts,
      madhhab: 'MALIKI',
    });

    expect(output.status).toBe('RESOLVED');
    const resolvedIds = output.resolvedRules.map(r => r.identity.ruleId);
    expect(resolvedIds).toContain('RULE-MALIKI-OVERRIDE');
    expect(resolvedIds).toContain('RULE-STANDALONE');
    expect(resolvedIds).not.toContain('RULE-BASE');

    const branch = output.branchesSelected.find(b => b.ruleFamilyId === 'FAM-WIFE-01');
    expect(branch?.branchStrategy).toBe('NARROW_OVERRIDE');
  });

  it('resolves HANAFI madhhab with SHARED_BASE strategy', async () => {
    const output = await MadhhabResolutionService.resolveForMadhhab({
      candidateRules,
      facts,
      madhhab: 'HANAFI',
    });

    expect(output.status).toBe('RESOLVED');
    const resolvedIds = output.resolvedRules.map(r => r.identity.ruleId);
    expect(resolvedIds).toContain('RULE-BASE');
    expect(resolvedIds).toContain('RULE-STANDALONE');
    expect(resolvedIds).not.toContain('RULE-MALIKI-OVERRIDE');
  });

  it('returns NO_RULES_MATCHED when conditions do not match facts', async () => {
    const output = await MadhhabResolutionService.resolveForMadhhab({
      candidateRules,
      facts: { heirs: { wife: { count: 0 } } },
      madhhab: 'HANAFI',
    });

    expect(output.status).toBe('NO_RULES_MATCHED');
    expect(output.resolvedRules).toHaveLength(0);
  });
});
