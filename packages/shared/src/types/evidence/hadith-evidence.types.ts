/**
 * Dedicated Hadith Evidence Schema Contract (Phase 4)
 */

import { BaseEvidence } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';
import { HadithEditionNumber } from './hadith-numbering.types';
import { HadithGradingRecord, HadithDisplayPolicy } from './hadith-grading.types';
import { MultilingualContent } from './multilingual-content.types';

export interface HadithReference {
  collectionId: string; // e.g. "BUKHARI", "MUSLIM"
  collectionNames: {
    en: string;
    ha: string;
    ar: string;
  };
  bookNumber?: string;
  bookNames?: {
    en: string;
    ha: string;
    ar: string;
  };
  chapterNumber?: string;
  chapterNames?: {
    en: string;
    ha: string;
    ar: string;
  };
  canonicalHadithNumber: string;
  editionSpecificNumbers: HadithEditionNumber[];
  volume?: string;
  page?: string;
  canonicalReference: string; // e.g. "Sahih al-Bukhari 1454"
  shortReference: string;     // e.g. "Bukhari 1454"
}

export interface HadithContent {
  arabicText: string;
  chainOfNarration?: string; // Isnad
  matnText: string;          // Main text
  narrator?: string;          // Companion narrator
}

export interface HadithEvidence extends BaseEvidence {
  evidenceType: EvidenceType.HADITH;
  reference: HadithReference;
  content: HadithContent;
  translations: Record<string, MultilingualContent>;
  grading: {
    primaryGrade: HadithGradingRecord;
    additionalGradingRecords: HadithGradingRecord[];
    displayPolicy: HadithDisplayPolicy;
  };
}
