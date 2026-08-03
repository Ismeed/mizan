/**
 * Explanation Resolver & Fallback Unit Tests
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationResolverService } from '../../features/explanations/services/explanation-resolver.service';
import { ExplanationRegistryService } from '../../features/explanations/services/explanation-registry.service';
import { ExplanationRecord } from '@mizan/shared';


describe('Explanation Resolver & Fallback Tests', () => {
  const testRecord: ExplanationRecord = {
    explanationId: 'ZAKAT-EXPLANATION-NISAB-RESULT-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      module: 'ZAKAT',
      explanationType: 'NISAB_RESULT',
      topic: 'CASH_NISAB',
    },
    relationships: {
      ruleIds: ['ZAKAT-RULE-NISAB-001'],
      ruleFamilyIds: [],
      evidenceIds: [],
      heirIds: [],
      zakatCategoryIds: ['CASH_SAVINGS'],
      livestockScheduleIds: [],
      agricultureRuleIds: [],
    },
    madhhabScope: {
      mode: 'SHARED',
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
      excludedMadhhabs: [],
    },
    content: {
      defaultLanguageTag: 'en',
      translations: {
        en: 'The wealth reached Nisab threshold of {NISAB_AMOUNT}.',
      },
    },
    variables: ['NISAB_AMOUNT'],
    display: {
      shortVersionAvailable: true,
      fullVersionAvailable: true,
      educationalVersionAvailable: false,
      showEvidenceLinks: true,
      showMadhhabLabel: true,
    },
    references: {
      evidenceIds: [],
      fiqhReferenceIds: [],
      sourceRecordIds: [],
    },
    governance: {
      status: 'DRAFT',
      reviewMetadata: {},
      effectiveFrom: null,
      effectiveUntil: null,
    },
    integrity: {
      contentChecksum: 'checksum456',
      createdAt: '2026-08-03T00:00:00Z',
      createdBy: 'SYSTEM',
      updatedAt: '2026-08-03T00:00:00Z',
      updatedBy: 'SYSTEM',
      isTestFixture: true,
    },
  };

  beforeAll(() => {
    ExplanationRegistryService.registerExplanation(testRecord);
  });

  afterAll(() => {
    ExplanationRegistryService.clear();
  });

  it('should resolve English explanation successfully', () => {
    const res = ExplanationResolverService.resolveExplanation({
      explanationId: 'ZAKAT-EXPLANATION-NISAB-RESULT-001',
      requestedLanguageTag: 'en',
      structuredResult: { nisabThreshold: 1025000, currencyCode: 'NGN' },
    });

    expect(res.status).toBe('RESOLVED');
    expect(res.language.resolvedLanguageTag).toBe('en');
    expect(res.content.short).toContain('₦1,025,000.00');
    expect(res.language.fallbackUsed).toBe(false);
  });

  it('should fallback to English when requested Hausa translation is missing and record fallbackUsed', () => {
    const res = ExplanationResolverService.resolveExplanation({
      explanationId: 'ZAKAT-EXPLANATION-NISAB-RESULT-001',
      requestedLanguageTag: 'ha',
      structuredResult: { nisabThreshold: 1025000, currencyCode: 'NGN' },
    });

    expect(res.status).toBe('FALLBACK_USED');
    expect(res.language.resolvedLanguageTag).toBe('en');
    expect(res.language.fallbackUsed).toBe(true);
    expect(res.language.fallbackReason).toBe('APPROVED_HAUSA_TRANSLATION_UNAVAILABLE');
  });

  it('should return UNAVAILABLE status for non-existent explanation ID', () => {
    const res = ExplanationResolverService.resolveExplanation({
      explanationId: 'NON-EXISTENT-EXPLANATION-999',
      requestedLanguageTag: 'en',
      structuredResult: {},
    });

    expect(res.status).toBe('UNAVAILABLE');
    expect(res.content.title).toBe('Explanation Unavailable');
  });
});
