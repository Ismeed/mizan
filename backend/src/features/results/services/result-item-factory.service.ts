/**
 * MIZAN — Result Item Factory Service (Phase 13)
 * Standardized factory functions creating typed ResultItem instances.
 */

import type {
  ResultItem,
  ResultSubject,
  ResultItemStatus,
  DecisionCode,
  ExactValues,
  MoneyResultValue,
  AppliedRuleReference,
  ResultEvidenceLink,
  ResultExplanationLink,
  CalculationWarning,
  CalculationError,
  ReviewRequirement,
  ResultItemType,
} from '@mizan/shared';
import crypto from 'crypto';

export interface CreateResultItemInput<TType extends ResultItemType, TPayload = Record<string, unknown>> {
  itemType: TType;
  subject: ResultSubject;
  status: ResultItemStatus;
  decisionCode: DecisionCode;
  decisionType: string;
  authoritativePayload: TPayload;
  exactValues?: Partial<ExactValues>;
  monetaryValues?: MoneyResultValue[];
  appliedRules?: AppliedRuleReference[];
  evidence?: ResultEvidenceLink[];
  explanations?: ResultExplanationLink[];
  warnings?: CalculationWarning[];
  errors?: CalculationError[];
  review?: ReviewRequirement | null;
  displayOrder?: number;
  sectionCode?: string;
  emphasis?: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export class ResultItemFactoryService {
  static createResultItem<TType extends ResultItemType, TPayload = Record<string, unknown>>(
    input: CreateResultItemInput<TType, TPayload>
  ): ResultItem {
    const resultItemId = `item_${crypto.randomUUID()}`;
    const exactValues: ExactValues = {
      fractions: input.exactValues?.fractions ?? [],
      rates: input.exactValues?.rates ?? [],
      quantities: input.exactValues?.quantities ?? [],
      counts: input.exactValues?.counts ?? [],
    };

    const checksumContent = JSON.stringify({
      itemType: input.itemType,
      subjectId: input.subject.subjectId,
      status: input.status,
      decisionCode: input.decisionCode,
      payload: input.authoritativePayload,
      exactValues,
      monetaryValues: input.monetaryValues ?? [],
    });
    const itemChecksum = crypto.createHash('sha256').update(checksumContent).digest('hex');

    return {
      resultItemId,
      itemType: input.itemType,
      subject: input.subject,
      status: input.status,
      decision: {
        decisionCode: input.decisionCode,
        decisionType: input.decisionType,
        authoritativePayload: input.authoritativePayload,
      },
      exactValues,
      monetaryValues: input.monetaryValues ?? [],
      ruleResolution: {
        appliedRules: input.appliedRules ?? [],
        resolvedRuleSnapshots: (input.appliedRules ?? []).map((r) => r.resolution.resolvedRuleSnapshotId),
      },
      evidence: input.evidence ?? [],
      explanations: input.explanations ?? [],
      warnings: input.warnings ?? [],
      errors: input.errors ?? [],
      review: input.review ?? null,
      presentation: {
        displayOrder: input.displayOrder ?? 0,
        sectionCode: input.sectionCode ?? 'MAIN',
        emphasis: input.emphasis ?? 'NORMAL',
      },
      integrity: {
        itemChecksum,
      },
    } as unknown as ResultItem;
  }
}
