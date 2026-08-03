/**
 * MIZAN — Standard & Specialized Navigation Payload Contracts (Phase 15)
 * Standard navigation payloads and discriminated union types for evidence routing.
 */

import { EvidenceNavigationAction } from './evidence-navigation-actions.registry';
import { NavigationOriginContext } from './evidence-navigation-origin.registry';
import { EvidenceSupportsCategory } from './evidence-supports-category.registry';

export interface BaseNavigationPayloadSecurity {
  issuedAt: string;
  expiresAt?: string | null;
  payloadChecksum: string;
  signature?: string | null;
}

export interface StandardRequestedView {
  mode: 'EXPLAIN_EVIDENCE' | 'EXPLAIN_DECISION' | 'EXPLAIN_TERM' | 'EXPLAIN_MADHHAB_CONTEXT' | 'SHOW_ORIGINAL_TEXT' | 'SHOW_APPROVED_TRANSLATION' | 'COMPARE_APPROVED_POSITIONS' | 'CLARIFY_CALCULATION_VALUE';
  displayLanguageTag: string;
  includeApprovedTranslation?: boolean;
  includeOriginalText?: boolean;
  includeRuleRelationship?: boolean;
  selectedTextAnchor?: {
    anchorType: 'VERSE' | 'HADITH_ENTRY' | 'PAGE' | 'SECTION' | 'PARAGRAPH' | 'LINE_RANGE' | 'SOURCE_RECORD';
    sourceRecordId: string;
    pageNumber?: number | null;
    sectionId?: string | null;
    paragraphId?: string | null;
    lineStart?: number | null;
    lineEnd?: number | null;
  } | null;
  suggestedQuestion?: string | null;
}

export interface StandardProfileContext {
  selectedMadhhab: string;
  languageTag: string;
  locale: string;
  currencyCode?: string | null;
}

export interface StandardVersionsContext {
  knowledgeReleaseVersion: string;
  ruleEngineVersion?: string | null;
  evidenceRegistryVersion?: string | null;
  explanationRegistryVersion?: string | null;
}

