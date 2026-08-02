/**
 * MIZAN — Zakat Category Localization Types (Phase 8)
 *
 * Multilingual label and description types for canonical Zakat categories.
 * Kept separate from Rule Engine logic.
 *
 * Adding a new language MUST NOT change any canonical category ID.
 */

import type { CanonicalZakatCategoryId } from './canonical-zakat-category.types';

/** Supported display languages for Zakat category labels */
export type SupportedZakatLanguage = 'en' | 'ha' | 'ar' | 'fr' | 'sw';

/** Review status for a localization record */
export type ZakatLocalizationReviewStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'APPROVED';

/** The complete set of display labels for a Zakat category in one language */
export interface ZakatCategoryLabelSet {
  /** Short label used in input forms (e.g. "Cash & Bank") */
  label: string;
  /** Longer description for info panels (e.g. "Cash in hand and bank accounts") */
  description: string;
  /** Label used in formal calculation reports (e.g. "Cash and Bank Balances") */
  reportLabel: string;
  /** Placeholder text for value input fields */
  inputPlaceholder?: string;
  /** Educational description explaining the fiqh basis */
  educationalDescription?: string;
  /** Arabic term used by scholars for this category */
  arabicTerm?: string;
}

/** Full localization record for a canonical Zakat category in one language */
export interface ZakatCategoryLocalizationRecord {
  categoryId: CanonicalZakatCategoryId;
  languageCode: SupportedZakatLanguage;
  labelSet: ZakatCategoryLabelSet;
  reviewStatus: ZakatLocalizationReviewStatus;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}
