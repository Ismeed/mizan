/**
 * MIZAN — Calculation Status Resolution Service (Phase 13)
 * Implements deterministic status precedence resolution:
 * 1. INTEGRITY_FAILURE
 * 2. CONFLICT
 * 3. INVALID_INPUT
 * 4. FAILED
 * 5. REVIEW_REQUIRED
 * 6. UNSUPPORTED
 * 7. PARTIALLY_COMPLETED
 * 8. COMPLETED_WITH_WARNINGS
 * 9. COMPLETED
 */

import type { CalculationStatus, CalculationWarning, CalculationError, ReviewRequirement, ResultItem } from '@mizan/shared';

export interface ResolveStatusInput {
  resultItems: ResultItem[];
  warnings: CalculationWarning[];
  errors: CalculationError[];
  review: ReviewRequirement | null;
  hasIntegrityFailure?: boolean;
}

export class CalculationStatusResolutionService {
  static resolveTopLevelStatus(input: ResolveStatusInput): CalculationStatus {
    const { resultItems, warnings, errors, review, hasIntegrityFailure } = input;

    // 1. INTEGRITY_FAILURE
    if (hasIntegrityFailure || errors.some((e) => e.category === 'INTEGRITY')) {
      return 'INTEGRITY_FAILURE';
    }

    // 2. CONFLICT
    if (errors.some((e) => e.category === 'RULE_CONFLICT')) {
      return 'CONFLICT';
    }

    // 3. INVALID_INPUT
    if (errors.some((e) => e.category === 'VALIDATION')) {
      return 'INVALID_INPUT';
    }

    // 4. FAILED
    if (errors.some((e) => e.severity === 'CRITICAL')) {
      return 'FAILED';
    }

    // 5. REVIEW_REQUIRED
    if ((review && review.required) || resultItems.some((i) => i.status === 'REVIEW_REQUIRED')) {
      return 'REVIEW_REQUIRED';
    }

    // 6. UNSUPPORTED
    if (errors.some((e) => e.category === 'UNSUPPORTED') || resultItems.some((i) => i.status === 'UNSUPPORTED')) {
      return 'UNSUPPORTED';
    }

    // 7. PARTIALLY_COMPLETED
    if (resultItems.some((i) => i.status === 'SKIPPED' || i.status === 'PARTIALLY_AFFECTED')) {
      return 'PARTIALLY_COMPLETED';
    }

    // 8. COMPLETED_WITH_WARNINGS
    if (warnings.length > 0 || resultItems.some((i) => i.warnings.length > 0)) {
      return 'COMPLETED_WITH_WARNINGS';
    }

    // 9. COMPLETED
    return 'COMPLETED';
  }
}
