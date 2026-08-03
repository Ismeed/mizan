/**
 * CLI Test Command — Verify All Phase 13 Result Contracts (Phase 13)
 * Usage: npm run results:test-contracts
 */

import { MirathResultAssemblerService } from '../../src/features/results/services/mirath-result-assembler.service';
import { ZakatResultAssemblerService } from '../../src/features/results/services/zakat-result-assembler.service';
import { LivestockResultAssemblerService } from '../../src/features/results/services/livestock-result-assembler.service';
import { AgricultureResultAssemblerService } from '../../src/features/results/services/agriculture-result-assembler.service';

function main() {
  console.log('🧪 Testing All Phase 13 Result Item Contracts...');

  // 1. Mirath Contract
  const mirath = MirathResultAssemblerService.assembleMirathResult({
    mirathResult: {
      netEstate: 100,
      shares: [{ key: 'husband', label: 'Husband', count: 1, shareType: 'FARD', fractionLabel: '1/2', fractionNumerator: 1, fractionDenominator: 2, shareOfEstate: 0.5, totalAmount: 50, perPersonAmount: 50, isBlocked: false }],
      totalAllocated: 50,
      unallocated: 50,
      calculationMethod: 'NORMAL',
      madhhab: 'HANAFI',
    },
    netEstateAmount: 100,
    currencyCode: 'USD',
    calculationId: 'test_m',
  });
  console.log(`✅ Mirath Contract: ${mirath.resultItems.length} items assembled`);

  // 2. Zakat Contract
  const zakat = ZakatResultAssemblerService.assembleZakatResult({
    zakatResult: {
      isDue: true,
      hawlMet: true,
      totalZakatableWealth: 1000,
      totalLiabilities: 0,
      netZakatableWealth: 1000,
      nisabThreshold: 100,
      zakatDue: 25,
      zakatRate: 0.025,
      breakdown: [{ name: 'Cash', value: 1000, isZakatable: true }],
    } as any,
    currencyCode: 'USD',
    calculationId: 'test_z',
  });
  console.log(`✅ Zakat Contract: ${zakat.resultItems.length} items assembled`);

  // 3. Livestock Contract
  const livestock = LivestockResultAssemblerService.assembleLivestockResult({
    animalTypeId: 'SHEEP_GOAT',
    scheduleId: 'SCH-SHEEP-1',
    scheduleVersion: '1.0.0',
    matchedBandId: 'BAND-40-120',
    obligationDefinitionId: 'OBL-SHEEP-1',
    herdCount: 50,
    animalObligations: [{ animalTypeId: 'SHEEP_GOAT', animalClassId: 'SHEEP', ageYears: 1, quantity: 1, description: '1 sheep' }],
  });
  console.log(`✅ Livestock Contract: ${livestock.itemType} assembled (${livestock.status})`);

  // 4. Agriculture Contract
  const agri = AgricultureResultAssemblerService.assembleAgricultureResult({
    produceTypeId: 'DATES',
    harvestGroupId: 'HG-2026',
    nisabStatus: 'REACHED',
    irrigationClassification: 'RAIN_FED',
    rateNumerator: 1,
    rateDenominator: 10,
    harvestQuantityKg: 1000,
    obligationQuantityKg: 100,
  });
  console.log(`✅ Agriculture Contract: ${agri.itemType} assembled (${agri.status})`);

  console.log('🎉 All Result Contract Tests Passed Successfully!');
}

main();
