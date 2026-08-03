/**
 * Canonical Verified AI Evidence Context Envelope (Phase 16)
 * Immutable, checksummed, provider-neutral context package.
 */

import { AIEvidenceContextType } from './ai-evidence-context-type.registry';
import { AIEvidenceContextBinding } from './ai-evidence-context-binding.registry';
import { AIEvidenceContextCompletenessStatus } from './ai-evidence-context-completeness.registry';
import { StrictAIEvidenceRestrictions } from './ai-evidence-restrictions.types';

export interface EvidenceTextSegmentContract {
  segmentId: string;
  contentClassification:
    | 'ORIGINAL_SOURCE_TEXT'
    | 'APPROVED_TRANSCRIPTION'
    | 'APPROVED_TRANSLATION'
    | 'APPROVED_SUMMARY'
    | 'APPROVED_COMMENTARY';
  languageTag: string;
  direction: 'LTR' | 'RTL';
  text: string;
  sourceAnchor?: {
    anchorType: 'VERSE' | 'HADITH_ENTRY' | 'PAGE' | 'SECTION' | 'PARAGRAPH' | 'LINE_RANGE';
    sourceRecordId: string;
    anchorData: Record<string, any>;
  };
  reviewStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  contentChecksum: string;
}

export interface ApprovedTranslationContract {
  translationId: string;
  translationVersion: string;
  languageTag: string;
  translationType: 'DIRECT_APPROVED_TRANSLATION' | 'APPROVED_ADAPTATION' | 'APPROVED_SUMMARY';
  text: string;
  translatorAttribution: string;
  sourceLanguageTag: string;
  approvalStatus: 'APPROVED' | 'PENDING';
  usagePolicy: {
    mayDisplayAsDirectTranslation: boolean;
    mayUseForAIExplanation: boolean;
    mustDisplayAttribution: boolean;
  };
  translationChecksum: string;
}

export interface VerifiedAIEvidenceContextEnvelope {
  aiEvidenceContextId: string;
  contextSchemaVersion: '1.0.0';

  task: 'EXPLAIN_VERIFIED_EVIDENCE';
  contextType: AIEvidenceContextType;
  binding: AIEvidenceContextBinding;
  completenessStatus: AIEvidenceContextCompletenessStatus;

  navigationContext: {
    navigationId: string;
    navigationPayloadVersion: string;
    action: string;
    originType: string;
    origin: {
      screenId?: string;
      routeId?: string;
      reportId?: string | null;
      reportSectionId?: string | null;
      returnRouteReference?: string | null;
    };
    requestedViewMode: 'EXPLAIN_EVIDENCE';
    navigationValidated: boolean;
    authorizationValidated: boolean;
  };

  calculationContext: {
    calculationId: string;
    calculationProfileId: string;
    resultId: string;
    resultVersion: string;
    resultSchemaVersion: string;
    resultSnapshotId: string;
    resultItemId: string;
    module: 'MIRATH' | 'ZAKAT';
    resultStatus: 'COMPLETED' | 'PENDING';
    selectedMadhhab: 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI';
    profile: {
      languageTag: string;
      locale: string;
      direction: 'LTR' | 'RTL';
      calculationCurrencyCode: string;
      reportCurrencyCode: string;
      countryCode: string;
      regionCode?: string | null;
    };
    versions: {
      knowledgeReleaseVersion: string;
      ruleEngineVersion: string;
      evidenceRegistryVersion: string;
      explanationRegistryVersion: string;
    };
    historical: {
      isHistorical: boolean;
      originalCalculationDate: string;
      mustUseCapturedVersions: boolean;
    };
  } | null;

  reportContext: {
    reportId: string;
    reportVersion: string;
    reportSchemaVersion: string;
    reportSnapshotId: string;
    reportType: string;
    reportSectionId: string;
    contentBlockId?: string;
    sourceResultId?: string;
    sourceResultSnapshotId?: string;
    rendering: {
      languageTag: string;
      locale: string;
      reportCurrencyCode: string;
      historicalRendering: boolean;
      alternativeCurrencyRendering: boolean;
    };
    reportIntegrityValidated: boolean;
  } | null;

  subjectContext: {
    subjectType: 'HEIR' | 'ZAKAT_CATEGORY' | 'LIVESTOCK_ASSET' | 'HARVEST_GROUP' | 'ESTATE' | 'CALCULATION';
    subjectId: string;
    subjectVersion: string;
    instanceId?: string;
    approvedLabels: {
      requestedLanguageTag: string;
      resolvedLanguageTag: string;
      shortLabel: string;
      fullLabel: string;
    };
    safeCaseFacts: Record<string, any>;
  } | null;

  decisionContext: {
    itemType: string;
    status: string;
    decisionCode: string;
    decisionType: string;
    authoritativePayload: Record<string, any>;
    exactValues: {
      fractions: string[];
      rates: number[];
      quantities: number[];
      counts: number[];
    };
    monetaryValues: Array<{ amount: number; currency: string; label: string }>;
    warnings: string[];
    review?: any;
    authoritativeResultChecksum: string;
  } | null;

  ruleContext: {
    ruleId: string;
    ruleVersion: string;
    ruleFamilyId?: string;
    ruleType: string;
    module: 'MIRATH' | 'ZAKAT';
    selectedMadhhab: string;
    resolution: {
      resolutionMode: string;
      baseRule?: { ruleId: string; ruleVersion: string };
      appliedOverrides?: string[];
      parallelBranchId?: string | null;
      resolvedRuleSnapshotId: string;
      resolvedRuleChecksum: string;
    };
    approvedRuleSummary: {
      summaryId: string;
      summaryVersion: string;
      text: string;
    };
    decisionRelationship: 'PRIMARY' | 'SUPPORTING' | 'CONDITIONAL';
    ruleExecutionResultId?: string;
    ruleScopeValidated: boolean;
  } | null;

