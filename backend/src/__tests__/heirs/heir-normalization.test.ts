/**
 * MIZAN — Heir Normalization Tests (Phase 7)
 *
 * Tests HeirNormalizationService for exact matches, legacy aliases,
 * and ambiguity detection.
 */

import { HeirNormalizationService } from '../../features/heirs/services/heir-normalization.service';

describe('HeirNormalizationService', () => {

  test('normalizes exact Canonical Heir ID string', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'FULL_BROTHER',
      languageTag: 'en',
    });

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedHeirId).toBe('FULL_BROTHER');
    expect(result.requiresUserConfirmation).toBe(false);
  });

  test('normalizes legacy camelCase key "fullBrothers"', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'fullBrothers',
      languageTag: 'en',
    });

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedHeirId).toBe('FULL_BROTHER');
    expect(result.requiresUserConfirmation).toBe(false);
  });

  test('normalizes English screen label "Full Brother"', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'Full Brother',
      languageTag: 'en',
    });

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedHeirId).toBe('FULL_BROTHER');
  });

  test('normalizes Hausa label "Ɗan’uwa na uwa da uba"', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'Ɗan’uwa na uwa da uba',
      languageTag: 'ha',
    });

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedHeirId).toBe('FULL_BROTHER');
  });

  test('normalizes Arabic label "زوج"', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'زوج',
      languageTag: 'ar',
    });

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedHeirId).toBe('HUSBAND');
  });

  test('detects ambiguous term "Grandfather" and requires user confirmation', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'Grandfather',
      languageTag: 'en',
    });

    expect(result.status).toBe('AMBIGUOUS');
    expect(result.requiresUserConfirmation).toBe(true);
    expect(result.options).toBeDefined();
    expect(result.options!.length).toBeGreaterThanOrEqual(2);
    const heirIds = result.options!.map((o) => o.heirId);
    expect(heirIds).toContain('PATERNAL_GRANDFATHER');
    expect(heirIds).toContain('MATERNAL_GRANDFATHER');
  });

  test('rejects unrecognized input as UNSUPPORTED', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: 'UnknownRelative123',
      languageTag: 'en',
    });

    expect(result.status).toBe('UNSUPPORTED');
    expect(result.requiresUserConfirmation).toBe(false);
  });

  test('preserves original input string', async () => {
    const result = await HeirNormalizationService.normalizeHeirInput({
      input: '  Full Brother  ',
      languageTag: 'en',
    });

    expect(result.originalInput).toBe('Full Brother');
  });
});
