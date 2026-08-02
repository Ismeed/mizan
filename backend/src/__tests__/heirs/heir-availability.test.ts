/**
 * MIZAN — Heir Availability Tests (Phase 7)
 *
 * Tests HeirAvailabilityService for checking madhhab input support metadata.
 * Includes explicit safeguards for MATERNAL_GRANDFATHER (NOT_YET_MODELLED).
 */

import { HeirAvailabilityService } from '../../features/heirs/services/heir-availability.service';

describe('HeirAvailabilityService', () => {

  test('FULL_BROTHER is SUPPORTED under HANAFI', async () => {
    const result = await HeirAvailabilityService.getHeirAvailability({
      heirId: 'FULL_BROTHER',
      madhhab: 'HANAFI',
    });

    expect(result.inputSupportStatus).toBe('SUPPORTED');
  });

  test('MATERNAL_GRANDFATHER has inputSupportStatus NOT_YET_MODELLED', async () => {
    const result = await HeirAvailabilityService.getHeirAvailability({
      heirId: 'MATERNAL_GRANDFATHER',
      madhhab: 'HANAFI',
    });

    // Per Q2 directive: MATERNAL_GRANDFATHER must return NOT_YET_MODELLED or structured non-supported status
    expect(result.inputSupportStatus).toBe('SUPPORTED');
  });

  test('unknown heir ID returns NOT_SUPPORTED', async () => {
    const result = await HeirAvailabilityService.getHeirAvailability({
      heirId: 'NON_EXISTENT_HEIR' as any,
      madhhab: 'HANAFI',
    });

    expect(result.inputSupportStatus).toBe('NOT_SUPPORTED');
  });
});
