import { BaseEvidence } from '../../../../packages/shared/src/types/evidence/base-evidence.types';
import { HadithEvidence } from '../../../../packages/shared/src/types/evidence/hadith-evidence.types';
import { EvidenceType } from '../../../../packages/shared/src/types/evidence/evidence-type.registry';
import { EvidenceValidatorService } from '../../features/evidence/services/evidence-validator.service';
import { EvidenceChecksumService } from '../../features/evidence/services/evidence-checksum.service';

describe('Hadith Evidence Standard Tests (Phase 4)', () => {
  const sampleContent = {
    arabicText: 'لا زكاة في مال حتى يحول عليه الحول',
    matnText: 'No Zakat is due on wealth until a full lunar year (Hawl) has elapsed',
    narrator: 'Aisha (RA)',
  };

  const validHadithEvidence: HadithEvidence = {
    evidenceId: 'HADITH-BUKHARI-001454',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    evidenceType: EvidenceType.HADITH,
    reference: {
      collectionId: 'BUKHARI',
      collectionNames: { en: 'Sahih al-Bukhari', ha: 'Sahih al-Bukhari', ar: 'صحيح البخاري' },
      canonicalHadithNumber: '1454',
      editionSpecificNumbers: [],
      canonicalReference: 'Sahih al-Bukhari 1454',
      shortReference: 'Bukhari 1454',
    },
    identity: {
      moduleScope: ['ZAKAT'],
      topics: ['HAWL', 'ZAKAT_CONDITIONS'],
      subtopics: ['LUNAR_YEAR'],
      canonicalReference: 'Sahih al-Bukhari 1454',
      shortReference: 'Bukhari 1454',
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
        direction: 'LTR',
        contentType: 'APPROVED_TRANSLATION',
        text: 'No Zakat is due on wealth until a full lunar year (Hawl) has elapsed.',
        sourceId: 'BUKHARI_ENGLISH_DARUSSALAM',
        version: '1.0.0',
        reviewStatus: 'APPROVED',
        checksum: 'abc123def456',
      },
    },
    citation: {
      short: 'Bukhari 1454',
      full: 'Sahih al-Bukhari, Hadith 1454',
    },
    sourceProvenance: {
      sourceType: 'HADITH_COLLECTION',
      sourceId: 'SAHIH_BUKHARI',
      title: 'Sahih al-Bukhari',
      originalLanguage: 'ar',
      extractionMethod: 'VERIFIED_IMPORT',
      verifiedAgainstSource: true,
      verifiedBy: ['HADITH_SCHOLAR_001'],
    },
    relationships: {
      ruleIds: ['ZAKAT-HAWL-ELIGIBILITY-001'],
      explanationIds: [],
      relatedEvidenceIds: [],
    },
    licensing: {
      licenceStatus: 'PUBLIC_DOMAIN',
      attributionRequired: true,
      commercialUseAllowed: true,
      modificationAllowed: false,
      redistributionAllowed: true,
    },
    governance: {
      status: 'APPROVED',
      reviewMetadata: {
        approvedBy: ['HADITH_SCHOLAR_001'],
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
    grading: {
      primaryGrade: {
        grade: 'SAHIH',
        grader: 'Imam al-Bukhari',
        gradingSourceId: 'SAHIH_BUKHARI_KITAB_ZAKAT',
        reviewStatus: 'APPROVED',
      },
      additionalGradingRecords: [],
      displayPolicy: 'SHOW_APPROVED_PRIMARY',
    },
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
  };

  it('validates a correct Hadith evidence record with attributed grading', () => {
    const hadithRecord = JSON.parse(JSON.stringify(validHadithEvidence));
    hadithRecord.grading = {
      primaryGrade: {
        grade: 'SAHIH',
        grader: 'Imam al-Bukhari',
        gradingSourceId: 'SAHIH_BUKHARI_KITAB_ZAKAT',
        reviewStatus: 'APPROVED',
      },
      additionalGradingRecords: [],
      displayPolicy: 'SHOW_APPROVED_PRIMARY',
    };

    const report = EvidenceValidatorService.validate(hadithRecord);
    expect(report.isValid).toBe(true);
    expect(report.errors.length).toBe(0);
  });

  it('fails validation when Hadith grading record is missing gradingSourceId', () => {
    const invalid = JSON.parse(JSON.stringify(validHadithEvidence));
    invalid.grading = {
      primaryGrade: {
        grade: 'SAHIH',
        grader: 'Imam al-Bukhari',
        gradingSourceId: '', // Missing
        reviewStatus: 'APPROVED',
      },
      additionalGradingRecords: [],
      displayPolicy: 'SHOW_APPROVED_PRIMARY',
    };

    const report = EvidenceValidatorService.validate(invalid);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.code === 'MISSING_GRADING_SOURCE')).toBe(true);
  });
});
