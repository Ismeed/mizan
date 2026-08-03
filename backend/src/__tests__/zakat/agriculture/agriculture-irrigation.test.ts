import { AgricultureIrrigationService } from '../../../features/zakat/agriculture/services/agriculture-irrigation.service';

describe('AgricultureIrrigationService', () => {
  const service = new AgricultureIrrigationService();

  test('should classify primary irrigation method correctly', () => {
    const classification = service.classifyIrrigation('RAIN_FED', false);
    expect(classification.primaryMethod).toBe('RAIN_FED');
    expect(classification.irrigationCostBorne).toBe(false);
  });

  test('should calculate mixed irrigation rate accurately using ExactFraction', () => {
    // 50% rain-fed (1/2), 50% irrigated (1/2)
    // Rate = (1/2 * 1/10) + (1/2 * 1/20) = (1/20) + (1/40) = 3/40
    const rainFedFrac = { numerator: 1n, denominator: 2n };
    const irrigatedFrac = { numerator: 1n, denominator: 2n };

    const mixedRate = service.calculateMixedRate(rainFedFrac, irrigatedFrac);
    expect(mixedRate).toEqual({ numerator: 3n, denominator: 40n });
  });
});
