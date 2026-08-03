/**
 * MIZAN — Condition Evaluation Contract (Phase 13)
 * Traceable result for every evaluated declarative condition.
 */

export interface SingleConditionEvaluationResult {
  conditionEvaluationId: string;
  conditionId: string;
  fieldPath: string;
  operator: string;
  expectedValue: unknown;
  actualValue: unknown;
  result: 'MATCHED' | 'NOT_MATCHED' | 'ERROR';
  valueType: string;
  errorCode?: string | null;
}

export type TraceConditionEvaluationResult = SingleConditionEvaluationResult;
