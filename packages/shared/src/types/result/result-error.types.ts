/**
 * MIZAN — Error Contract (Phase 13)
 * Standard calculation errors.
 */

export type ErrorCategory =
  | 'VALIDATION'
  | 'RULE_CONFLICT'
  | 'INTEGRITY'
  | 'UNSUPPORTED'
  | 'AUTHORIZATION'
  | 'DATA'
  | 'TECHNICAL';

export type ErrorSeverity = 'ERROR' | 'CRITICAL';
export type ErrorScope = 'CALCULATION' | 'RESULT_ITEM' | 'RULE' | 'INPUT' | 'EVIDENCE' | 'CURRENCY' | 'REPORT';

export interface CalculationError {
  errorId: string;
  errorCode: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  scope: ErrorScope;
  fieldPath?: string | null;
  subjectId?: string | null;
  ruleId?: string | null;
  messageKey: string;
  explanationId?: string | null;
  details?: Record<string, unknown>;
  retryable: boolean;
  reviewRequired: boolean;
}
