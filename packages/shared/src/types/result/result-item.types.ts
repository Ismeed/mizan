/**
 * MIZAN — Standard Result Item Contract & Discriminated Union (Phase 13)
 * Every user-meaningful decision follows one result-item structure.
 */

import type { ResultItemType } from './result-item-type.registry';
import type { ResultSubject } from './result-subject.types';
import type { ResultItemStatus } from './result-item-status.types';
import type { DecisionCode } from './decision-code.registry';
import type { ExactValues } from './exact-values.types';
import type { MoneyResultValue } from './money-result-value.types';
import type { AppliedRuleReference } from './applied-rule-reference.types';
import type { ResultEvidenceLink } from './result-evidence-link.types';
import type { ResultExplanationLink } from './result-explanation-link.types';
import type { CalculationWarning } from './result-warning.types';
import type { CalculationError } from './result-error.types';
import type { ReviewRequirement } from './review-requirement.types';
import type {
  HijabResultPayload,
  FixedShareResultPayload,
  ResiduaryResultPayload,
  HeirDistributionResultPayload,
  BlockedHeirResultPayload,
  EstatePreparationResultPayload,
} from './mirath-result-item.types';
import type {
  ZakatCategoryResultPayload,
  ZakatNisabResultPayload,
  LivestockObligationResultPayload,
  AgricultureObligationResultPayload,
} from './zakat-result-item.types';

export interface ResultItemDecision<TPayload = Record<string, unknown>> {
  decisionCode: DecisionCode;
  decisionType: string;
  authoritativePayload: TPayload;
}

export interface ResultItemPresentation {
  displayOrder: number;
  sectionCode: string;
  emphasis: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface ResultItemIntegrity {
  itemChecksum: string;
}

export interface ResultItemBase<TType extends ResultItemType, TPayload = Record<string, unknown>> {
  resultItemId: string;
  itemType: TType;
  subject: ResultSubject;
  status: ResultItemStatus;
  decision: ResultItemDecision<TPayload>;
  exactValues: ExactValues;
  monetaryValues: MoneyResultValue[];
  ruleResolution: {
    appliedRules: AppliedRuleReference[];
    resolvedRuleSnapshots: string[];
  };
  evidence: ResultEvidenceLink[];
  explanations: ResultExplanationLink[];
  warnings: CalculationWarning[];
  errors: CalculationError[];
  review: ReviewRequirement | null;
  presentation: ResultItemPresentation;
  integrity: ResultItemIntegrity;
}

// ─── Specific Discriminated Result Items ─────────────────────────────────────

export type HijabResultItem = ResultItemBase<'HIJAB_RESULT', HijabResultPayload>;
export type FixedShareResultItem = ResultItemBase<'FIXED_SHARE_RESULT', FixedShareResultPayload>;
export type ResiduaryResultItem = ResultItemBase<'RESIDUARY_RESULT', ResiduaryResultPayload>;
export type HeirDistributionResultItem = ResultItemBase<'HEIR_DISTRIBUTION_RESULT', HeirDistributionResultPayload>;
export type BlockedHeirResultItem = ResultItemBase<'HEIR_ELIGIBILITY_RESULT', BlockedHeirResultPayload>;
export type EstatePreparationResultItem = ResultItemBase<'ESTATE_PREPARATION_RESULT', EstatePreparationResultPayload>;

export type ZakatCategoryResultItem = ResultItemBase<'ZAKAT_CATEGORY_RESULT', ZakatCategoryResultPayload>;
export type ZakatNisabResultItem = ResultItemBase<'ZAKAT_NISAB_RESULT', ZakatNisabResultPayload>;
export type LivestockObligationResultItem = ResultItemBase<'LIVESTOCK_OBLIGATION_RESULT', LivestockObligationResultPayload>;
export type AgricultureObligationResultItem = ResultItemBase<'AGRICULTURE_OBLIGATION_RESULT', AgricultureObligationResultPayload>;

export type GenericResultItem = ResultItemBase<ResultItemType, Record<string, unknown>>;

export type ResultItem =
  | HijabResultItem
  | FixedShareResultItem
  | ResiduaryResultItem
  | HeirDistributionResultItem
  | BlockedHeirResultItem
  | EstatePreparationResultItem
  | ZakatCategoryResultItem
  | ZakatNisabResultItem
  | LivestockObligationResultItem
  | AgricultureObligationResultItem
  | GenericResultItem;
