/**
 * MIZAN — Hydration, Preview, AI Context & Token Contracts (Phase 15)
 * Defines server-side hydrated context, verified AI context snapshots,
 * tokens, previews, and error contracts.
 */

import { EvidenceNavigationPayload } from './evidence-navigation-payload.types';
import { EvidenceSupportsCategory } from './evidence-supports-category.registry';

export type HydrationStatus =
  | 'VERIFIED'
  | 'HISTORICAL_VERIFIED'
  | 'INVALID'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'INTEGRITY_FAILURE';

export interface VerifiedHydratedNavigationContext {
  status: HydrationStatus;
  verifiedNavigation: EvidenceNavigationPayload;
  calculationProfile?: Record<string, any> | null;
  resultItem?: Record<string, any> | null;
  appliedRule?: Record<string, any> | null;
  evidence: Record<string, any>;
  explanation?: Record<string, any> | null;
  restrictions: MandatoryAIRestrictions;
  audit: {
    hydratedAt: string;
    hydratedByService: string;
    checksumMatch: boolean;
    traceId: string;
  };
}

export interface MandatoryAIRestrictions {
  mustNotRecalculate: true;
  mustNotChangeDecision: true;
  mustNotChangeMadhhab: true;
  mustNotInventEvidence: true;
  mustNotInventSourceText: true;
  mustNotInventTranslation: true;
  mustNotInventRule: true;
  mustNotInventException: true;
  mustNotPresentCommentaryAsEvidence: true;
  mustNotUseUnapprovedComparativeContext: true;
  mustUseProvidedVerifiedContext: true;
  mustDiscloseInsufficientContext: true;
}

export function getMandatoryAIRestrictions(): MandatoryAIRestrictions {
  return {
    mustNotRecalculate: true,
    mustNotChangeDecision: true,
    mustNotChangeMadhhab: true,
    mustNotInventEvidence: true,
    mustNotInventSourceText: true,
    mustNotInventTranslation: true,
    mustNotInventRule: true,
    mustNotInventException: true,
    mustNotPresentCommentaryAsEvidence: true,
    mustNotUseUnapprovedComparativeContext: true,
    mustUseProvidedVerifiedContext: true,
    mustDiscloseInsufficientContext: true,
  };
}

export interface AIEvidenceContextV2 {
  task: 'EXPLAIN_VERIFIED_EVIDENCE' | 'EXPLAIN_DECISION' | 'EXPLAIN_TERM' | 'EXPLAIN_MADHHAB_CONTEXT' | 'SHOW_ORIGINAL_TEXT' | 'SHOW_APPROVED_TRANSLATION' | 'COMPARE_APPROVED_POSITIONS' | 'CLARIFY_CALCULATION_VALUE';
  navigation: {
    navigationId: string;
    action: string;
    payloadVersion: string;
    originType: string;
  };
  calculationContext?: {
    calculationId?: string;
    resultId?: string;
    resultItemId?: string;
    module: 'MIRATH' | 'ZAKAT';
    selectedMadhhab: string;
    languageTag: string;
    locale: string;
    currencyCode: string;
    knowledgeReleaseVersion: string;
    ruleEngineVersion: string;
  } | null;
  subjectContext?: {
    subjectType: string;
    subjectId: string;
    subjectVersion?: string;
    instanceId?: string;
    approvedLocalizedLabel: string;
  } | null;
  decisionContext?: {
    status: string;
    decisionCode: string;
    decisionType: string;
    authoritativePayload: Record<string, any>;
    exactValues: Record<string, any>;
    monetaryValues: any[];
  } | null;
  ruleContext?: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType?: string;
    selectedMadhhab: string;
    resolvedRuleSnapshotId?: string;
    approvedRuleSummary: string;
  } | null;
  evidenceContext: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
    canonicalReference: string;
    originalText?: string | null;
    approvedTranslations: Array<{
      languageTag: string;
      translationText: string;
      attributionText: string;
    }>;
    sourceMetadata: Record<string, any>;
    supports: EvidenceSupportsCategory;
    evidenceLinkId?: string;
  };
  explanationContext?: {
    explanationId: string;
    explanationVersion: string;
    approvedShortExplanation: string;
    approvedFullExplanation: string;
    approvedEducationalExplanation?: string;
  } | null;
  restrictions: MandatoryAIRestrictions;
  integrity: {
    contextChecksum: string;
    verifiedAt: string;
  };
}

