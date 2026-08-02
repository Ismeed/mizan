/**
 * Structured Rule-to-Evidence Link Record Standard (Phase 4)
 * Upgrades flat evidence links to precise support metadata.
 */

export type EvidenceSupportCategory =
  | 'APPLICABILITY'
  | 'DECISION'
  | 'RATE'
  | 'FRACTION'
  | 'BLOCKING'
  | 'ELIGIBILITY'
  | 'EXCEPTION'
  | 'EXPLANATION';

export type RuleEvidenceRelationshipKind =
  | 'PRIMARY_EVIDENCE'
  | 'SECONDARY_EVIDENCE'
  | 'MADHHAB_EXCEPTION_EVIDENCE'
  | 'EXPLANATORY_EVIDENCE';

export interface StructuredRuleEvidenceLink {
  linkId: string;
  rule: {
    ruleId: string;
    ruleVersion: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
  };
  relationship: {
    type: RuleEvidenceRelationshipKind;
    supports: EvidenceSupportCategory;
  };
  madhhabScope: {
    appliesTo: string[];
  };
  display: {
    showInResult: boolean;
    showInPdf: boolean;
    showInAIContext: boolean;
    displayPriority: number;
  };
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'REJECTED';
    reviewedBy: string[];
  };
}
