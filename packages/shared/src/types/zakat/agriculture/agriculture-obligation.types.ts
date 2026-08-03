/**
 * MIZAN — Agriculture Obligation Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';
import type { AgricultureProduceTypeId } from './agriculture-produce-type.types';
import type { AgricultureNisabUnit } from './agriculture-nisab.types';

export type AgricultureObligationType =
  | 'NONE'
  | 'PRODUCE_DUE'
  | 'MONETARY_EQUIVALENT_PERMITTED'
  | 'MONETARY_ONLY'
  | 'REVIEW_REQUIRED';

export interface AgricultureProduceObligation {
  produceTypeId: AgricultureProduceTypeId;
  quantity: ExactFraction;
  unit: AgricultureNisabUnit;
  rateApplied: ExactFraction; // e.g. 1/10 or 1/20
}

export interface AgricultureMonetaryAlternative {
  permitted: boolean;
  permissionRuleId?: string;
  valuationMethodRuleId?: string;
}

export interface AgricultureObligationDefinition {
  obligationId: string;
  version: string;
  obligationType: AgricultureObligationType;
  produceObligation?: AgricultureProduceObligation;
  monetaryAlternative?: AgricultureMonetaryAlternative;
  evidenceIds: string[];
}
