/**
 * MIZAN — Agriculture Obligation Service (Phase 10)
 *
 * Computes obligatory produce quantity using ExactFraction arithmetic.
 * Never converts to monetary currency — obligation is in produce weight/volume.
 */

import {
  AgricultureObligationDefinition,
  AgricultureProduceTypeId,
  AgricultureNisabUnit,
  ExactFraction,
  multiplyExactFractions,
} from '@mizan/shared';

export class AgricultureObligationService {
  public computeObligation(
    produceTypeId: AgricultureProduceTypeId,
    harvestQuantity: ExactFraction,
    unit: AgricultureNisabUnit,
    appliedRate: ExactFraction,
    isEligible: boolean
  ): AgricultureObligationDefinition {
    if (!isEligible) {
      return {
        obligationId: 'OBLIGATION-AGRI-NONE',
        version: '1.0.0',
        obligationType: 'NONE',
        evidenceIds: ['EVID-AGRI-OBLIGATION-NONE'],
      };
    }

    const obligatoryQuantity = multiplyExactFractions(harvestQuantity, appliedRate);

    return {
      obligationId: `OBLIGATION-AGRI-${produceTypeId}-${appliedRate.numerator}_${appliedRate.denominator}`,
      version: '1.0.0',
      obligationType: 'PRODUCE_DUE',
      produceObligation: {
        produceTypeId,
        quantity: obligatoryQuantity,
        unit,
        rateApplied: appliedRate,
      },
      monetaryAlternative: {
        permitted: false,
      },
      evidenceIds: ['EVID-AGRI-OBLIGATION-PRODUCE'],
    };
  }
}
