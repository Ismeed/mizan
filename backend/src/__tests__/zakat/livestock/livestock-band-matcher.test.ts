/**
 * MIZAN — Livestock Band Matcher Tests (Phase 9)
 */

import { LivestockBandMatcherService } from '../../../features/zakat/livestock/services/livestock-band-matcher.service';
import type { LivestockScheduleBand } from '@mizan/shared';

describe('Livestock Band Matcher Service', () => {
  const matcher = new LivestockBandMatcherService();

  const sampleBands: LivestockScheduleBand[] = [
    {
      bandId: 'BAND-1',
      sequence: 1,
      range: { minimumCount: 0, maximumCount: 29, minimumInclusive: true, maximumInclusive: true },
      obligation: { obligationDefinitionId: 'OBLIGATION-NONE' },
      evidenceLinks: [],
      explanationIds: [],
      governance: { status: 'DRAFT', isTestFixture: true, fixtureTag: 'TEST_ONLY_FIXTURE' },
    },
    {
      bandId: 'BAND-2',
      sequence: 2,
      range: { minimumCount: 30, maximumCount: 39, minimumInclusive: true, maximumInclusive: true },
      obligation: { obligationDefinitionId: 'OBLIGATION-TABI' },
      evidenceLinks: [],
      explanationIds: [],
      governance: { status: 'DRAFT', isTestFixture: true, fixtureTag: 'TEST_ONLY_FIXTURE' },
    },
  ];

  test('Count 15 matches BAND-1 (below threshold)', () => {
    const result = matcher.matchBand(15, sampleBands);
    expect(result.status).toBe('MATCHED');
    expect(result.matchedBandId).toBe('BAND-1');
  });

  test('Count 30 matches BAND-2', () => {
    const result = matcher.matchBand(30, sampleBands);
    expect(result.status).toBe('MATCHED');
    expect(result.matchedBandId).toBe('BAND-2');
  });

  test('Count 50 returns NO_MATCH (gap/unmapped)', () => {
    const result = matcher.matchBand(50, sampleBands);
    expect(result.status).toBe('NO_MATCH');
    expect(result.error).toContain('SCHEDULE_GAP');
  });

  test('Negative count returns NO_MATCH with error', () => {
    const result = matcher.matchBand(-5, sampleBands);
    expect(result.status).toBe('NO_MATCH');
    expect(result.error).toContain('INVALID_COUNT');
  });

  test('Decimal count returns NO_MATCH with error', () => {
    const result = matcher.matchBand(12.5, sampleBands);
    expect(result.status).toBe('NO_MATCH');
    expect(result.error).toContain('INVALID_COUNT');
  });
});
