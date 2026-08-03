/**
 * MIZAN — Baseline Monetary Remainder Policies Registry (Phase 12)
 */

import { MonetaryRemainderPolicy } from '../types/currency/rounding.types';

export const BASELINE_REMAINDER_POLICIES: MonetaryRemainderPolicy[] = [
  {
    remainderPolicyId: 'MIRATH-MONETARY-REMAINDER-001',
    version: '1.0.0',
    policyType: 'LARGEST_REMAINDER',
    conditions: {
      description: 'Reconcile 1-minor-unit rounding imbalance by assigning remaining cent/kobo to heir with largest fractional remainder',
    },
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    explanationIds: ['MIRATH-EXPLANATION-REMAINDER-RECONCILIATION-001'],
    governance: {
      status: 'APPROVED',
    },
  },
  {
    remainderPolicyId: 'ZAKAT-MONETARY-REMAINDER-001',
    version: '1.0.0',
    policyType: 'LARGEST_REMAINDER',
    conditions: {
      description: 'Standard Zakat monetary rounding reconciliation',
    },
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    explanationIds: ['ZAKAT-EXPLANATION-REMAINDER-RECONCILIATION-001'],
    governance: {
      status: 'APPROVED',
    },
  },
];
