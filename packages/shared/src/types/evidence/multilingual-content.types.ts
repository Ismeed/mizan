/**
 * Multilingual Content Object for Evidence (Phase 4)
 */

export type MultilingualContentType =
  | 'ORIGINAL_TEXT'
  | 'APPROVED_TRANSLATION'
  | 'APPROVED_SUMMARY'
  | 'APPROVED_EXPLANATION'
  | 'SEARCH_NORMALISED_TEXT';

export type ContentDirection = 'LTR' | 'RTL';

export interface MultilingualContent {
  languageTag: string; // e.g. "en", "ha", "ar"
  locale: string;       // e.g. "en-NG", "ha-NG", "ar-SA"
  direction: ContentDirection;
  contentType: MultilingualContentType;
  text: string;
  sourceId?: string;
  version: string;
  reviewStatus: 'DRAFT' | 'ACADEMIC_REVIEW' | 'SHARIA_REVIEW' | 'APPROVED' | 'REJECTED';
  checksum: string;
}
