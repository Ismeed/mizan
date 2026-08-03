import { BASELINE_AGRICULTURE_PRODUCE_TYPES } from '@mizan/shared';
import { AgricultureProduceRegistryService } from '../../../features/zakat/agriculture/services/agriculture-produce-registry.service';

describe('AgricultureProduceRegistryService', () => {
  const service = new AgricultureProduceRegistryService();

  test('should return all baseline produce types', () => {
    const produceTypes = service.listProduceTypes();
    expect(produceTypes.length).toBeGreaterThan(0);
    expect(produceTypes).toEqual(BASELINE_AGRICULTURE_PRODUCE_TYPES);
  });

  test('should retrieve specific produce type WHEAT', () => {
    const wheat = service.getProduceType('WHEAT');
    expect(wheat).toBeDefined();
    expect(wheat?.canonicalName).toContain('Wheat');
    expect(wheat?.category).toBe('GRAIN');
  });

  test('should return undefined for invalid produce type ID', () => {
    const result = service.getProduceType('INVALID_ID' as any);
    expect(result).toBeUndefined();
  });
});
