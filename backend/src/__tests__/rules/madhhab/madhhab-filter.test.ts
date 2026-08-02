import { MadhhabFilterService } from '../../../features/rules/services/madhhab-filter.service';
import { CanonicalRule } from '@mizan/shared';

const buildTestRule = (id: string, scopeList: any[]): CanonicalRule => ({
  identity: { ruleId: id, ruleVersion: '1.0.0' },
  titles: { titleEn: `Test Rule ${id}`, descriptionEn: 'Fixture' },
  scope: { module: 'MIRATH', ruleType: 'MIRATH_FIXED_SHARE', madhhabScope: scopeList, knowledgeReleaseVersion: '1.0.0' },
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

describe('Phase 5 — MadhhabFilterService', () => {
  const hanafiRule = buildTestRule('RULE-HANAFI', ['HANAFI']);
  const malikiRule = buildTestRule('RULE-MALIKI', ['MALIKI']);
  const sunniRule = buildTestRule('RULE-SUNNI', ['ALL_SUNNI']);
  const globalRule = buildTestRule('RULE-GLOBAL', ['ALL_SCHOOLS']);
  const jafariRule = buildTestRule('RULE-JAFARI', ['JAFARI']);

  const allRules = [hanafiRule, malikiRule, sunniRule, globalRule, jafariRule];

  it('filters rules correctly for HANAFI madhhab', () => {
    const res = MadhhabFilterService.filterRules(allRules, 'HANAFI');
    const ids = res.applicableRules.map(r => r.identity.ruleId);
    expect(ids).toContain('RULE-HANAFI');
    expect(ids).toContain('RULE-SUNNI');
    expect(ids).toContain('RULE-GLOBAL');
    expect(ids).not.toContain('RULE-MALIKI');
    expect(ids).not.toContain('RULE-JAFARI');
  });

  it('filters rules correctly for MALIKI madhhab', () => {
    const res = MadhhabFilterService.filterRules(allRules, 'MALIKI');
    const ids = res.applicableRules.map(r => r.identity.ruleId);
    expect(ids).toContain('RULE-MALIKI');
    expect(ids).toContain('RULE-SUNNI');
    expect(ids).toContain('RULE-GLOBAL');
    expect(ids).not.toContain('RULE-HANAFI');
    expect(ids).not.toContain('RULE-JAFARI');
  });

  it('filters rules correctly for JAFARI madhhab — excludes ALL_SUNNI', () => {
    const res = MadhhabFilterService.filterRules(allRules, 'JAFARI');
    const ids = res.applicableRules.map(r => r.identity.ruleId);
    expect(ids).toContain('RULE-JAFARI');
    expect(ids).toContain('RULE-GLOBAL');
    expect(ids).not.toContain('RULE-SUNNI');
    expect(ids).not.toContain('RULE-HANAFI');
    expect(ids).not.toContain('RULE-MALIKI');
  });

  it('isScopeApplicable returns expected booleans', () => {
    expect(MadhhabFilterService.isScopeApplicable('HANAFI', 'HANAFI')).toBe(true);
    expect(MadhhabFilterService.isScopeApplicable('ALL_SUNNI', 'SHAFII')).toBe(true);
    expect(MadhhabFilterService.isScopeApplicable('ALL_SUNNI', 'JAFARI')).toBe(false);
    expect(MadhhabFilterService.isScopeApplicable('ALL_SCHOOLS', 'JAFARI')).toBe(true);
  });
});
