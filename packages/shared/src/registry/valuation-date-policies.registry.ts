/**
 * MIZAN — Baseline Valuation Date Policies Registry (Phase 12)
 */

import { ValuationDatePolicy } from '../types/currency/valuation.types';

export const BASELINE_VALUATION_DATE_POLICIES: ValuationDatePolicy[] = [
  {
    valuationDatePolicyId: 'VALUATION-DATE-MIRATH-001',
    version: '1.0.0',
    usageScope: 'MIRATH_ESTATE',
    dateBasis: 'DATE_OF_DEATH',
    timezonePolicy: 'UTC',
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    governance: {
      status: 'APPROVED',
    },
  },
  {
    valuationDatePolicyId: 'VALUATION-DATE-ZAKAT-001',
    version: '1.0.0',
    usageScope: 'ZAKAT_CALCULATION',
    dateBasis: 'ZAKAT_ASSESSMENT_DATE',
    timezonePolicy: 'UTC',
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    governance: {
      status: 'APPROVED',
    },
  },
];
