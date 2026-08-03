/**
 * Livestock Result Contract Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { LivestockResultAssemblerService } from '../../features/results/services/livestock-result-assembler.service';

describe('Livestock Result Contract Tests', () => {
  it('should assemble a physical livestock obligation item without forcing monetary values or percentages', () => {
    const item = LivestockResultAssemblerService.assembleLivestockResult({
      animalTypeId: 'CATTLE',
      scheduleId: 'SCH-CATTLE-HANAFI-001',
      scheduleVersion: '1.0.0',
      matchedBandId: 'BAND-CATTLE-30-39',
      obligationDefinitionId: 'OBL-TABEE-1',
      herdCount: 35,
      animalObligations: [
        {
          animalTypeId: 'CATTLE',
          animalClassId: 'TABEE',
          ageYears: 1,
          gender: 'MALE',
          quantity: 1,
          description: '1 Tabi (one-year-old male cattle)',
        },
      ],
    });

    expect(item.itemType).toBe('LIVESTOCK_OBLIGATION_RESULT');
    expect(item.status).toBe('PHYSICAL_OBLIGATION_DUE');
    expect(item.monetaryValues.length).toBe(0);
    expect(item.exactValues.counts[0].value).toBe(35);
  });
});
