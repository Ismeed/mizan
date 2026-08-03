/**
 * MIZAN — Agriculture Result Assembler Service (Phase 13)
 * Assembles AgricultureObligationResultItem preserving produce ID, harvest group, irrigation classification, and physical quantities.
 */

import type { ResultItem, AgricultureObligationResultPayload } from '@mizan/shared';
import { ResultItemFactoryService } from './result-item-factory.service';

export interface AssembleAgricultureInput {
  produceTypeId: string;
  harvestGroupId: string;
  nisabStatus: 'REACHED' | 'NOT_REACHED';
  irrigationClassification: 'RAIN_FED' | 'IRRIGATED' | 'MIXED_HARVEST';
  rateNumerator: number;
  rateDenominator: number;
  harvestQuantityKg: number;
  obligationQuantityKg: number;
}

export class AgricultureResultAssemblerService {
  static assembleAgricultureResult(input: AssembleAgricultureInput): ResultItem {
    const payload: AgricultureObligationResultPayload = {
      produceTypeId: input.produceTypeId,
      harvestGroupId: input.harvestGroupId,
      nisabStatus: input.nisabStatus,
      irrigationClassification: input.irrigationClassification,
      deductionStatus: 'NO_DEDUCTIONS',
      obligationType: 'PHYSICAL_PRODUCE',
    };

    return ResultItemFactoryService.createResultItem({
      itemType: 'AGRICULTURE_OBLIGATION_RESULT',
      subject: {
        subjectType: 'HARVEST_GROUP',
        subjectId: input.produceTypeId,
        subjectVersion: '1.0.0',
        instanceId: `harvest_${input.harvestGroupId}`,
      },
      status: 'PHYSICAL_OBLIGATION_DUE',
      decisionCode: 'AGRICULTURE_PHYSICAL_OBLIGATION_DUE',
      decisionType: 'PHYSICAL_PRODUCE',
      authoritativePayload: payload,
      exactValues: {
        rates: [
          {
            valueId: 'AGRICULTURE_RATE',
            representation: 'RATIONAL',
            numerator: input.rateNumerator,
            denominator: input.rateDenominator,
          },
        ],
        quantities: [
          {
            valueId: 'HARVEST_QUANTITY',
            value: input.harvestQuantityKg.toString(),
            unitId: 'KILOGRAM',
          },
          {
            valueId: 'PHYSICAL_OBLIGATION',
            value: input.obligationQuantityKg.toString(),
            unitId: 'KILOGRAM',
          },
        ],
      },
      monetaryValues: [],
      displayOrder: 50,
      sectionCode: 'AGRICULTURE_OBLIGATIONS',
    });
  }
}
