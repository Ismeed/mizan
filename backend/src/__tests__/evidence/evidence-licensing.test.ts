import { EvidenceRAGIndexingGuard } from '../../features/evidence/services/evidence-rag-guard.service';
import { BaseEvidence } from '../../../../packages/shared/src/types/evidence/base-evidence.types';
import { EvidenceType } from '../../../../packages/shared/src/types/evidence/evidence-type.registry';

describe('Evidence Licensing & RAG Guard Standard Tests (Phase 4)', () => {
  const dummyEvidence: BaseEvidence = {
    evidenceId: 'QURAN-004-011-011',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    evidenceType: EvidenceType.QURAN,
    identity: { moduleScope: ['MIRATH'], topics: [], subtopics: [], canonicalReference: 'Surah An-Nisa (4:11)', shortReference: 'Quran 4:11' },
    madhhabScope: { mode: 'SHARED', appliesTo: ['HANAFI'] },
    content: { arabicText: 'يُوصِيكُمُ اللَّهُ...' },
    translations: { en: { text: 'Allah instructs you...' } },
    citation: { short: 'Quran 4:11', full: 'Surah An-Nisa (4:11)' },
    sourceProvenance: { sourceType: 'QURAN', sourceId: 'SAHIH', title: 'Quran', originalLanguage: 'ar', extractionMethod: 'MANUAL', verifiedAgainstSource: true, verifiedBy: ['S1'] },
    relationships: { ruleIds: [], explanationIds: [], relatedEvidenceIds: [] },
    licensing: { licenceStatus: 'UNKNOWN', attributionRequired: false, commercialUseAllowed: false, modificationAllowed: false, redistributionAllowed: false },
    governance: { status: 'PRODUCTION', reviewMetadata: {} },
    integrity: { contentChecksum: '123', sourceChecksum: '123', createdAt: '2026-08-02', createdBy: 'A', updatedAt: '2026-08-02', updatedBy: 'A' },
  };

  it('blocks RAG indexing when licence status is UNKNOWN', () => {
    const result = EvidenceRAGIndexingGuard.validateForIndexing(dummyEvidence);
    expect(result.isEligibleForIndexing).toBe(false);
    expect(result.blockReason).toContain('Licence status is \'UNKNOWN\'');
  });

  it('blocks RAG indexing when evidence status is DRAFT', () => {
    const draft = JSON.parse(JSON.stringify(dummyEvidence));
    draft.licensing.licenceStatus = 'PUBLIC_DOMAIN';
    draft.governance.status = 'DRAFT';

    const result = EvidenceRAGIndexingGuard.validateForIndexing(draft);
    expect(result.isEligibleForIndexing).toBe(false);
    expect(result.blockReason).toContain('Status is \'DRAFT\'');
  });

  it('blocks RAG indexing when evidence is a synthetic test fixture', () => {
    const fixture = JSON.parse(JSON.stringify(dummyEvidence));
    fixture.licensing.licenceStatus = 'PUBLIC_DOMAIN';
    fixture.governance.status = 'PRODUCTION';
    fixture.isTestFixture = true;

    const result = EvidenceRAGIndexingGuard.validateForIndexing(fixture);
    expect(result.isEligibleForIndexing).toBe(false);
    expect(result.blockReason).toContain('Synthetic test fixtures are prohibited');
  });
});
