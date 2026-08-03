/**
 * Monetary Reconciliation Service
 * Phase 12 — MIZAN Currency Architecture
 */

import Decimal from 'decimal.js';
import { MirathMonetaryDistribution } from '@mizan/shared';

export interface ReconciliationReport {
  isReconciled: boolean;
  totalEstateMinor: string;
  totalDistributedMinor: string;
  discrepancyMinor: string;
  remainderPolicyId: string;
}

export class MonetaryReconciliationService {
  public static verifyDistributionReconciliation(
    distribution: MirathMonetaryDistribution
  ): ReconciliationReport {
    const netEstateMinor = new Decimal(distribution.netEstate.convertedNetEstate.amountMinor);
    const totalDistMinor = new Decimal(distribution.reconciliation.totalDistributedMinor);
    const discrepancy = netEstateMinor.sub(totalDistMinor);

    return {
      isReconciled: discrepancy.isZero(),
      totalEstateMinor: netEstateMinor.toString(),
      totalDistributedMinor: totalDistMinor.toString(),
      discrepancyMinor: discrepancy.toString(),
      remainderPolicyId: distribution.reconciliation.remainderPolicyId,
    };
  }
}
