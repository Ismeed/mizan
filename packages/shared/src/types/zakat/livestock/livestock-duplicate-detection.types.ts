/**
 * MIZAN — Livestock Duplicate & Cross-Category Safeguards (Phase 9)
 *
 * Prevents double-counting across categories, joint ownership, or duplicate herd entries.
 */

export type LivestockDuplicateWarningCode =
  | 'POSSIBLE_DUPLICATE_HERD'
  | 'POSSIBLE_CROSS_CATEGORY_DOUBLE_COUNTING'
  | 'SHEEP_GOAT_COMPOSITION_OVERLAP'
  | 'JOINT_OWNERSHIP_DUPLICATION_RISK'
  | 'MULTIPLE_PERIOD_HERD_COUNT_OVERLAP';

export interface LivestockDuplicateWarning {
  warningCode: LivestockDuplicateWarningCode;
  affectedInstanceIds: string[];
  message: string;
  requiresUserAction: boolean;
  scholarReviewAdvised: boolean;
}

export interface LivestockDuplicateCheckResult {
  hasWarnings: boolean;
  warnings: LivestockDuplicateWarning[];
}
