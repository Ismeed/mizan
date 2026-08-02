/**
 * MIZAN Permanent Evidence Identifier Standard (Phase 4)
 * 
 * Recommended identifier patterns:
 * - QURAN-<SURAH_NUMBER>-<AYAH_START>-<AYAH_END>
 * - HADITH-<COLLECTION>-<CANONICAL_NUMBER>
 * - FIQH-<MADHHAB>-<SOURCE_CODE>-<SEQUENCE>
 * - SCHOLARLY-<INSTITUTION_OR_SOURCE_CODE>-<SEQUENCE>
 * - LEGAL_MAXIM-<SOURCE_CODE>-<SEQUENCE>
 * - INSTITUTIONAL-<SOURCE_CODE>-<SEQUENCE>
 * - EXPLANATORY-<SOURCE_CODE>-<SEQUENCE>
 * 
 * Rules: Uppercase, ASCII only, hyphen-separated, permanent, stable, human-auditable.
 * Version is stored separately.
 */

export const EVIDENCE_ID_REGEX = /^(QURAN|HADITH|FIQH|SCHOLARLY|LEGAL_MAXIM|INSTITUTIONAL|EXPLANATORY)-[A-Z0-9]+(-[A-Z0-9]+)*$/;

export type PermanentEvidenceId = string;

export interface ParsedEvidenceId {
  prefix: string;
  parts: string[];
  isValid: boolean;
}

export function validateEvidenceId(evidenceId: string): boolean {
  if (!evidenceId || typeof evidenceId !== 'string') return false;
  return EVIDENCE_ID_REGEX.test(evidenceId);
}

export function parseEvidenceId(evidenceId: string): ParsedEvidenceId {
  const isValid = validateEvidenceId(evidenceId);
  if (!isValid) {
    return { prefix: '', parts: [], isValid: false };
  }
  const parts = evidenceId.split('-');
  return {
    prefix: parts[0],
    parts: parts.slice(1),
    isValid: true,
  };
}

export function buildQuranEvidenceId(surah: number, ayahStart: number, ayahEnd: number): string {
  const s = String(surah).padStart(3, '0');
  const aStart = String(ayahStart).padStart(3, '0');
  const aEnd = String(ayahEnd).padStart(3, '0');
  return `QURAN-${s}-${aStart}-${aEnd}`;
}

export function buildHadithEvidenceId(collection: string, canonicalNumber: string | number): string {
  const col = collection.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const num = String(canonicalNumber).padStart(6, '0');
  return `HADITH-${col}-${num}`;
}

export function buildFiqhEvidenceId(madhhab: string, sourceCode: string, sequence: number): string {
  const m = madhhab.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const src = sourceCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const seq = String(sequence).padStart(4, '0');
  return `FIQH-${m}-${src}-${seq}`;
}

export function buildScholarlyEvidenceId(sourceCode: string, sequence: number): string {
  const src = sourceCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const seq = String(sequence).padStart(4, '0');
  return `SCHOLARLY-${src}-${seq}`;
}

export function buildLegalMaximEvidenceId(sourceCode: string, sequence: number): string {
  const src = sourceCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const seq = String(sequence).padStart(4, '0');
  return `LEGAL_MAXIM-${src}-${seq}`;
}
