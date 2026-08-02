import { SourceProvenanceService } from '../../features/knowledge/services/provenance.service';

describe('Source Provenance Validator', () => {
  test('Validates complete Qur\'an evidence provenance', () => {
    const res = SourceProvenanceService.validateProvenance({
      sourceType: 'QURAN',
      bookTitle: 'Holy Qur\'an',
      author: 'Divine Revelation',
      surahNumber: 4,
      surahName: 'An-Nisa',
      ayahStart: 11,
      ayahEnd: 12,
      extractionMethod: 'MANUAL',
      verifiedAgainstPhysicalCopy: true,
    });
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  test('Fails Qur\'an evidence missing surahNumber', () => {
    const res = SourceProvenanceService.validateProvenance({
      sourceType: 'QURAN',
      bookTitle: 'Holy Qur\'an',
      author: 'Divine Revelation',
      surahName: 'An-Nisa',
      extractionMethod: 'MANUAL',
      verifiedAgainstPhysicalCopy: true,
    } as any);
    expect(res.valid).toBe(false);
    expect(res.errors[0]).toContain('Qur\'an evidence requires a valid surahNumber');
  });

  test('Fails Fiqh book provenance missing author', () => {
    const res = SourceProvenanceService.validateProvenance({
      sourceType: 'FIQH_BOOK',
      bookTitle: 'Al-Mawrid',
      author: '',
      extractionMethod: 'MANUAL',
      verifiedAgainstPhysicalCopy: true,
    });
    expect(res.valid).toBe(false);
    expect(res.errors[0]).toContain('Fiqh book source requires an author');
  });
});
