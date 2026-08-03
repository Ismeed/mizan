/**
 * MIZAN — Canonical Calculation Result Envelope (Phase 13)
 * The authoritative, immutable, top-level result returned by the calculation engine,
 * API, saved calculation service, reports, and AI context services.
 */

import type { CalculationStatus } from './result-status.types';
import type { ResultItem } from './result-item.types';
import type { CalculationWarning } from './result-warning.types';
import type { CalculationError } from './result-error.types';
import type { ReviewRequirement } from './review-requirement.types';
import type { MirathModuleResult } from './mirath-module-result.types';
import type { ZakatModuleResult } from './zakat-module-result.types';
import type { Madhhab } from '../inheritance.types';
import type { TextDirection } from '../profile.types';

export interface EnvelopeProfileSnapshot {
  calculationProfileId: string;
  module: 'MIRATH' | 'ZAKAT';
  madhhab: Madhhab;
  language: {
    languageTag: string;
    locale: string;
    direction: TextDirection;
  };
  currency: {
    preferredCurrencyCode: string;
    calculationCurrencyCode: string;
    reportCurrencyCode: string;
    currencyContextId: string;
  };
  region: {
    countryCode: string;
    regionCode?: string | null;
  };
  capturedAt: string;
  isImmutable: boolean;
}

export interface EnvelopeExecutionContext {
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  registryVersions: {
    heirRegistryVersion?: string | null;
    heirGroupRegistryVersion?: string | null;
    zakatCategoryRegistryVersion?: string | null;
    livestockScheduleRegistryVersion?: string | null;
    agricultureRuleRegistryVersion?: string | null;
    evidenceRegistryVersion: string;
    explanationRegistryVersion: string;
    currencyRegistryVersion: string;
  };
  calculationStartedAt: string;
  calculationCompletedAt: string;
  executionEnvironment: {
    engineMode: 'PRODUCTION' | 'DEVELOPMENT' | 'TEST';
    region: string;
    serviceVersion: string;
  };
}

export interface EnvelopeInputSnapshot {
  inputSnapshotId: string;
  canonicalFactsSnapshotId: string;
  rawInputChecksum: string;
  canonicalFactsChecksum: string;
  inputSchemaVersion: string;
  validation: {
    status: 'VALID' | 'INVALID';
    validationResultIds: string[];
  };
}

export interface EnvelopeSummary {
  resultItemCount: number;
  completedItemCount: number;
  warningItemCount: number;
  reviewRequiredItemCount: number;
  unsupportedItemCount: number;
  errorItemCount: number;
  hasMonetaryResults: boolean;
  hasPhysicalObligations: boolean;
  hasBlockedHeirs: boolean;
  hasPartialResults: boolean;
  decisionCodes: string[];
}

export interface EnvelopeReviewSummary {
  required: boolean;
  items: Array<{
    resultItemId: string;
    reasonCode: string;
  }>;
}

export interface EnvelopePresentationMetadata {
  defaultView: 'SUMMARY' | 'DETAILED' | 'ADVANCED_AUDIT';
  sections: Array<{
    sectionCode: string;
    displayOrder: number;
    resultItemIds: string[];
  }>;
  availableViews: Array<'SUMMARY' | 'DETAILED' | 'ADVANCED_AUDIT'>;
  hasClickableEvidence: boolean;
  hasAIExplanationActions: boolean;
}

export interface EnvelopeAuditRecord {
  createdAt: string;
  createdByService: string;
  calculationRequestId: string;
  idempotencyKey?: string | null;
  ruleExecutionTraceIds: string[];
  resultAssemblyTraceId: string;
  reviewEvents: unknown[];
  releaseValidationResultId?: string | null;
  securityContext: {
    tenantId?: string | null;
    userIdHash?: string | null;
  };
}

export interface EnvelopeIntegrityRecord {
  resultChecksum: string;
  resultSnapshotId: string;
  inputChecksum: string;
  profileChecksum: string;
  canonicalFactsChecksum: string;
  appliedRulePackageChecksum: string;
  evidencePackageChecksum: string;
  explanationPackageChecksum: string;
  monetarySnapshotChecksum?: string | null;
  isImmutable: boolean;
  verifiedAt: string;
}

export interface CalculationResultEnvelope {
  resultId: string;
  calculationId: string;
  resultVersion: string;
  resultSchemaVersion: string;
  module: 'MIRATH' | 'ZAKAT';
  status: CalculationStatus;
  profile: EnvelopeProfileSnapshot;
  context: EnvelopeExecutionContext;
  input: EnvelopeInputSnapshot;
  summary: EnvelopeSummary;
  moduleResult: MirathModuleResult | ZakatModuleResult;
  resultItems: ResultItem[];
  warnings: CalculationWarning[];
  errors: CalculationError[];
  review: EnvelopeReviewSummary;
  presentation: EnvelopePresentationMetadata;
  audit: EnvelopeAuditRecord;
  integrity: EnvelopeIntegrityRecord;
}
