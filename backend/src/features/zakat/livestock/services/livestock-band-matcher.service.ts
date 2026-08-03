/**
 * MIZAN — Livestock Band Matcher Service (Phase 9)
 *
 * Deterministically selects the single matching schedule band for a qualifying count.
 */

import type { LivestockScheduleBand } from '@mizan/shared';

export interface BandMatchResult {
  matchedBand: LivestockScheduleBand | null;
  status: 'MATCHED' | 'NO_MATCH' | 'MULTIPLE_MATCHES';
  matchedBandId?: string;
  error?: string;
}

export class LivestockBandMatcherService {
  public matchBand(count: number, bands: LivestockScheduleBand[]): BandMatchResult {
    if (!Number.isInteger(count) || count < 0) {
      return {
        matchedBand: null,
        status: 'NO_MATCH',
        error: `INVALID_COUNT: Count must be a non-negative integer (received ${count}).`,
      };
    }

    const matches = bands.filter(b => {
      const minOk = b.range.minimumInclusive
        ? count >= b.range.minimumCount
        : count > b.range.minimumCount;

      const maxOk = b.range.maximumCount === null || b.range.isOpenEnded
        ? true
        : b.range.maximumInclusive
          ? count <= b.range.maximumCount
          : count < b.range.maximumCount;

      return minOk && maxOk;
    });

    if (matches.length === 1) {
      return {
        matchedBand: matches[0],
        status: 'MATCHED',
        matchedBandId: matches[0].bandId,
      };
    }

    if (matches.length > 1) {
      return {
        matchedBand: null,
        status: 'MULTIPLE_MATCHES',
        error: `SCHEDULE_OVERLAP: Count ${count} matched multiple bands (${matches.map(m => m.bandId).join(', ')}).`,
      };
    }

    return {
      matchedBand: null,
      status: 'NO_MATCH',
      error: `SCHEDULE_GAP: No schedule band matched count ${count}.`,
    };
  }
}
