/**
 * Contemporary Scholarly Reference Evidence Schema Contract (Phase 4)
 */

import { BaseEvidence } from './base-evidence.types';
import { EvidenceType } from './evidence-type.registry';
import { MultilingualContent } from './multilingual-content.types';

export interface ScholarlyReference {
  title: string;
  authors: string[];
  institution?: string;
  documentType: 'BOOK' | 'JOURNAL_PAPER' | 'FATWA_BOARD_DECISION' | 'SHARIA_STANDARD' | 'MANUAL' | 'UNIVERSITY_REVIEWED';
  publisher?: string;
  publicationYear?: string;
  edition?: string;
  standardNumber?: string;
  chapter?: string;
  section?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  documentUrl?: string;
  accessedAt?: string | null;
  canonicalReference: string;
  shortReference: string;
}

export interface ScholarlyContent {
  originalText: string;
  approvedExcerpt?: string;
  approvedSummary?: string;
}

export interface ScholarlyReferenceEvidence extends BaseEvidence {
  evidenceType: EvidenceType.SCHOLARLY_REFERENCE | EvidenceType.LEGAL_MAXIM;
  reference: ScholarlyReference;
  content: ScholarlyContent;
  translations: Record<string, MultilingualContent>;
}
