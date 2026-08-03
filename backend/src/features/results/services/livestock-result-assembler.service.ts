/**
 * MIZAN — Livestock Result Assembler Service (Phase 13)
 * Assembles LivestockObligationResultItem preserving schedule ID, band, animal class, and physical animals due.
 */

import type { ResultItem, LivestockObligationResultPayload } from '@mizan/shared';
import { ResultItemFactoryService } from './result-item-factory.service';

export interface AssembleLivestockInput {
  animalTypeId: 'CAMEL' | 'CATTLE' | 'SHEEP_GOAT';
  scheduleId: string;
  scheduleVersion: string;
  matchedBandId: string;
  matchedPatternId?: string;
  obligationDefinitionId: string;
  herdCount: number;
  animalObligations: Array<{
    animalTypeId: string;
    animalClassId: string;
    ageYears: number;
    gender?: 'FEMALE' | 'MALE' | 'ANY';
    quantity: number;
    description: string;
  }>;
}

export class LivestockResultAssemblerService {
  static assembleLivestockResult(input: AssembleLivestockInput): ResultItem {
    const payload: LivestockObligationResultPayload = {
      animalTypeId: input.animalTypeId,
      scheduleId: input.scheduleId,
      scheduleVersion: input.scheduleVersion,
      matchedBandId: input.matchedBandId,
      matchedPatternId: input.matchedPatternId ?? null,
      obligationDefinitionId: input.obligationDefinitionId,
      animalObligations: input.animalObligations,
    };

    return ResultItemFactoryService.createResultItem({
      itemType: 'LIVESTOCK_OBLIGATION_RESULT',
      subject: {
        subjectType: 'LIVESTOCK_ASSET',
        subjectId: `LIVESTOCK_${input.animalTypeId}`,
        subjectVersion: '1.0.0',
        instanceId: `livestock_inst_${input.animalTypeId}`,
      },
      status: 'PHYSICAL_OBLIGATION_DUE',
      decisionCode: 'LIVESTOCK_SCHEDULE_OBLIGATION_DUE',
      decisionType: 'ANIMAL_DUE',
      authoritativePayload: payload,
      exactValues: {
        counts: [{ valueId: 'HERD_COUNT', value: input.herdCount }],
      },
      monetaryValues: [],
      displayOrder: 40,
      sectionCode: 'LIVESTOCK_OBLIGATIONS',
    });
  }
}
