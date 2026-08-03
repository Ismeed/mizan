import { AIEvidenceContextV2 } from '../../../../../packages/shared/src';

export interface ContextValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AIEvidenceContextValidationService {
  /**
   * Validates AI Evidence Context V2 for completeness, restrictions, and checksum integrity.
   */
  static validateContext(context: AIEvidenceContextV2): ContextValidationResult {
    const errors: string[] = [];

    if (!context || typeof context !== 'object') {
      return { isValid: false, errors: ['Context must be a non-null object'] };
    }

    if (!context.navigation || !context.navigation.navigationId) {
      errors.push('Missing navigation.navigationId');
    }

    if (!context.evidenceContext || !context.evidenceContext.evidenceId) {
      errors.push('Missing evidenceContext.evidenceId');
    }

    // Validate mandatory restrictions (all 12 must be true)
    const rest = context.restrictions;
    if (!rest) {
      errors.push('Missing restrictions object');
    } else {
      if (!rest.mustNotRecalculate) errors.push('mustNotRecalculate restriction must be true');
      if (!rest.mustNotChangeDecision) errors.push('mustNotChangeDecision restriction must be true');
      if (!rest.mustNotChangeMadhhab) errors.push('mustNotChangeMadhhab restriction must be true');
      if (!rest.mustNotInventEvidence) errors.push('mustNotInventEvidence restriction must be true');
      if (!rest.mustNotInventSourceText) errors.push('mustNotInventSourceText restriction must be true');
      if (!rest.mustNotInventTranslation) errors.push('mustNotInventTranslation restriction must be true');
      if (!rest.mustNotInventRule) errors.push('mustNotInventRule restriction must be true');
      if (!rest.mustNotInventException) errors.push('mustNotInventException restriction must be true');
      if (!rest.mustNotPresentCommentaryAsEvidence) errors.push('mustNotPresentCommentaryAsEvidence restriction must be true');
      if (!rest.mustNotUseUnapprovedComparativeContext) errors.push('mustNotUseUnapprovedComparativeContext restriction must be true');
      if (!rest.mustUseProvidedVerifiedContext) errors.push('mustUseProvidedVerifiedContext restriction must be true');
      if (!rest.mustDiscloseInsufficientContext) errors.push('mustDiscloseInsufficientContext restriction must be true');
    }

    if (!context.integrity || !context.integrity.contextChecksum) {
      errors.push('Missing integrity.contextChecksum');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
