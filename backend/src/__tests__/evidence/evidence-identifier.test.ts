import {
  validateEvidenceId,
  parseEvidenceId,
  buildQuranEvidenceId,
  buildHadithEvidenceId,
  buildFiqhEvidenceId,
  buildScholarlyEvidenceId,
  buildLegalMaximEvidenceId,
} from '../../../../packages/shared/src/types/evidence/evidence-identifier.types';

describe('Permanent Evidence Identifier Tests (Phase 4)', () => {
  it('validates correct Qur’an evidence identifier format', () => {
    expect(validateEvidenceId('QURAN-004-011-011')).toBe(true);
    expect(validateEvidenceId('QURAN-002-275-275')).toBe(true);
  });

  it('validates correct Hadith evidence identifier format', () => {
    expect(validateEvidenceId('HADITH-BUKHARI-001454')).toBe(true);
    expect(validateEvidenceId('HADITH-MUSLIM-000979')).toBe(true);
  });

  it('validates correct Fiqh & Scholarly evidence identifier format', () => {
    expect(validateEvidenceId('FIQH-MALIKI-MUDAWWANAH-0001')).toBe(true);
    expect(validateEvidenceId('SCHOLARLY-AAOIFI-0001')).toBe(true);
    expect(validateEvidenceId('LEGAL_MAXIM-MAJALLAH-0001')).toBe(true);
  });

  it('rejects invalid or lowercase evidence identifiers', () => {
    expect(validateEvidenceId('quran-004-011-011')).toBe(false);
    expect(validateEvidenceId('QURAN_004_011_011')).toBe(false);
    expect(validateEvidenceId('INVALID-ID')).toBe(false);
  });

  it('parses evidence identifiers into prefix and parts', () => {
    const parsed = parseEvidenceId('QURAN-004-011-012');
    expect(parsed.isValid).toBe(true);
    expect(parsed.prefix).toBe('QURAN');
    expect(parsed.parts).toEqual(['004', '011', '012']);
  });

  it('builds canonical Quran, Hadith, and Fiqh identifiers using builders', () => {
    expect(buildQuranEvidenceId(4, 11, 12)).toBe('QURAN-004-011-012');
    expect(buildHadithEvidenceId('bukhari', 1454)).toBe('HADITH-BUKHARI-001454');
    expect(buildFiqhEvidenceId('maliki', 'mudawwanah', 1)).toBe('FIQH-MALIKI-MUDAWWANAH-0001');
    expect(buildScholarlyEvidenceId('aaoifi', 1)).toBe('SCHOLARLY-AAOIFI-0001');
    expect(buildLegalMaximEvidenceId('majallah', 1)).toBe('LEGAL_MAXIM-MAJALLAH-0001');
  });
});
