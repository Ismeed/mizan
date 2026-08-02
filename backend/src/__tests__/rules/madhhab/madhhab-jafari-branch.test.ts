import { MadhhabFilterService } from '../../../features/rules/services/madhhab-filter.service';
import { CanonicalRule } from '@mizan/shared';

const buildRule = (id: string, scopeList: any[]): CanonicalRule => ({
  identity: { ruleId: id, ruleVersion: '1.0.0' },
  titles: { titleEn: `Rule ${id}`, descriptionEn: 'Test' },
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

describe('Phase 5 — Jafari Full-Branch Isolation', () => {
  const sunniConsensusRule = buildRule('RULE-SUNNI-CONSENSUS', ['ALL_SUNNI']);
  const jafariClass1Rule = buildRule('RULE-JAFARI-CLASS-1', ['JAFARI']);

  const candidatePool = [sunniConsensusRule, jafariClass1Rule];

  it('never returns Jafari full-branch rules for Sunni madhhabs (HANAFI, MALIKI, SHAFII, HANBALI)', () => {
    const sunniSchools = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI'];

    for (const school of sunniSchools) {
      const res = MadhhabFilterService.filterRules(candidatePool, school);
      const ids = res.applicableRules.map(r => r.identity.ruleId);
      expect(ids).toContain('RULE-SUNNI-CONSENSUS');
      expect(ids).not.toContain('RULE-JAFARI-CLASS-1');
    }
  });

  it('never returns Sunni-only ALL_SUNNI rules for JAFARI madhhab', () => {
    const res = MadhhabFilterService.filterRules(candidatePool, 'JAFARI');
    const ids = res.applicableRules.map(r => r.identity.ruleId);
    expect(ids).toContain('RULE-JAFARI-CLASS-1');
    expect(ids).not.toContain('RULE-SUNNI-CONSENSUS');
  });
});
