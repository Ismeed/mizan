/**
 * MIZAN — Mirath Result Assembler Service (Phase 13)
 * Assembles MirathModuleResult and heir ResultItems from Mirath calculation execution.
 */

import type {
  MirathResult,
  MirathModuleResult,
  ResultItem,
  HeirShareResult,
  MoneyValue,
} from '@mizan/shared';
import { ResultItemFactoryService } from './result-item-factory.service';
import { HijabResultAssemblerService } from './hijab-result-assembler.service';

export interface MirathAssemblerInput {
  mirathResult: MirathResult;
  netEstateAmount: number;
  currencyCode: string;
  calculationId: string;
}

export class MirathResultAssemblerService {
  static assembleMirathResult(input: MirathAssemblerInput): {
    moduleResult: MirathModuleResult;
    resultItems: ResultItem[];
  } {
    const { mirathResult, netEstateAmount, currencyCode, calculationId } = input;
    const resultItems: ResultItem[] = [];

    // 1. Estate Preparation Result Item
    const netMinor = (netEstateAmount * 100).toFixed(0);
    const netDecimal = netEstateAmount.toFixed(2);

    const netMoney: MoneyValue = {
      currencyCode,
      representationType: 'MINOR_UNITS',
      amountMinor: netMinor,
      decimalAmount: netDecimal,
      minorUnitDigits: 2,
    };

    const estateItem = ResultItemFactoryService.createResultItem({
      itemType: 'ESTATE_PREPARATION_RESULT',
      subject: {
        subjectType: 'ESTATE',
        subjectId: 'NET_ESTATE',
        subjectVersion: '1.0.0',
        instanceId: `estate_${calculationId}`,
      },
      status: 'ELIGIBLE',
      decisionCode: 'MIRATH_ESTATE_PREPARED',
      decisionType: 'ESTATE_PREPARATION',
      authoritativePayload: {
        grossEstateMinor: netMinor,
        approvedDeductionsMinor: '0',
        netEstateMinor: netMinor,
        debtsMinor: '0',
        funeralExpensesMinor: '0',
        wasiyyahMinor: '0',
      },
      monetaryValues: [
        {
          valueId: 'NET_DISTRIBUTABLE_ESTATE',
          role: 'CALCULATION_BASE',
          money: netMoney,
        },
      ],
      displayOrder: 10,
      sectionCode: 'ESTATE_PREPARATION',
    });
    resultItems.push(estateItem);

    const eligibleHeirIds: string[] = [];
    const blockedHeirIds: string[] = [];
    const shareItemIds: string[] = [];

    // 2. Heir Result Items
    mirathResult.shares.forEach((share: HeirShareResult, idx: number) => {
      const heirId = share.key.toUpperCase();
      const instanceId = `heir_inst_${idx + 1}`;

      if (share.isBlocked) {
        blockedHeirIds.push(heirId);
        const hijabItem = HijabResultAssemblerService.assembleHijabResult({
          targetHeirId: heirId,
          instanceId,
          blockingType: 'COMPLETE_EXCLUSION',
          blockerHeirId: 'PRIMARY_HEIR',
          hijabRuleId: `RULE-HIJAB-${heirId}`,
          hijabRuleVersion: '1.0.0',
          currencyCode,
        });
        resultItems.push(hijabItem);
      } else {
        eligibleHeirIds.push(heirId);
        const amountMinor = (share.totalAmount * 100).toFixed(0);
        const amountDecimal = share.totalAmount.toFixed(2);

        const isResiduary = share.shareType === 'ASABAH';
        const itemType = isResiduary ? 'RESIDUARY_RESULT' : 'HEIR_DISTRIBUTION_RESULT';
        const decisionCode = isResiduary ? 'MIRATH_RESIDUARY_STATUS_ASSIGNED' : 'MIRATH_FIXED_SHARE_ASSIGNED';

        const item = ResultItemFactoryService.createResultItem({
          itemType,
          subject: {
            subjectType: 'HEIR',
            subjectId: heirId,
            subjectVersion: '1.0.0',
            instanceId,
          },
          status: 'SHARE_ASSIGNED',
          decisionCode,
          decisionType: isResiduary ? 'RESIDUARY_SHARE' : 'FIXED_SHARE',
          authoritativePayload: {
            eligibilityStatus: 'ELIGIBLE',
            hijabStatus: 'NOT_BLOCKED',
            inheritanceStatus: isResiduary ? 'RESIDUARY' : 'FIXED_SHARE',
            count: share.count,
          },
          exactValues: {
            fractions: [
              {
                valueId: 'FINAL_SHARE',
                numerator: share.fractionNumerator,
                denominator: share.fractionDenominator,
              },
            ],
            counts: [{ valueId: 'HEIR_COUNT', value: share.count }],
          },
          monetaryValues: [
            {
              valueId: 'FINAL_ALLOCATION',
              role: 'FINAL_RESULT',
              money: {
                currencyCode,
                representationType: 'MINOR_UNITS',
                amountMinor,
                decimalAmount: amountDecimal,
                minorUnitDigits: 2,
              },
            },
          ],
          displayOrder: 20 + idx,
          sectionCode: isResiduary ? 'RESIDUARY_RESULTS' : 'FIXED_SHARE_RESULTS',
        });

        resultItems.push(item);
        shareItemIds.push(item.resultItemId);
      }
    });

    const allocatedMinor = (mirathResult.totalAllocated * 100).toFixed(0);
    const allocatedMoney: MoneyValue = {
      currencyCode,
      representationType: 'MINOR_UNITS',
      amountMinor: allocatedMinor,
      decimalAmount: mirathResult.totalAllocated.toFixed(2),
      minorUnitDigits: 2,
    };

    const unallocatedMinor = (mirathResult.unallocated * 100).toFixed(0);
    const unallocatedMoney: MoneyValue = {
      currencyCode,
      representationType: 'MINOR_UNITS',
      amountMinor: unallocatedMinor,
      decimalAmount: mirathResult.unallocated.toFixed(2),
      minorUnitDigits: 2,
    };

    const moduleResult: MirathModuleResult = {
      module: 'MIRATH',
      estate: {
        grossEstate: [netMoney],
        approvedDeductions: [],
        netDistributableEstate: [netMoney],
        currencyMode: 'SINGLE_CURRENCY',
        estateSnapshotId: `snapshot_estate_${calculationId}`,
      },
      heirs: {
        entered: mirathResult.shares.map((s) => s.key.toUpperCase()),
        eligible: eligibleHeirIds,
        blocked: blockedHeirIds,
        partiallyAffected: [],
        reviewRequired: [],
      },
      shares: {
        fixedShareResults: shareItemIds,
        residuaryResults: [],
        adjustmentResults: [],
      },
      distribution: {
        heirDistributions: shareItemIds,
        totalDistributed: [allocatedMoney],
        monetaryRemainder: [unallocatedMoney],
        reconciliationStatus: mirathResult.unallocated === 0 ? 'RECONCILED' : 'RECONCILED_WITH_ROUNDING',
      },
      snapshots: {
        hijabResolutionSnapshotId: `snapshot_hijab_${calculationId}`,
        shareResolutionSnapshotId: `snapshot_share_${calculationId}`,
        monetaryCalculationSnapshotId: `snapshot_money_${calculationId}`,
      },
    };

    return { moduleResult, resultItems };
  }
}