// ==========================================
// 1. Standalone Evidence Payload
// ==========================================
export interface StandaloneEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_EVIDENCE | typeof EvidenceNavigationAction.OPEN_EVIDENCE_READER | typeof EvidenceNavigationAction.OPEN_RELATED_EXPLANATION | typeof EvidenceNavigationAction.OPEN_RELATED_RULE_DETAILS;
  origin: NavigationOriginContext;
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
  };
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 2. Result Item Evidence Payload
// ==========================================
export interface ResultEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_RESULT_EVIDENCE | typeof EvidenceNavigationAction.OPEN_AI_RULE_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    calculationProfileId: string;
    resultId: string;
    resultVersion: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'HEIR' | 'ZAKAT_CATEGORY' | 'LIVESTOCK_ASSET' | 'HARVEST_GROUP' | 'ESTATE' | 'CALCULATION';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType?: string;
    ruleExecutionResultId?: string;
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType?: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 3. Hijab Evidence Payload
// ==========================================
export interface HijabEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_HIJAB_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    calculationProfileId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'HEIR';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  hijabContext: {
    blockedHeirId: string;
    blockedHeirInstanceId?: string;
    blockers: Array<{
      blockerHeirId: string;
      blockerInstanceId?: string;
    }>;
    hijabType: 'COMPLETE_EXCLUSION' | 'PARTIAL_REDUCTION';
    effectType: string;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType: 'HIJAB_RULE';
    ruleExecutionResultId?: string;
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 4. Mirath Share Evidence Payload
// ==========================================
export interface MirathShareEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_MIRATH_SHARE_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'HEIR';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  mirathDecision: {
    inheritanceStatus: 'FIXED_SHARE' | 'RESIDUARY' | 'BLOCKED' | 'RADD_ALLOCATED' | 'AWL_ADJUSTED';
    exactShare: {
      numerator: number;
      denominator: number;
    };
    decisionCode: string;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType: string;
    ruleExecutionResultId?: string;
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 5. Zakat Evidence Payload
// ==========================================
export interface ZakatEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_ZAKAT_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'ZAKAT_CATEGORY';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  zakatDecision: {
    eligibilityStatus: string;
    nisabStatus: string;
    holdingPeriodStatus: string;
    obligationType: string;
    exactRate?: number | null;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType?: string;
    ruleExecutionResultId?: string;
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 6. Nisab Evidence Payload
// ==========================================
export interface NisabEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_NISAB_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'ZAKAT_CATEGORY';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  nisabContext: {
    status: 'REACHED' | 'NOT_REACHED' | 'REVIEW_REQUIRED';
    nisabMethodRuleId: string;
    thresholdRecordId: string;
    comparisonBase: Record<string, any>;
    valuationSnapshotId?: string | null;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleType: 'ZAKAT_NISAB_RULE';
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 7. Livestock Evidence Payload
// ==========================================
export interface LivestockEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_LIVESTOCK_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'LIVESTOCK_ASSET';
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
  };
  livestockContext: {
    animalTypeId: string;
    herdCount: number;
    scheduleId: string;
    scheduleVersion: string;
    matchedBandId?: string | null;
    matchedPatternId?: string | null;
    obligationDefinitionId: string;
    animalClassIds: string[];
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleType: 'ZAKAT_LIVESTOCK_SCHEDULE';
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 8. Agriculture Evidence Payload
// ==========================================
export interface AgricultureEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_AGRICULTURE_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  subject: {
    subjectType: 'HARVEST_GROUP';
    subjectId: string;
    subjectVersion?: string;
    instanceId: string;
  };
  agricultureContext: {
    produceTypeId: string;
    harvestGroupId: string;
    nisabStatus: string;
    irrigationClassification: string;
    deductionStatus: string;
    exactRate?: number | null;
    obligationType: 'PHYSICAL_PRODUCE' | 'MONETARY_VALUE';
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
    ruleType: string;
    resolvedRuleSnapshotId?: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 9. Report Evidence Payload
// ==========================================
export interface ReportEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_AI_REPORT_EVIDENCE;
  origin: NavigationOriginContext;
  calculation: {
    calculationId: string;
    resultId: string;
    resultSnapshotId: string;
    resultItemId: string;
  };
  report: {
    reportId: string;
    reportVersion: string;
    reportSnapshotId: string;
    reportType: string;
    reportSectionId: string;
    contentBlockId?: string;
    renderingLanguageTag: string;
    reportCurrencyCode: string;
  };
  rule: {
    ruleId: string;
    ruleVersion: string;
  };
  evidence: {
    evidenceId: string;
    evidenceVersion: string;
    resultEvidenceLinkId: string;
    reportEvidenceLinkId?: string;
    supports: EvidenceSupportsCategory;
  };
  explanation?: {
    explanationId?: string | null;
    explanationVersion?: string | null;
  } | null;
  profile: StandardProfileContext;
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// 10. Comparative Madhhab Payload
// ==========================================
export interface ComparativeEvidenceNavigationPayload {
  navigationId: string;
  payloadVersion: '1.0.0';
  action: typeof EvidenceNavigationAction.OPEN_COMPARATIVE_MADHHAB_EVIDENCE;
  origin: NavigationOriginContext;
  comparison: {
    comparisonRecordId: string;
    comparisonRecordVersion: string;
    topic: string;
    primaryMadhhab: string;
    requestedComparisonMadhhabs: string[];
  };
  evidence: {
    evidenceIdsByMadhhab: Record<string, string[]>;
  };
  versions: StandardVersionsContext;
  requestedView?: StandardRequestedView;
  security: BaseNavigationPayloadSecurity;
}

// ==========================================
// Discriminated Union of All Payloads
// ==========================================
export type EvidenceNavigationPayload =
  | StandaloneEvidenceNavigationPayload
  | ResultEvidenceNavigationPayload
  | HijabEvidenceNavigationPayload
  | MirathShareEvidenceNavigationPayload
  | ZakatEvidenceNavigationPayload
  | NisabEvidenceNavigationPayload
  | LivestockEvidenceNavigationPayload
  | AgricultureEvidenceNavigationPayload
  | ReportEvidenceNavigationPayload
  | ComparativeEvidenceNavigationPayload;
