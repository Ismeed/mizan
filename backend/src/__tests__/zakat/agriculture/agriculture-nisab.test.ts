import { AgricultureNisabService } from '../../../features/zakat/agriculture/services/agriculture-nisab.service';

describe('AgricultureNisabService', () => {
  const service = new AgricultureNisabService();

  test('should resolve Nisab record for WHEAT in HANAFI', () => {
    const record = service.resolveNisab('WHEAT', 'HANAFI');
    expect(record).toBeDefined();
    expect(record?.unit).toBe('WASQ');
    expect(record?.thresholdQuantity).toEqual({ numerator: 5n, denominator: 1n });
  });

  test('should correctly identify when quantity is above Nisab', () => {
    const isAbove = service.isAboveNisab(
      { numerator: 10n, denominator: 1n },
      { numerator: 5n, denominator: 1n }
    );
    expect(isAbove).toBe(true);
  });

  test('should correctly identify when quantity is below Nisab', () => {
    const isAbove = service.isAboveNisab(
      { numerator: 3n, denominator: 1n },
      { numerator: 5n, denominator: 1n }
    );
    expect(isAbove).toBe(false);
  });
});