export interface AIEvidenceContextSnapshot {
  aiContextSnapshotId: string;
  navigationId: string;
  calculationId?: string | null;
  resultId?: string | null;
  resultItemId?: string | null;
  contextPayload: AIEvidenceContextV2;
  selectedMadhhab: string;
  languageTag: string;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  restrictions: MandatoryAIRestrictions;
  contextChecksum: string;
  createdAt: string;
  isImmutable: boolean;
}

export interface EvidencePreviewContract {
  navigationId: string;
  evidencePreview: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
    citation: {
      short: string;
      full: string;
      languageTag: string;
      direction: 'LTR' | 'RTL';
    };
    approvedTextPreview: string;
    supports: EvidenceSupportsCategory;
    relatedDecisionSummary: string;
    selectedMadhhab: string;
    approvedExplanationPreview?: string;
    availableActions: string[];
  };
}

export interface NavigationTokenRecord {
  tokenId: string;
  navigationId: string;
  userScope: string;
  calculationId?: string | null;
  reportId?: string | null;
  issuedAt: string;
  expiresAt: string;
  singleUse: boolean;
  revokedAt?: string | null;
  payloadChecksum: string;
  signature: string;
}

export type NavigationErrorCode =
  | 'INVALID_NAVIGATION_PAYLOAD'
  | 'UNSUPPORTED_PAYLOAD_VERSION'
  | 'UNKNOWN_NAVIGATION_ACTION'
  | 'UNKNOWN_ORIGIN_TYPE'
  | 'MISSING_EVIDENCE_ID'
  | 'EVIDENCE_NOT_FOUND'
  | 'EVIDENCE_VERSION_NOT_FOUND'
  | 'RESULT_NOT_FOUND'
  | 'RESULT_ITEM_NOT_FOUND'
  | 'REPORT_NOT_FOUND'
  | 'REPORT_SECTION_NOT_FOUND'
  | 'RULE_NOT_FOUND'
  | 'EXPLANATION_NOT_FOUND'
  | 'EVIDENCE_LINK_NOT_FOUND'
  | 'EVIDENCE_NOT_LINKED_TO_RESULT'
  | 'MADHHAB_SCOPE_MISMATCH'
  | 'KNOWLEDGE_RELEASE_MISMATCH'
  | 'HISTORICAL_VERSION_MISMATCH'
  | 'PAYLOAD_CHECKSUM_MISMATCH'
  | 'INVALID_NAVIGATION_SIGNATURE'
  | 'NAVIGATION_TOKEN_EXPIRED'
  | 'NAVIGATION_TOKEN_REVOKED'
  | 'UNAUTHORIZED_CALCULATION_ACCESS'
  | 'UNAUTHORIZED_REPORT_ACCESS'
  | 'AI_CONTEXT_INTEGRITY_FAILURE'
  | 'COMPARATIVE_CONTEXT_UNAVAILABLE'
  | 'OFFLINE_CONTEXT_INCOMPLETE';

export interface EvidenceNavigationErrorResponse {
  status: 'INVALID' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'INTEGRITY_FAILURE';
  error: {
    errorCode: NavigationErrorCode;
    category: 'VALIDATION' | 'AUTHORIZATION' | 'INTEGRITY' | 'SYSTEM';
    fieldPath?: string;
    navigationId?: string;
    calculationId?: string;
    resultId?: string;
    resultItemId?: string;
    evidenceId?: string;
    retryable: boolean;
    reviewRequired: boolean;
    messageKey: string;
    message?: string;
  };
}
