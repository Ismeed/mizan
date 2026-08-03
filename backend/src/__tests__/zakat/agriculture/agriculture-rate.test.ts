import { AgricultureRateService } from '../../../features/zakat/agriculture/services/agriculture-rate.service';

describe('AgricultureRateService', () => {
  const service = new AgricultureRateService();

  test('should resolve 1/10 (10%) rate for RAIN_FED method', () => {
    const rateRecord = service.resolveRate('RAIN_FED', 'HANAFI');
    expect(rateRecord).toBeDefined();
    expect(rateRecord?.rate).toEqual({ numerator: 1n, denominator: 10n });
  });

  test('should resolve 1/20 (5%) rate for IRRIGATED_WITH_COST method', () => {
    const rateRecord = service.resolveRate('IRRIGATED_WITH_COST', 'HANAFI');
    expect(rateRecord).toBeDefined();
    expect(rateRecord?.rate).toEqual({ numerator: 1n, denominator: 20n });
  });
});
