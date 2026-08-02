/**
 * Fiqh Reference Evidence Schema Contract (Phase 4)
 * Classical & recognized fiqh sources.
 */

import { BaseEvidence } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';
import { MultilingualContent } from './multilingual-content.types';

export interface FiqhReference {
  sourceId: string;
  bookTitleOriginal: string;
  bookTitles: {
    en: string;
    ha: string;
    ar: string;
  };
  author: string;
  authorDeathYearHijri?: string;
  editor?: string;
  publisher?: string;
  edition?: string;
  publicationYear?: string;
  volume?: string;
  bookSection?: string;
  chapter?: string;
  subchapter?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  paragraph?: string;
  lineStart?: number | null;
  lineEnd?: number | null;
  canonicalReference: string; // e.g. "Al-Mughni by Ibn Qudamah, Vol. 6, p. 120"
  shortReference: string;
}

export interface FiqhContent {
  originalText: string;
  originalLanguage: string;
  verifiedTranscription: boolean;
}

export interface FiqhReferenceEvidence extends BaseEvidence {
  evidenceType: EvidenceType.FIQH_REFERENCE;
  reference: FiqhReference;
  content: FiqhContent;
  translations: Record<string, MultilingualContent>;
  approvedSummaries?: Record<string, MultilingualContent>;
}
