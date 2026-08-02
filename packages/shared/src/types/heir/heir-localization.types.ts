/**
 * MIZAN — Heir Localization Types (Phase 7)
 *
 * Multilingual labels and descriptions for canonical heir entities.
 * Kept separate from Rule Engine logic.
 */

export type SupportedHeirLanguage = 'en' | 'ha' | 'ar' | 'fr' | 'sw';

export interface HeirLabelSet {
  singular: string;
  plural: string;
  shortLabel?: string;
  formalReportLabel?: string;
  shortDescription: string;
  educationalDescription?: string;
  /** Optional gender-aware grammar notes */
  grammarNotes?: string;
}

export type HeirLocalizationReviewStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'APPROVED';

export interface HeirLocalizationRecord {
  heirId: string;
  version: string;
  labels: Record<SupportedHeirLanguage, HeirLabelSet>;
  reviewStatus: HeirLocalizationReviewStatus;
  updatedAt: string;
  updatedBy: string;
}
