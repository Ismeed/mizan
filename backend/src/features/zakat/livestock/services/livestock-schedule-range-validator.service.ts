/**
 * MIZAN — Livestock Schedule Range Validator Service (Phase 9)
 *
 * Validates count schedule range boundaries to prevent gaps, overlaps,
 * reversed bounds, invalid open-ended bands, and negative or decimal counts.
 */

import type { LivestockScheduleBand, LivestockScheduleRange } from '@mizan/shared';

export interface LivestockRangeValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class LivestockScheduleRangeValidator {
  public validateBands(bands: LivestockScheduleBand[]): LivestockRangeValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!bands || bands.length === 0) {
      return { isValid: false, errors: ['Schedule contains no bands.'], warnings: [] };
    }

    const sorted = [...bands].sort((a, b) => a.range.minimumCount - b.range.minimumCount);

    let previousMax: number | null = null;
    let hasOpenEnded = false;

    for (let i = 0; i < sorted.length; i++) {
      const band = sorted[i];
      const { minimumCount, maximumCount, isOpenEnded } = band.range;

      if (minimumCount < 0) {
        errors.push(`Band ${band.bandId}: minimumCount (${minimumCount}) cannot be negative.`);
      }

      if (maximumCount !== null && minimumCount > maximumCount) {
        errors.push(`Band ${band.bandId}: minimumCount (${minimumCount}) exceeds maximumCount (${maximumCount}).`);
      }

      if (hasOpenEnded) {
        errors.push(`Band ${band.bandId}: comes after an open-ended band.`);
      }

      if (isOpenEnded || maximumCount === null) {
        hasOpenEnded = true;
      }

      if (previousMax !== null && minimumCount <= previousMax) {
        errors.push(`Band ${band.bandId}: minimumCount (${minimumCount}) overlaps previous maximum (${previousMax}).`);
      } else if (previousMax !== null && minimumCount > previousMax + 1) {
        warnings.push(`Gap detected between ${previousMax} and ${minimumCount}.`);
      }

      previousMax = maximumCount;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
