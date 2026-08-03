/**
 * MIZAN — Agriculture Measurement Service (Phase 10)
 *
 * Handles unit conversions using ExactFraction arithmetic.
 */

import {
  BASELINE_SYNTHETIC_UNIT_CONVERSIONS,
  CanonicalMeasurementUnitId,
  ExactFraction,
  multiplyExactFractions,
} from '@mizan/shared';

export class AgricultureMeasurementService {
  private conversions = BASELINE_SYNTHETIC_UNIT_CONVERSIONS;

  public convertQuantity(
    quantity: ExactFraction,
    fromUnit: CanonicalMeasurementUnitId,
    toUnit: CanonicalMeasurementUnitId
  ): { convertedQuantity: ExactFraction; conversionId: string } {
    if (fromUnit === toUnit) {
      return { convertedQuantity: quantity, conversionId: 'IDENTITY' };
    }

    const conversionRecord = this.conversions.find(
      c => c.fromUnit === fromUnit && c.toUnit === toUnit
    );

    if (!conversionRecord) {
      throw new Error(`UNSUPPORTED_CONVERSION: No conversion record found from ${fromUnit} to ${toUnit}.`);
    }

    const convertedQuantity = multiplyExactFractions(quantity, conversionRecord.conversionFactor);
    return { convertedQuantity, conversionId: conversionRecord.conversionId };
  }
}
