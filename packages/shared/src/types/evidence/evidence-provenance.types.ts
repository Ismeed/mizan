/**
 * MIZAN Evidence Source Provenance Standards (Phase 4)
 */

export type ExtractionMethod = 'MANUAL' | 'OCR' | 'VERIFIED_IMPORT' | 'API_SYNC';

export interface EvidenceSourceProvenance {
  sourceType: string;
  sourceId: string;
  title: string;
  author?: string;
  editor?: string;
  translator?: string;
  institution?: string;
  publisher?: string;
  publicationYear?: string;
  volume?: string;
  chapter?: string;
  section?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  paragraph?: string;
  lineStart?: number | null;
  lineEnd?: number | null;
  originalLanguage: string;
  sourceFileId?: string;
  sourceFileChecksum?: string;
  extractionMethod: ExtractionMethod;
  verifiedAgainstSource: boolean;
  verifiedBy: string[];
  verifiedAt?: string | null;
}
