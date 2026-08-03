/**
 * MIZAN — Result Item Status Registry (Phase 13)
 * Controlled statuses for individual result items.
 */

export type ResultItemStatus =
  | 'ELIGIBLE'
  | 'INELIGIBLE'
  | 'BLOCKED'
  | 'PARTIALLY_AFFECTED'
  | 'SHARE_ASSIGNED'
  | 'RESIDUARY_ASSIGNED'
  | 'NOT_DUE'
  | 'BELOW_NISAB'
  | 'HAWL_INCOMPLETE'
  | 'EXEMPT'
  | 'OBLIGATION_DUE'
  | 'PHYSICAL_OBLIGATION_DUE'
  | 'MONETARY_OBLIGATION_DUE'
  | 'UNSUPPORTED'
  | 'REVIEW_REQUIRED'
  | 'CONFLICT'
  | 'INVALID'
  | 'SKIPPED';
