/**
 * MIZAN — Result Status Registry (Phase 13)
 * Controlled calculation-status registry.
 */

export type CalculationStatus =
  | 'COMPLETED'
  | 'COMPLETED_WITH_WARNINGS'
  | 'PARTIALLY_COMPLETED'
  | 'REVIEW_REQUIRED'
  | 'UNSUPPORTED'
  | 'INVALID_INPUT'
  | 'CONFLICT'
  | 'INTEGRITY_FAILURE'
  | 'FAILED'
  | 'CANCELLED';
