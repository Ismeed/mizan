import { AIEvidenceContextService } from '../../features/evidence/services/ai-evidence-context.service';
import { BaseEvidence } from '../../../../packages/shared/src/types/evidence/base-evidence.types';
import { EvidenceType } from '../../../../packages/shared/src/types/evidence/evidence-type.registry';

describe('AI Evidence Context Contract Tests (Phase 4)', () => {
  const dummyEvidence: BaseEvidence = {
    evidenceId: 'QURAN-004-011-011',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    evidenceType: EvidenceType.QURAN,
    identity: {
      moduleScope: ['MIRATH'],
      topics: ['INHERITANCE'],
      subtopics: [],
      canonicalReference: 'Surah An-Nisa (4:11)',
      shortReference: 'Quran 4:11',
    },
    madhhabScope: { mode: 'SHARED', appliesTo: ['HANAFI', 'MALIKI'] },
    content: { arabicText: 'يُوصِيكُمُ اللَّهُ...' },
    translations: { en: { text: 'Allah instructs you concerning your children...', translator: 'Sahih Intl' } },
    citation: { short: 'Quran 4:11', full: 'Surah An-Nisa (4:11)' },
    sourceProvenance: { sourceType: 'QURAN', sourceId: 'SAHIH', title: 'Quran', originalLanguage: 'ar', extractionMethod: 'MANUAL', verifiedAgainstSource: true, verifiedBy: ['SCHOLAR_1'] },
    relationships: { ruleIds: ['R1'], explanationIds: [], relatedEvidenceIds: [] },
    licensing: { licenceStatus: 'PUBLIC_DOMAIN', attributionRequired: false, commercialUseAllowed: true, modificationAllowed: false, redistributionAllowed: true },
    governance: { status: 'APPROVED', reviewMetadata: {} },
    integrity: { contentChecksum: '123', sourceChecksum: '123', createdAt: '2026-08-02', createdBy: 'A', updatedAt: '2026-08-02', updatedBy: 'A' },
  };

  it('prepares AI context package containing ALL 8 mandatory safety restrictions', () => {
    const aiContext = AIEvidenceContextService.prepareContext({
      module: 'MIRATH',
      selectedMadhhab: 'HANAFI',
      ruleId: 'MIRATH-FIXED_SHARE-SON-001',
      ruleVersion: '1.0.0',
      decisionType: 'SHARE_ALLOCATION',
      structuredDecision: { fraction: '1/2' },
      evidence: dummyEvidence,
    });

    expect(aiContext.task).toBe('EXPLAIN_EVIDENCE');
    expect(aiContext.restrictions.mustNotRecalculate).toBe(true);
    expect(aiContext.restrictions.mustNotChangeDecision).toBe(true);
    expect(aiContext.restrictions.mustNotInventEvidence).toBe(true);
    expect(aiContext.restrictions.mustNotInventTranslation).toBe(true);
    expect(aiContext.restrictions.mustNotInventHadithNumber).toBe(true);
    expect(aiContext.restrictions.mustNotSwitchMadhhab).toBe(true);
    expect(aiContext.restrictions.mustUseProvidedContext).toBe(true);
    expect(aiContext.restrictions.mustDiscloseInsufficientEvidence).toBe(true);
  });
});
