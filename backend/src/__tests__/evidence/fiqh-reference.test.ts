import { BaseEvidence } from '../../../../packages/shared/src/types/evidence/base-evidence.types';
import { EvidenceType } from '../../../../packages/shared/src/types/evidence/evidence-type.registry';
import { EvidenceValidatorService } from '../../features/evidence/services/evidence-validator.service';
import { EvidenceChecksumService } from '../../features/evidence/services/evidence-checksum.service';

describe('Classical Fiqh Reference Standard Tests (Phase 4)', () => {
  const sampleContent = {
    originalText: 'الزوجة تأخذ الربع عند عدم وجود الولد والثمن مع وجود الولد',
    originalLanguage: 'ar',
    verifiedTranscription: true,
  };

  const validFiqhEvidence: BaseEvidence = {
    evidenceId: 'FIQH-MALIKI-MUDAWWANAH-0001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    evidenceType: EvidenceType.FIQH_REFERENCE,
    identity: {
      moduleScope: ['MIRATH'],
      topics: ['SPOUSE_SHARE'],
      subtopics: ['WIFE_SHARE'],
      canonicalReference: 'Al-Mudawwanah by Imam Sahnun, Vol. 2, p. 45',
      shortReference: 'Al-Mudawwanah 2:45',
    },
    madhhabScope: {
      mode: 'SINGLE_MADHHAB',
      appliesTo: ['MALIKI'],
    },
    content: sampleContent,
    translations: {
      en: {
        languageTag: 'en',
        locale: 'en-US',
        text: 'The wife receives 1/4 when there are no children and 1/8 when children exist.',
        translationSourceId: 'MIZAN_TRANSLATION_BOARD',
        translator: 'MIZAN Editorial',
        licenceStatus: 'PERMISSION_GRANTED',
        reviewStatus: 'APPROVED',
        checksum: 'ff0011223344',
      },
    },
    citation: {
      short: 'Al-Mudawwanah 2:45',
      full: 'Al-Mudawwanah by Imam Sahnun, Vol. 2, p. 45',
    },
    sourceProvenance: {
      sourceType: 'CLASSICAL_FIQH_BOOK',
      sourceId: 'AL_MUDAWWANAH',
      title: 'Al-Mudawwanah al-Kubra',
      author: 'Imam Sahnun',
      originalLanguage: 'ar',
      extractionMethod: 'MANUAL',
      verifiedAgainstSource: true,
      verifiedBy: ['MALIKI_SCHOLAR_001'],
    },
    relationships: {
      ruleIds: ['MIRATH-FIXED_SHARE-WIFE-MALIKI-001'],
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
        approvedBy: ['MALIKI_SCHOLAR_001'],
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

  it('validates a correct madhhab-specific Fiqh reference record', () => {
    const report = EvidenceValidatorService.validate(validFiqhEvidence);
    expect(report.isValid).toBe(true);
    expect(report.errors.length).toBe(0);
  });

  it('correctly captures single madhhab scope (MALIKI)', () => {
    expect(validFiqhEvidence.madhhabScope.mode).toBe('SINGLE_MADHHAB');
    expect(validFiqhEvidence.madhhabScope.appliesTo).toContain('MALIKI');
    expect(validFiqhEvidence.madhhabScope.appliesTo).not.toContain('HANAFI');
  });
});
