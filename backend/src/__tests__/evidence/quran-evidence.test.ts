import { BaseEvidence } from '../../../../packages/shared/src/types/evidence/base-evidence.types';
import { QuranEvidence } from '../../../../packages/shared/src/types/evidence/quran-evidence.types';
import { EvidenceType } from '../../../../packages/shared/src/types/evidence/evidence-type.registry';
import { EvidenceValidatorService } from '../../features/evidence/services/evidence-validator.service';
import { EvidenceChecksumService } from '../../features/evidence/services/evidence-checksum.service';

describe('Qur’an Evidence Standard Tests (Phase 4)', () => {
  const sampleContent = {
    arabicText: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
    uthmaniText: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
    plainArabicText: 'يوصيكم الله في اولادكم للذكر مثل حظ الانثيين',
    verseSequenceVerified: true,
  };

  const validQuranEvidence: QuranEvidence = {
    evidenceId: 'QURAN-004-011-011',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    evidenceType: EvidenceType.QURAN,
    reference: {
      surahNumber: 4,
      surahNameArabic: 'النساء',
      surahNames: { en: 'An-Nisa', ha: 'An-Nisa', ar: 'النساء' },
      ayahStart: 11,
      ayahEnd: 11,
      canonicalReference: 'Surah An-Nisa (4:11)',
      shortReference: 'Quran 4:11',
    },
    identity: {
      moduleScope: ['MIRATH'],
      topics: ['INHERITANCE_CHILDREN'],
      subtopics: ['SON_DAUGHTER_RATIO'],
      canonicalReference: 'Surah An-Nisa (4:11)',
      shortReference: 'Quran 4:11',
    },
    madhhabScope: {
      mode: 'SHARED',
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    content: sampleContent,
    translations: {
      en: {
        languageTag: 'en',
        locale: 'en-US',
        text: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females.',
        translationSourceId: 'SAHIH_INTERNATIONAL',
        translator: 'Sahih International',
        licenceStatus: 'PUBLIC_DOMAIN',
        reviewStatus: 'APPROVED',
        checksum: '1234567890abcdef',
      },
    },
    citation: {
      short: 'Quran 4:11',
      full: 'Surah An-Nisa, 4:11',
    },
    sourceProvenance: {
      sourceType: 'QURANIC_TEXT',
      sourceId: 'KING_FAHD_COMPLEX',
      title: 'Tanzil Quran Text',
      originalLanguage: 'ar',
      extractionMethod: 'VERIFIED_IMPORT',
      verifiedAgainstSource: true,
      verifiedBy: ['SCHOLAR_001'],
    },
    relationships: {
      ruleIds: ['MIRATH-FIXED_SHARE-CHILDREN-001'],
      explanationIds: [],
      relatedEvidenceIds: [],
    },
    licensing: {
      licenceStatus: 'PUBLIC_DOMAIN',
      attributionRequired: false,
      commercialUseAllowed: true,
      modificationAllowed: false,
      redistributionAllowed: true,
    },
    governance: {
      status: 'APPROVED',
      reviewMetadata: {
        approvedBy: ['SCHOLAR_001'],
      },
    },
    integrity: {
      contentChecksum: EvidenceChecksumService.generateContentChecksum(sampleContent),
      sourceChecksum: 'dummy-source-checksum',
      createdAt: '2026-08-02T00:00:00Z',
      createdBy: 'ADMIN',
      updatedAt: '2026-08-02T00:00:00Z',
      updatedBy: 'ADMIN',
    },
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
  };

  it('validates a correct Qur’an evidence record', () => {
    const report = EvidenceValidatorService.validate(validQuranEvidence);
    expect(report.isValid).toBe(true);
    expect(report.errors.length).toBe(0);
  });

  it('fails validation when surah number is out of bounds', () => {
    const invalid = JSON.parse(JSON.stringify(validQuranEvidence));
    invalid.reference = {
      surahNumber: 150, // Invalid > 114
      surahNameArabic: 'النساء',
      surahNames: { en: 'An-Nisa', ha: 'An-Nisa', ar: 'النساء' },
      ayahStart: 11,
      ayahEnd: 11,
      canonicalReference: 'Surah 150:11',
      shortReference: 'Quran 150:11',
    };

    const report = EvidenceValidatorService.validate(invalid);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.code === 'INVALID_SURAH_NUMBER')).toBe(true);
  });

  it('fails validation when ayahEnd < ayahStart', () => {
    const invalid = JSON.parse(JSON.stringify(validQuranEvidence));
    invalid.reference = {
      surahNumber: 4,
      surahNameArabic: 'النساء',
      surahNames: { en: 'An-Nisa', ha: 'An-Nisa', ar: 'النساء' },
      ayahStart: 12,
      ayahEnd: 11, // Invalid < 12
      canonicalReference: 'Surah An-Nisa (4:12-11)',
      shortReference: 'Quran 4:12-11',
    };

    const report = EvidenceValidatorService.validate(invalid);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.code === 'INVALID_AYAH_RANGE')).toBe(true);
  });
});
