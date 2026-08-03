/**
 * MIZAN — Hijab Result Assembler Service (Phase 13)
 * Assembles HijabResultItem for blocked or partially affected heirs.
 */

import type {
  ResultItem,
  HijabResultPayload,
  AppliedRuleReference,
  ResultEvidenceLink,
  ResultExplanationLink,
} from '@mizan/shared';
import { ResultItemFactoryService } from './result-item-factory.service';

export interface AssembleHijabInput {
  targetHeirId: string;
  instanceId: string;
  blockingType: 'COMPLETE_EXCLUSION' | 'PARTIAL_REDUCTION';
  blockerHeirId: string;
  blockerInstanceId?: string;
  hijabRuleId: string;
  hijabRuleVersion: string;
  currencyCode: string;
  reducedNumerator?: number;
  reducedDenominator?: number;
  appliedRules?: AppliedRuleReference[];
  evidence?: ResultEvidenceLink[];
  explanations?: ResultExplanationLink[];
}

export class HijabResultAssemblerService {
  static assembleHijabResult(input: AssembleHijabInput): ResultItem {
    const isComplete = input.blockingType === 'COMPLETE_EXCLUSION';

    const payload: HijabResultPayload = {
      hijabType: input.blockingType,
      blockedBy: [
        {
          blockerHeirId: input.blockerHeirId,
          blockerInstanceId: input.blockerInstanceId ?? null,
          hijabRuleId: input.hijabRuleId,
          hijabRuleVersion: input.hijabRuleVersion,
        },
      ],
      removeFromShareDistribution: isComplete,
      retainInCaseRecord: true,
      reducedFractionNumerator: input.reducedNumerator ?? null,
      reducedFractionDenominator: input.reducedDenominator ?? null,
    };

    const exactValues = input.reducedNumerator && input.reducedDenominator ? {
      fractions: [
        {
          valueId: 'REDUCED_SHARE',
          numerator: input.reducedNumerator,
          denominator: input.reducedDenominator,
        },
      ],
    } : {};

    return ResultItemFactoryService.createResultItem({
      itemType: 'HIJAB_RESULT',
      subject: {
        subjectType: 'HEIR',
        subjectId: input.targetHeirId,
        subjectVersion: '1.0.0',
        instanceId: input.instanceId,
      },
      status: isComplete ? 'BLOCKED' : 'PARTIALLY_AFFECTED',
      decisionCode: isComplete ? 'MIRATH_HEIR_COMPLETELY_BLOCKED' : 'MIRATH_HEIR_PARTIALLY_BLOCKED',
      decisionType: 'HIJAB_EXCLUSION',
      authoritativePayload: payload,
      exactValues,
      monetaryValues: isComplete ? [
        {
          valueId: 'FINAL_ALLOCATION',
          role: 'FINAL_RESULT',
          money: {
            currencyCode: input.currencyCode,
            representationType: 'MINOR_UNITS',
            amountMinor: '0',
            decimalAmount: '0.00',
            minorUnitDigits: 2,
          },
        },
      ] : [],
      appliedRules: input.appliedRules,
      evidence: input.evidence,
      explanations: input.explanations,
      displayOrder: 30,
      sectionCode: 'BLOCKED_HEIRS',
    });
  }
}
