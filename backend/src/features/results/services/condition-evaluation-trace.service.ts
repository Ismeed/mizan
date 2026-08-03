/**
 * MIZAN — Condition Evaluation Trace Service (Phase 13)
 * Records and retrieves condition evaluation results for audit tracing.
 */

import type { SingleConditionEvaluationResult } from '@mizan/shared';
import crypto from 'crypto';

export class ConditionEvaluationTraceService {
  private static traces: Map<string, SingleConditionEvaluationResult[]> = new Map();

  static recordConditionEvaluation(
    ruleExecutionResultId: string,
    conditionId: string,
    fieldPath: string,
    operator: string,
    expectedValue: unknown,
    actualValue: unknown,
    result: 'MATCHED' | 'NOT_MATCHED' | 'ERROR',
    valueType: string,
    errorCode?: string
  ): SingleConditionEvaluationResult {
    const traceId = `cond_eval_${crypto.randomUUID()}`;
    const record: SingleConditionEvaluationResult = {
      conditionEvaluationId: traceId,
      conditionId,
      fieldPath,
      operator,
      expectedValue,
      actualValue,
      result,
      valueType,
      errorCode: errorCode ?? null,
    };

    const list = this.traces.get(ruleExecutionResultId) ?? [];
    list.push(record);
    this.traces.set(ruleExecutionResultId, list);

    return record;
  }

  static getTracesForExecution(ruleExecutionResultId: string): SingleConditionEvaluationResult[] {
    return this.traces.get(ruleExecutionResultId) ?? [];
  }
}
