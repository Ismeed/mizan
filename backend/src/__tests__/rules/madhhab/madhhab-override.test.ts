import { MadhhabOverrideService } from '../../../features/rules/services/madhhab-override.service';
import { CanonicalRule } from '@mizan/shared';

const buildRule = (id: string, scopeList: any[], priority: number = 0): CanonicalRule => ({
  identity: { ruleId: id, ruleVersion: '1.0.0', ruleFamilyId: 'FAM-RADD-01' },
  titles: { titleEn: `Rule ${id}`, descriptionEn: 'Test' },
  scope: { module: 'MIRATH', ruleType: 'MIRATH_ADJUSTMENT', madhhabScope: scopeList, knowledgeReleaseVersion: '1.0.0', priority },
  applicability: { conditions: { type: 'LEAF', factsPath: 'heirs.spouse', operator: 'EQUALS', value: 'WIFE' } as any },
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
  versioning: { contentChecksum: 'test-checksum' },
});

describe('Phase 5 — MadhhabOverrideService', () => {
  const baseSunniRule = buildRule('RULE-BASE-SUNNI', ['ALL_SUNNI']);
  const malikiOverride = buildRule('RULE-OVERRIDE-MALIKI', ['MALIKI']);

  it('selects explicit single madhhab override over ALL_SUNNI rule for MALIKI', () => {
    const res = MadhhabOverrideService.resolveFamilyOverride([baseSunniRule, malikiOverride], 'MALIKI');
    expect(res.selectedRule.identity.ruleId).toBe('RULE-OVERRIDE-MALIKI');
    expect(res.overrideApplied).toBe(true);
    expect(res.specificityRank).toBe(3);
  });

  it('falls back to ALL_SUNNI rule for HANAFI when no explicit HANAFI override exists', () => {
    const res = MadhhabOverrideService.resolveFamilyOverride([baseSunniRule, malikiOverride], 'HANAFI');
    // For HANAFI, malikiOverride has rank 0 (not applicable), so baseSunniRule wins with rank 2
    expect(res.selectedRule.identity.ruleId).toBe('RULE-BASE-SUNNI');
    expect(res.specificityRank).toBe(2);
  });

  it('computes specificity ranks accurately', () => {
    expect(MadhhabOverrideService.getMadhhabSpecificityRank(malikiOverride, 'MALIKI')).toBe(3);
    expect(MadhhabOverrideService.getMadhhabSpecificityRank(baseSunniRule, 'HANBALI')).toBe(2);
    const globalRule = buildRule('RULE-GLOBAL', ['ALL_SCHOOLS']);
    expect(MadhhabOverrideService.getMadhhabSpecificityRank(globalRule, 'JAFARI')).toBe(1);
  });
});
