import { StructuredRuleEvidenceLink } from '../../../../packages/shared/src/types/evidence/rule-evidence-link.types';

describe('Evidence Relationships & Rule Links Standard Tests (Phase 4)', () => {
  const sampleLink: StructuredRuleEvidenceLink = {
    linkId: 'LINK-MIRATH-WIFE-001',
    rule: {
      ruleId: 'MIRATH-FIXED_SHARE-WIFE-001',
      ruleVersion: '1.0.0',
    },
    evidence: {
      evidenceId: 'QURAN-004-012-012',
      evidenceVersion: '1.0.0',
    },
    relationship: {
      type: 'PRIMARY_EVIDENCE',
      supports: 'DECISION',
    },
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    display: {
      showInResult: true,
      showInPdf: true,
      showInAIContext: true,
      displayPriority: 1,
    },
    governance: {
      status: 'APPROVED',
      reviewedBy: ['SCHOLAR_001'],
    },
  };

  it('verifies structured rule-evidence link payload properties', () => {
    expect(sampleLink.relationship.type).toBe('PRIMARY_EVIDENCE');
    expect(sampleLink.relationship.supports).toBe('DECISION');
    expect(sampleLink.display.showInResult).toBe(true);
    expect(sampleLink.display.showInPdf).toBe(true);
    expect(sampleLink.display.showInAIContext).toBe(true);
  });
});
