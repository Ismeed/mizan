import { BaseEvidence } from '@mizan/shared';
import { EvidenceValidatorService } from './evidence-validator.service';

export interface RAGIndexablePayload {
  id: string;
  evidenceId: string;
  evidenceVersion: string;
  evidenceType: string;
  moduleScope: string[];
  topics: string[];
  subtopics: string[];
  madhhabScope: any;
  contentType: string;
  sourceType: string;
  knowledgeReleaseVersion: string;
  reviewStatus: string;
  productionStatus: string;
  citationReference: string;
  licenceStatus: string;
  text: string;
  isEligibleForIndexing: boolean;
  blockReason?: string;
}

export class EvidenceRAGIndexingGuard {
  /**
   * Safe RAG Indexing Guard.
   * Validates that evidence meets all governance, licensing, and metadata criteria before entering RAG index.
   */
  static validateForIndexing(evidence: BaseEvidence, knowledgeReleaseVersion: string = '1.0.0'): RAGIndexablePayload {
    // 1. Must be in PRODUCTION or INDEXED status
    const status = evidence.governance?.status;
    if (status !== 'PRODUCTION' && status !== 'INDEXED') {
      return {
        id: `${evidence.evidenceId}:${evidence.version}`,
        evidenceId: evidence.evidenceId,
        evidenceVersion: evidence.version,
        evidenceType: evidence.evidenceType,
        moduleScope: evidence.identity?.moduleScope || [],
        topics: evidence.identity?.topics || [],
        subtopics: evidence.identity?.subtopics || [],
        madhhabScope: evidence.madhhabScope,
        contentType: 'ORIGINAL_TEXT',
        sourceType: evidence.sourceProvenance?.sourceType || 'UNKNOWN',
        knowledgeReleaseVersion,
        reviewStatus: status || 'DRAFT',
        productionStatus: status || 'DRAFT',
        citationReference: evidence.identity?.canonicalReference || '',
        licenceStatus: evidence.licensing?.licenceStatus || 'UNKNOWN',
        text: '',
        isEligibleForIndexing: false,
        blockReason: `Indexing blocked: Status is '${status}' (must be PRODUCTION or INDEXED)`,
      };
    }

    // 2. Licensing check — UNKNOWN or RESTRICTED block
    if (evidence.licensing?.licenceStatus === 'UNKNOWN' || evidence.licensing?.licenceStatus === 'RESTRICTED') {
      return {
        id: `${evidence.evidenceId}:${evidence.version}`,
        evidenceId: evidence.evidenceId,
        evidenceVersion: evidence.version,
        evidenceType: evidence.evidenceType,
        moduleScope: evidence.identity?.moduleScope || [],
        topics: evidence.identity?.topics || [],
        subtopics: evidence.identity?.subtopics || [],
        madhhabScope: evidence.madhhabScope,
        contentType: 'ORIGINAL_TEXT',
        sourceType: evidence.sourceProvenance?.sourceType || 'UNKNOWN',
        knowledgeReleaseVersion,
        reviewStatus: status,
        productionStatus: status,
        citationReference: evidence.identity?.canonicalReference || '',
        licenceStatus: evidence.licensing?.licenceStatus,
        text: '',
        isEligibleForIndexing: false,
        blockReason: `Indexing blocked: Licence status is '${evidence.licensing?.licenceStatus}'`,
      };
    }

    // 3. Test fixture check
    if (evidence.isTestFixture) {
      return {
        id: `${evidence.evidenceId}:${evidence.version}`,
        evidenceId: evidence.evidenceId,
        evidenceVersion: evidence.version,
        evidenceType: evidence.evidenceType,
        moduleScope: evidence.identity?.moduleScope || [],
        topics: evidence.identity?.topics || [],
        subtopics: evidence.identity?.subtopics || [],
        madhhabScope: evidence.madhhabScope,
        contentType: 'ORIGINAL_TEXT',
        sourceType: 'TEST_FIXTURE',
        knowledgeReleaseVersion,
        reviewStatus: status,
        productionStatus: status,
        citationReference: evidence.identity?.canonicalReference || '',
        licenceStatus: evidence.licensing?.licenceStatus || 'PUBLIC_DOMAIN',
        text: '',
        isEligibleForIndexing: false,
        blockReason: 'Indexing blocked: Synthetic test fixtures are prohibited from RAG indexing',
      };
    }

    // 4. Validation check
    const val = EvidenceValidatorService.validate(evidence);
    if (!val.isValid) {
      return {
        id: `${evidence.evidenceId}:${evidence.version}`,
        evidenceId: evidence.evidenceId,
        evidenceVersion: evidence.version,
        evidenceType: evidence.evidenceType,
        moduleScope: evidence.identity?.moduleScope || [],
        topics: evidence.identity?.topics || [],
        subtopics: evidence.identity?.subtopics || [],
        madhhabScope: evidence.madhhabScope,
        contentType: 'ORIGINAL_TEXT',
        sourceType: evidence.sourceProvenance?.sourceType || 'UNKNOWN',
        knowledgeReleaseVersion,
        reviewStatus: status,
        productionStatus: status,
        citationReference: evidence.identity?.canonicalReference || '',
        licenceStatus: evidence.licensing?.licenceStatus || 'PUBLIC_DOMAIN',
        text: '',
        isEligibleForIndexing: false,
        blockReason: `Indexing blocked: Validation failed (${val.errors.map(e => e.message).join('; ')})`,
      };
    }

    const textContent =
      evidence.content?.arabicText ||
      evidence.content?.originalText ||
      evidence.identity?.canonicalReference ||
      '';

    return {
      id: `${evidence.evidenceId}:${evidence.version}`,
      evidenceId: evidence.evidenceId,
      evidenceVersion: evidence.version,
      evidenceType: evidence.evidenceType,
      moduleScope: evidence.identity?.moduleScope || [],
      topics: evidence.identity?.topics || [],
      subtopics: evidence.identity?.subtopics || [],
      madhhabScope: evidence.madhhabScope,
      contentType: 'ORIGINAL_TEXT',
      sourceType: evidence.sourceProvenance?.sourceType || 'PRIMARY_TEXT',
      knowledgeReleaseVersion,
      reviewStatus: status,
      productionStatus: status,
      citationReference: evidence.identity?.canonicalReference || '',
      licenceStatus: evidence.licensing?.licenceStatus || 'PUBLIC_DOMAIN',
      text: textContent,
      isEligibleForIndexing: true,
    };
  }
}
