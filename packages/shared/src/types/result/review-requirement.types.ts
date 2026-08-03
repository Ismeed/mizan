/**
 * MIZAN — Review Requirement Contract (Phase 13)
 * Structured data when a calculation requires scholar review.
 */

export type ReviewType =
  | 'SHARIA_REVIEW'
  | 'TECHNICAL_REVIEW'
  | 'DATA_CLARIFICATION'
  | 'MANUAL_CALCULATION'
  | 'SOURCE_VERIFICATION';

export type UserReviewAction =
  | 'SAVE_CASE'
  | 'EXPORT_CASE'
  | 'ADD_INFORMATION'
  | 'REQUEST_REVIEW';

export interface ReviewRequirement {
  required: boolean;
  reviewType: ReviewType;
  reasonCode: string;
  affectedSubjectIds: string[];
  blocking: boolean;
  approvedExplanationId?: string | null;
  evidenceIds: string[];
  allowedUserActions: UserReviewAction[];
}
