/**
 * MIZAN — Standard Report Status Types (Phase 14)
 */

export type ReportStatus =
  | 'GENERATED'
  | 'GENERATED_WITH_WARNINGS'
  | 'PARTIAL'
  | 'REVIEW_REQUIRED'
  | 'INTEGRITY_FAILURE'
  | 'FAILED';
