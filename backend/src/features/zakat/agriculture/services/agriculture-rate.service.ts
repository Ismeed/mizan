/**
 * MIZAN — Agriculture Rate Service (Phase 10)
 */

import {
  BASELINE_SYNTHETIC_AGRICULTURE_RATES,
  AgricultureRateRecord,
  AgricultureIrrigationMethod,
} from '@mizan/shared';

export class AgricultureRateService {
  private rateRecords = BASELINE_SYNTHETIC_AGRICULTURE_RATES;

  public resolveRate(method: AgricultureIrrigationMethod, madhhab: string): AgricultureRateRecord | undefined {
    return this.rateRecords.find(
      r => r.irrigationMethod === method && r.madhhabScope.appliesTo.includes(madhhab)
    );
  }
}
