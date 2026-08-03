/**
 * MIZAN — Agriculture Produce Registry Service (Phase 10)
 */

import {
  BASELINE_AGRICULTURE_PRODUCE_TYPES,
  AgricultureProduceTypeRecord,
  AgricultureProduceTypeId,
} from '@mizan/shared';

export class AgricultureProduceRegistryService {
  private produceTypes = BASELINE_AGRICULTURE_PRODUCE_TYPES;

  public getProduceType(produceTypeId: AgricultureProduceTypeId): AgricultureProduceTypeRecord | undefined {
    return this.produceTypes.find(p => p.produceTypeId === produceTypeId);
  }

  public listProduceTypes(): AgricultureProduceTypeRecord[] {
    return this.produceTypes;
  }
}