  evidenceContext: {
    evidenceId: string;
    evidenceVersion: string;
    evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
    canonicalReference: {
      referenceType: string;
      sourceId: string;
      sourceVersion: string;
      referenceData: Record<string, any>;
    };
    sourceText: {
      availability: 'AVAILABLE' | 'RESTRICTED' | 'NOT_INCLUDED' | 'REVIEW_REQUIRED';
      segments: EvidenceTextSegmentContract[];
    };
    translations: ApprovedTranslationContract[];
    sourceMetadata: {
      title: string;
      authorOrCompiler?: string | null;
      editionId?: string | null;
      publisher?: string | null;
      volume?: string | null;
      page?: string | null;
      chapter?: string | null;
      section?: string | null;
      sourceRecordId: string;
      licenceOrUsagePolicyId?: string;
    };
    relationship: {
      resultEvidenceLinkId?: string;
      supports: string;
      relatedRuleId: string;
      relatedRuleVersion: string;
      relationshipValidated: boolean;
    };
    madhhabScope: {
      appliesTo: string[];
      scopeValidatedForSelectedMadhhab: boolean;
    };
    knowledgeReleaseMembership: {
      knowledgeReleaseVersion: string;
      membershipValidated: boolean;
    };
    integrity: {
      evidenceChecksum: string;
      sourceTextChecksum: string;
      translationPackageChecksum: string;
    };
  };

  explanationContext: {
    explanationId: string;
    explanationVersion: string;
    explanationType: string;
    selectedMadhhab: string;
    approvedContent: {
      requestedLanguageTag: string;
      resolvedLanguageTag: string;
      fallbackUsed: boolean;
      title: string;
      short: string;
      full: string;
      educational?: string;
    };
    relationships: {
      ruleIds: string[];
      evidenceIds: string[];
      resultItemId?: string;
    };
    madhhabScopeValidated: boolean;
    explanationChecksum: string;
  } | null;

  comparativeContext: {
    comparisonRecordId: string;
    comparisonRecordVersion: string;
    topic: string;
    madhhabs: Array<{
      madhhabId: string;
      approvedPositionSummary: string;
      ruleIds: string[];
      evidenceIds: string[];
    }>;
    comparisonScope: {
      allowedQuestions: string[];
      prohibitedInferences: string[];
    };
    comparisonChecksum: string;
  } | null;

  localizationContext: {
    requestedLanguageTag: string;
    resolvedLanguageTag: string;
    locale: string;
    direction: 'LTR' | 'RTL';
    fallback: {
      used: boolean;
      fromLanguageTag: string | null;
      reasonCode: string | null;
    };
    terminologyVersion: string;
    approvedTerms: Array<{
      termId: string;
      preferredText: string;
      definitionExplanationId?: string;
    }>;
    responseLanguagePolicy: 'RESPOND_IN_RESOLVED_LANGUAGE';
  };

  currencyContext: {
    calculationCurrencyCode: string;
    reportCurrencyCode: string;
    originalMoneyValues: Array<{ amount: number; currency: string }>;
    displayMoneyValues: Array<{ amount: number; currency: string }>;
    exchangeRateSnapshots: Array<{ fromCurrency: string; toCurrency: string; rate: number; timestamp: string }>;
    valuationSnapshots: any[];
    roundingPolicyIds: string[];
    currencyDidNotAlterReligiousDecision: true;
  } | null;

  approvedResponsePolicy: {
    responseMode: string;
    allowedOperations: string[];
    requiredResponseSections: string[];
    optionalResponseSections: string[];
    maximumDetailLevel: 'STANDARD' | 'DETAILED' | 'SUMMARY';
    citationPolicy: {
      mustUseProvidedEvidenceReferences: true;
      mustNotCreateNewReferences: true;
      mustDistinguishSourceFromCommentary: true;
    };
    insufficientContextPolicy: {
      mustDiscloseInsufficiency: true;
      mustNotGuess: true;
      returnStatus: 'INSUFFICIENT_VERIFIED_CONTEXT';
    };
  };

  restrictions: StrictAIEvidenceRestrictions;

  provenance: {
    assembledFrom: {
      calculationResultSnapshotId?: string;
      resolvedRuleSnapshotId?: string;
      evidenceVersionId: string;
      explanationVersionId?: string;
      reportSnapshotId?: string | null;
    };
    validationRecords: {
      navigationValidationId: string;
      authorizationValidationId: string;
      evidenceLinkValidationId: string;
      madhhabValidationId: string;
      releaseValidationId: string;
      integrityValidationId: string;
    };
    assembledByService: 'MIZAN_AI_CONTEXT_SERVICE';
    assembledAt: string;
    sourceEnvironment: 'PRODUCTION' | 'TEST';
  };

  integrity: {
    contextChecksum: string;
    componentChecksums: {
      calculationContextChecksum?: string | null;
      decisionContextChecksum?: string | null;
      ruleContextChecksum?: string | null;
      evidenceContextChecksum: string;
      explanationContextChecksum?: string | null;
      restrictionsChecksum: string;
    };
    signature?: {
      signed: boolean;
      keyId?: string | null;
      algorithm?: string | null;
      value?: string | null;
    };
    verifiedAt: string;
    isImmutable: true;
  };
}
