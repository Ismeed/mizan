/**
 * MIZAN — Agriculture Execution Trace Service (Phase 10)
 */

import { AgricultureExecutionTrace, AgricultureExecutionStep } from '@mizan/shared';

export class AgricultureExecutionTraceService {
  private steps: AgricultureExecutionStep[] = [];
  private startTime = new Date().toISOString();

  public addStep(stepName: string, action: string, result: string, appliedRuleId?: string): void {
    this.steps.push({
      sequence: this.steps.length + 1,
      stepName,
      action,
      result,
      appliedRuleId,
    });
  }

  public finalizeTrace(calculationId: string, assetInstanceId: string): AgricultureExecutionTrace {
    return {
      traceId: `TRACE-AGRI-${Date.now()}`,
      calculationId,
      assetInstanceId,
      steps: [...this.steps],
      startedAt: this.startTime,
      completedAt: new Date().toISOString(),
    };
  }
}
