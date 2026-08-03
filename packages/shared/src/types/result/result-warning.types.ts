/**
 * MIZAN — Warning Contract (Phase 13)
 * Non-fatal calculation warnings.
 */

export type WarningSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
export type WarningScope = 'CALCULATION' | 'RESULT_ITEM' | 'INPUT' | 'REPORT' | 'CONVERSION';

export interface CalculationWarning {
  warningId: string;
  warningCode: string;
  severity: WarningSeverity;
  scope: WarningScope;
  subjectId?: string | null;
  explanationId?: string | null;
  details?: Record<string, unknown>;
  requiresAcknowledgement: boolean;
}
