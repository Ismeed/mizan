import { SourceProvenance } from '../types/knowledge.types';

export class SourceProvenanceService {
  /**
   * Validates a source provenance object for completeness and correctness.
   */
  static validateProvenance(provenance: SourceProvenance): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!provenance || !provenance.sourceType) {
      errors.push('sourceType is required.');
      return { valid: false, errors };
    }

    switch (provenance.sourceType) {
      case 'QURAN':
        if (!provenance.surahNumber || provenance.surahNumber < 1 || provenance.surahNumber > 114) {
          errors.push('Qur\'an evidence requires a valid surahNumber (1-114).');
        }
        if (!provenance.surahName || provenance.surahName.trim() === '') {
          errors.push('Qur\'an evidence requires a surahName.');
        }
        if (!provenance.ayahStart || provenance.ayahStart < 1) {
          errors.push('Qur\'an evidence requires a valid ayahStart (>= 1).');
        }
        break;

      case 'HADITH':
        if (!provenance.collection || provenance.collection.trim() === '') {
          errors.push('Hadith evidence requires a collection name (e.g., Bukhari, Muslim, Abu Dawud).');
        }
        if (!provenance.hadithNumber || provenance.hadithNumber.trim() === '') {
          errors.push('Hadith evidence requires a specific hadithNumber.');
        }
        break;

      case 'FIQH_BOOK':
        if (!provenance.bookTitle || provenance.bookTitle.trim() === '') {
          errors.push('Fiqh book source requires a bookTitle.');
        }
        if (!provenance.author || provenance.author.trim() === '') {
          errors.push('Fiqh book source requires an author.');
        }
        break;

      case 'MIZAN_AUTHORED':
        if (!provenance.author || provenance.author.trim() === '') {
          errors.push('MIZAN authored material requires an author/compiler credit.');
        }
        break;

      default:
        errors.push(`Unknown sourceType: '${provenance.sourceType}'.`);
    }

    if (provenance.verifiedAgainstPhysicalCopy === undefined) {
      errors.push('verifiedAgainstPhysicalCopy boolean flag must be explicitly declared.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}