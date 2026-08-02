/**
 * MIZAN — Canonical Heir ID Tests (Phase 7)
 *
 * Tests the core permanent identifier rules and Zod schema validations.
 */

import { CanonicalHeirIdSchema, BASELINE_CANONICAL_HEIRS } from '@mizan/shared';

describe('Canonical Heir Identifier Standard', () => {

  describe('valid identifiers pass schema', () => {
    test('FULL_BROTHER passes schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('FULL_BROTHER');
      expect(result.success).toBe(true);
    });

    test('PATERNAL_GRANDFATHER passes schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('PATERNAL_GRANDFATHER');
      expect(result.success).toBe(true);
    });

    test('all 37 baseline identifiers pass schema', () => {
      for (const entity of BASELINE_CANONICAL_HEIRS) {
        const result = CanonicalHeirIdSchema.safeParse(entity.heirId);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('invalid identifiers fail schema', () => {
    test('lowercase IDs fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('full_brother');
      expect(result.success).toBe(false);
    });

    test('IDs with spaces fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('Full Brother');
      expect(result.success).toBe(false);
    });

    test('IDs with hyphens fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('FULL-BROTHER');
      expect(result.success).toBe(false);
    });

    test('Arabic translated IDs fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('الأخ_الشقيق');
      expect(result.success).toBe(false);
    });

    test('IDs containing madhhab names fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('MALIKI_FULL_BROTHER');
      expect(result.success).toBe(false);
    });

    test('IDs containing version strings fail schema', () => {
      const result = CanonicalHeirIdSchema.safeParse('FULL_BROTHER_V1');
      expect(result.success).toBe(false);
    });
  });

  describe('baseline registry properties', () => {
    test('contains exactly 37 baseline identifiers', () => {
      expect(BASELINE_CANONICAL_HEIRS).toHaveLength(37);
    });

    test('all baseline IDs are unique', () => {
      const ids = BASELINE_CANONICAL_HEIRS.map((h) => h.heirId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
