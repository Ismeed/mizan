/**
 * Explanation Language Neutrality Unit Tests
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 *
 * CRITICAL NON-NEGOTIABLE RULE:
 * Changing the user's language or locale MUST NEVER alter:
 * - Selected madhhab
 * - Applied rule ID
 * - Rule decision
 * - Inheritance fraction
 * - Calculated monetary amount
 */

import { ExplanationResolverService } from '../../features/explanations/services/explanation-resolver.service';
import { ExplanationRegistryService } from '../../features/explanations/services/explanation-registry.service';
import { ExplanationRecord } from '@mizan/shared';


describe('Explanation Language Neutrality Tests', () => {
  const sampleExplanation: ExplanationRecord = {
    explanationId: 'MIRATH-EXPLANATION-SPOUSE-SHARE-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      module: 'MIRATH',
      explanationType: 'FIXED_SHARE',
      topic: 'SPOUSE_SHARE',
    },
    relationships: {
      ruleIds: ['MIRATH-RULE-WIFE-001'],
      ruleFamilyIds: ['FAMILY-SPOUSE-FIXED-SHARE'],
      evidenceIds: ['QURAN-4-12'],
      heirIds: ['WIFE'],
      zakatCategoryIds: [],
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
        en: '{HEIR_NAME} receives {SHARE_FRACTION}.',
        ha: '{HEIR_NAME} tana samun {SHARE_FRACTION}.',
        ar: '{HEIR_NAME} تاخذ {SHARE_FRACTION}.',
      },
    },
    variables: ['HEIR_NAME', 'SHARE_FRACTION'],
    display: {
      shortVersionAvailable: true,
      fullVersionAvailable: true,
      educationalVersionAvailable: false,
      showEvidenceLinks: true,
      showMadhhabLabel: true,
    },
    references: {
      evidenceIds: ['QURAN-4-12'],
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
      contentChecksum: 'checksum123',
      createdAt: '2026-08-03T00:00:00Z',
      createdBy: 'SYSTEM',
      updatedAt: '2026-08-03T00:00:00Z',
      updatedBy: 'SYSTEM',
      isTestFixture: true,
    },
  };

  beforeAll(() => {
    ExplanationRegistryService.registerExplanation(sampleExplanation);
  });

  afterAll(() => {
    ExplanationRegistryService.clear();
  });

  it('MUST NOT change applied rule ID, share fraction, or calculation values when changing language', () => {
    const structuredResult = {
      heirId: 'WIFE',
      share: { numerator: 1, denominator: 8 },
      appliedRuleId: 'MIRATH-RULE-WIFE-001',
    };

    const resEn = ExplanationResolverService.resolveExplanation({
      explanationId: 'MIRATH-EXPLANATION-SPOUSE-SHARE-001',
      requestedLanguageTag: 'en',
      structuredResult,
      ruleId: 'MIRATH-RULE-WIFE-001',
    });

    const resHa = ExplanationResolverService.resolveExplanation({
      explanationId: 'MIRATH-EXPLANATION-SPOUSE-SHARE-001',
      requestedLanguageTag: 'ha',
      structuredResult,
      ruleId: 'MIRATH-RULE-WIFE-001',
    });

    const resAr = ExplanationResolverService.resolveExplanation({
      explanationId: 'MIRATH-EXPLANATION-SPOUSE-SHARE-001',
      requestedLanguageTag: 'ar',
      structuredResult,
      ruleId: 'MIRATH-RULE-WIFE-001',
    });

    // Verify source rule ID is identical across languages
    expect(resEn.source.ruleId).toBe('MIRATH-RULE-WIFE-001');
    expect(resHa.source.ruleId).toBe('MIRATH-RULE-WIFE-001');
    expect(resAr.source.ruleId).toBe('MIRATH-RULE-WIFE-001');

    // Verify variables extracted are identical
    const varEn = resEn.variables.find((v) => v.variableId === 'SHARE_FRACTION');
    const varHa = resHa.variables.find((v) => v.variableId === 'SHARE_FRACTION');
    const varAr = resAr.variables.find((v) => v.variableId === 'SHARE_FRACTION');

    expect(varEn?.sourceValue).toEqual({ numerator: 1, denominator: 8 });
    expect(varHa?.sourceValue).toEqual({ numerator: 1, denominator: 8 });
    expect(varAr?.sourceValue).toEqual({ numerator: 1, denominator: 8 });

    // Verify languages only change text representation
    expect(resEn.language.resolvedLanguageTag).toBe('en');
    expect(resHa.language.resolvedLanguageTag).toBe('ha');
    expect(resAr.language.resolvedLanguageTag).toBe('ar');
  });
});
