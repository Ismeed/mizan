/**
 * MIZAN — Agriculture Irrigation Service (Phase 10)
 */

import {
  IrrigationClassification,
  AgricultureIrrigationMethod,
  MixedIrrigationRecord,
  ExactFraction,
  multiplyExactFractions,
  addExactFractions,
} from '@mizan/shared';

export class AgricultureIrrigationService {
  public classifyIrrigation(
    method: AgricultureIrrigationMethod,
    costBorne: boolean,
    mixedRecord?: MixedIrrigationRecord
  ): IrrigationClassification {
    return {
      primaryMethod: method,
      mixedRecord,
      irrigationCostBorne: costBorne,
      governanceStatus: 'PRODUCTION',
    };
  }

  public calculateMixedRate(
    rainFedFraction: ExactFraction,
    irrigatedFraction: ExactFraction,
    rainRate: ExactFraction = { numerator: 1n, denominator: 10n },
    irrigatedRate: ExactFraction = { numerator: 1n, denominator: 20n }
  ): ExactFraction {
    const rainPortion = multiplyExactFractions(rainFedFraction, rainRate);
    const irrigatedPortion = multiplyExactFractions(irrigatedFraction, irrigatedRate);
    return addExactFractions(rainPortion, irrigatedPortion);
  }
}
