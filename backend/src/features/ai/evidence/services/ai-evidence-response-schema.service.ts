import { AIEvidenceResponse } from '../../../../../../packages/shared/src';

export interface ResponseSchemaValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AIEvidenceResponseSchemaService {
  /**
   * Validates raw JSON output from Gemini against the required AIEvidenceResponse schema.
   */
  static validateSchema(data: any): ResponseSchemaValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Response is not a valid JSON object'] };
    }

    if (!data.aiResponseId) errors.push('Missing field: aiResponseId');
    if (!data.status) errors.push('Missing field: status');
    if (!data.content || typeof data.content !== 'object') {
      errors.push('Missing object field: content');
    } else {
      if (!data.content.evidenceReference) errors.push('Missing field: content.evidenceReference');
      if (!data.content.whatTheEvidenceSupports) errors.push('Missing field: content.whatTheEvidenceSupports');
      if (!data.content.aiClarification) errors.push('Missing field: content.aiClarification');
      if (!data.content.sourceDisclosure) errors.push('Missing field: content.sourceDisclosure');
    }

    if (!data.integrity || !data.integrity.responseChecksum) {
      errors.push('Missing field: integrity.responseChecksum');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
