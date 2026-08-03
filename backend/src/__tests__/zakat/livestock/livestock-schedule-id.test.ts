/**
 * MIZAN — Livestock Schedule ID Validation Tests (Phase 9)
 */

import { LIVESTOCK_SCHEDULE_ID_REGEX, livestockScheduleIdSchema } from '@mizan/shared';

describe('Livestock Schedule ID Standard', () => {
  test('Valid schedule IDs pass regex and Zod validation', () => {
    const validIds = [
      'ZAKAT-LIVESTOCK-CATTLE-STANDARD-001',
      'ZAKAT-LIVESTOCK-CAMEL-STANDARD-001',
      'ZAKAT-LIVESTOCK-SHEEP_GOATS-STANDARD-001',
    ];

    for (const id of validIds) {
      expect(LIVESTOCK_SCHEDULE_ID_REGEX.test(id)).toBe(true);
      expect(() => livestockScheduleIdSchema.parse(id)).not.toThrow();
    }
  });

  test('Invalid schedule IDs are rejected', () => {
    const invalidIds = [
      'zakat-livestock-cattle-standard-001', // lowercase
      'ZAKAT-LIVESTOCK-CATTLE-001',          // missing context segment
      'ZAKAT-LIVESTOCK-CATTLE-STANDARD-1',   // non 3-digit sequence
      'ZAKAT-LIVESTOCK-CATTLE-STANDARD-0001',// 4-digit sequence
    ];

    for (const id of invalidIds) {
      expect(LIVESTOCK_SCHEDULE_ID_REGEX.test(id)).toBe(false);
      expect(() => livestockScheduleIdSchema.parse(id)).toThrow();
    }
  });
});
