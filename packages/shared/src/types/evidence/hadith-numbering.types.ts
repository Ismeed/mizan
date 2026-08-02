/**
 * Hadith Edition-Specific Numbering Standard (Phase 4)
 */

export interface HadithEditionNumber {
  sourceEditionId: string;
  editionName: string;
  number: string;
  volume?: string;
  book?: string;
  chapter?: string;
  page?: string;
  publisher?: string;
  publicationYear?: string;
}
