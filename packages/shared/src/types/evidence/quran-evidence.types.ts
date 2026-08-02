/**
 * Dedicated Qur'an Evidence Schema Contract (Phase 4)
 */

import { BaseEvidence } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';
import { QuranTranslation } from './quran-translation.types';

export interface QuranReference {
  surahNumber: number; // 1 - 114
  surahNameArabic: string;
  surahNames: {
    en: string;
    ha: string;
    ar: string;
  };
  ayahStart: number;
  ayahEnd: number;
  canonicalReference: string; // e.g. "Surah An-Nisa (4:11-12)"
  shortReference: string;     // e.g. "Quran 4:11-12"
}

export interface QuranContent {
  arabicText: string;
  uthmaniText: string;
  plainArabicText: string;
  searchNormalisedText?: string;
  verseSequenceVerified: boolean;
}

export interface QuranEvidence extends BaseEvidence {
  evidenceType: EvidenceType.QURAN;
  reference: QuranReference;
  content: QuranContent;
  translations: Record<string, QuranTranslation>;
}
