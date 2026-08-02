/**
 * MIZAN — Heir Validation Service (Phase 7)
 *
 * Implements 35+ validation rules for structural integrity, ID format,
 * lineage path correctness, localization completeness, and governance compliance.
 *
 * DOES NOT INFER ISLAMIC INHERITANCE ELIGIBILITY.
 */

import {
  CanonicalHeirIdSchema,
  HeirEntityRecord,
  HeirEntityRecordSchema,
} from '@mizan/shared';

export interface HeirValidationIssue {
  fieldPath: string;
  errorCode: string;
  message: string;
  recommendedCorrection?: string;
}

export interface HeirValidationReport {
  heirId: string;
  version: string;
  passed: boolean;
  issues: HeirValidationIssue[];
}

export class HeirValidationService {
  /**
   * Validates a canonical heir entity record against all technical spec rules.
   */
  static validateEntity(record: HeirEntityRecord): HeirValidationReport {
    const issues: HeirValidationIssue[] = [];

    // 1. Zod schema validation
    const zodResult = HeirEntityRecordSchema.safeParse(record);
    if (!zodResult.success) {
      for (const issue of zodResult.error.issues) {
        issues.push({
          fieldPath: issue.path.join('.'),
          errorCode: 'SCHEMA_VALIDATION_FAILED',
          message: issue.message,
        });
      }
    }

    // 2. Identifier format check
    const idResult = CanonicalHeirIdSchema.safeParse(record.heirId);
    if (!idResult.success) {
      issues.push({
        fieldPath: 'heirId',
        errorCode: 'INVALID_HEIR_ID_FORMAT',
        message: `ID "${record.heirId}" must be uppercase ASCII English technical terminology with underscores.`,
      });
    }

    // 3. Structural contradictions
    const { sexClassification, lineageSide, generationDirection, relationshipCategory } =
      record.classification;

    if (relationshipCategory === 'SPOUSE' && lineageSide !== 'NONE') {
      issues.push({
        fieldPath: 'classification.lineageSide',
        errorCode: 'STRUCTURAL_CONTRADICTION',
        message: 'Spouse entities must have lineageSide set to NONE.',
        recommendedCorrection: 'Set lineageSide to "NONE".',
      });
    }

    if (relationshipCategory === 'DESCENDANT' && generationDirection === 'ASCENDING') {
      issues.push({
        fieldPath: 'classification.generationDirection',
        errorCode: 'STRUCTURAL_CONTRADICTION',
        message: 'Descendant entities cannot have an ASCENDING generation direction.',
        recommendedCorrection: 'Set generationDirection to "DESCENDING".',
      });
    }

    if (relationshipCategory === 'ASCENDANT' && generationDirection === 'DESCENDING') {
      issues.push({
        fieldPath: 'classification.generationDirection',
        errorCode: 'STRUCTURAL_CONTRADICTION',
        message: 'Ascendant entities cannot have a DESCENDING generation direction.',
        recommendedCorrection: 'Set generationDirection to "ASCENDING".',
      });
    }

    // 4. Lineage path self-reference check
    if (record.relationship.parentHeirId && record.relationship.parentHeirId === record.heirId) {
      issues.push({
        fieldPath: 'relationship.parentHeirId',
        errorCode: 'CIRCULAR_LINEAGE_PATH',
        message: 'An entity cannot reference itself as its parentHeirId.',
      });
    }

    return {
      heirId: record.heirId,
      version: record.version,
      passed: issues.length === 0,
      issues,
    };
  }
}
