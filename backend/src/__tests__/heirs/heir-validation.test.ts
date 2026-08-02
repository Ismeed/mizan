/**
 * MIZAN — Heir Validation Tests (Phase 7)
 *
 * Tests HeirValidationService for structural contradictions, circular lineage,
 * and spec compliance.
 */

import { HeirValidationService } from '../../features/heirs/services/heir-validation.service';
import { BASELINE_CANONICAL_HEIRS } from '@mizan/shared';

describe('HeirValidationService', () => {

  test('all 37 baseline entities pass validation', () => {
    for (const entity of BASELINE_CANONICAL_HEIRS) {
      const report = HeirValidationService.validateEntity(entity);
      if (!report.passed) {
        console.error(`Validation failed for ${entity.heirId}:`, report.issues);
      }
      expect(report.passed).toBe(true);
      expect(report.issues).toHaveLength(0);
    }
  });

  test('detects structural contradiction when SPOUSE has lineageSide PATERNAL', () => {
    const invalidEntity = {
      ...BASELINE_CANONICAL_HEIRS[0], // HUSBAND
      classification: {
        ...BASELINE_CANONICAL_HEIRS[0].classification,
        lineageSide: 'PATERNAL' as const,
      },
    };

    const report = HeirValidationService.validateEntity(invalidEntity);
    expect(report.passed).toBe(false);
    expect(report.issues.some((i) => i.errorCode === 'STRUCTURAL_CONTRADICTION')).toBe(true);
  });

  test('detects structural contradiction when DESCENDANT has ASCENDING direction', () => {
    const invalidEntity = {
      ...BASELINE_CANONICAL_HEIRS[12], // SON
      classification: {
        ...BASELINE_CANONICAL_HEIRS[12].classification,
        generationDirection: 'ASCENDING' as const,
      },
    };

    const report = HeirValidationService.validateEntity(invalidEntity);
    expect(report.passed).toBe(false);
    expect(report.issues.some((i) => i.errorCode === 'STRUCTURAL_CONTRADICTION')).toBe(true);
  });

  test('detects circular lineage path self-reference', () => {
    const invalidEntity = {
      ...BASELINE_CANONICAL_HEIRS[0], // HUSBAND
      relationship: {
        ...BASELINE_CANONICAL_HEIRS[0].relationship,
        parentHeirId: 'HUSBAND' as any,
      },
    };

    const report = HeirValidationService.validateEntity(invalidEntity);
    expect(report.passed).toBe(false);
    expect(report.issues.some((i) => i.errorCode === 'CIRCULAR_LINEAGE_PATH')).toBe(true);
  });
});
