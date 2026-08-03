import { AgricultureScheduleResolutionService } from '../../../features/zakat/agriculture/services/agriculture-schedule-resolution.service';
import type { CanonicalAgricultureFacts } from '@mizan/shared';

describe('AgricultureScheduleResolutionService Pipeline', () => {
  const resolver = new AgricultureScheduleResolutionService();

  const mockFacts: CanonicalAgricultureFacts = {
    assetInstanceId: 'AGRI-INST-001',
    categoryId: 'AGRICULTURAL_PRODUCE',
    produceTypeId: 'WHEAT',
    harvest: {
      harvestDate: '2026-08-01',
      produceTypeId: 'WHEAT',
      quantity: { numerator: 10n, denominator: 1n }, // 10 Wasq (above 5 Wasq Nisab)
      quantityUnit: 'WASQ',
    },
    irrigation: {
      method: 'RAIN_FED',
      irrigationCostBorne: false,
    },
    ownership: {
      ownershipStartDate: '2026-01-01',
      isFullOwner: true,
    },
  };

  test('should execute 10-step pipeline and return produce obligation for rain-fed wheat above Nisab', () => {
    const { result, trace } = resolver.resolveAgriculture({
      calculationId: 'CALC-AGRI-100',
      facts: mockFacts,
      madhhab: 'HANAFI',
    });

    expect(result).toBeDefined();
    expect(result.eligibility.isEligible).toBe(true);
    expect(result.nisabResolution.isAboveNisab).toBe(true);
    expect(result.rateResolution.appliedRate).toEqual({ numerator: 1n, denominator: 10n });
    expect(result.obligation.obligationType).toBe('PRODUCE_DUE');
    // 10 Wasq * 1/10 = 1 Wasq
    expect(result.obligation.produceObligation?.quantity).toEqual({ numerator: 1n, denominator: 1n });

    expect(trace).toBeDefined();
    expect(trace.steps.length).toBe(7);
  });

  test('should return NOT_DUE / BELOW_NISAB when harvest is below Nisab threshold', () => {
    const belowNisabFacts: CanonicalAgricultureFacts = {
      ...mockFacts,
      harvest: {
        ...mockFacts.harvest,
        quantity: { numerator: 2n, denominator: 1n }, // 2 Wasq (below 5 Wasq Nisab)
      },
    };

    const { result } = resolver.resolveAgriculture({
      calculationId: 'CALC-AGRI-101',
      facts: belowNisabFacts,
      madhhab: 'HANAFI',
    });

    expect(result.eligibility.isEligible).toBe(false);
    expect(result.eligibility.reasonCode).toBe('BELOW_NISAB');
    expect(result.obligation.obligationType).toBe('NONE');
  });
});
