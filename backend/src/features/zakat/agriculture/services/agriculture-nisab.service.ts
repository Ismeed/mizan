/**
 * MIZAN — Agriculture Nisab Service (Phase 10)
 */

import {
  BASELINE_SYNTHETIC_AGRICULTURE_NISAB,
  AgricultureNisabRecord,
  AgricultureProduceTypeId,
  ExactFraction,
  compareExactFractions,
} from '@mizan/shared';

export class AgricultureNisabService {
  private nisabRecords = BASELINE_SYNTHETIC_AGRICULTURE_NISAB;

  public resolveNisab(produceTypeId: AgricultureProduceTypeId, madhhab: string): AgricultureNisabRecord | undefined {
    return this.nisabRecords.find(
      n => n.produceTypeScope.includes(produceTypeId) && n.madhhabScope.appliesTo.includes(madhhab)
    );
  }

  public isAboveNisab(quantity: ExactFraction, nisabThreshold: ExactFraction): boolean {
    return compareExactFractions(quantity, nisabThreshold) >= 0;
  }
}
