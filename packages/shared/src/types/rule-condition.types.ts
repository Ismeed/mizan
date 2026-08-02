/**
 * MIZAN — Declarative Rule Condition Language
 *
 * All rule conditions are purely declarative JSON structures.
 * No executable code is permitted inside conditions.
 * The ConditionEvaluator interprets these structures deterministically.
 */

export type ConditionOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'IN'
  | 'NOT_IN'
  | 'EXISTS'
  | 'NOT_EXISTS'
  | 'IS_TRUE'
  | 'IS_FALSE'
  | 'CONTAINS'
  | 'DOES_NOT_CONTAIN'
  | 'BETWEEN_INCLUSIVE'
  | 'MATCHES_ENUM';

export type LogicalOperator = 'ALL' | 'ANY' | 'NOT';

/**
 * A single atomic condition leaf.
 * The `factsPath` must be a key from CONDITION_PATH_REGISTRY.
 */
export interface ConditionLeaf {
  type: 'LEAF';
  /** Dot-separated path into the canonical facts object, e.g. "heirs.SON.count" */
  factsPath: string;
  operator: ConditionOperator;
  /**
   * The comparison value. Must be a primitive or array of primitives.
   * For BETWEEN_INCLUSIVE: [lowerBound, upperBound].
   * For EXISTS/NOT_EXISTS/IS_TRUE/IS_FALSE: omit this field.
   */
  value?: string | number | boolean | Array<string | number>;
  /** Optional human-readable explanation of what this condition checks */
  description?: string;
}

/** A group that combines multiple conditions with a logical operator */
export interface ConditionGroup {
  type: 'GROUP';
  operator: LogicalOperator;
  conditions: Array<ConditionLeaf | ConditionGroup>;
  /** Optional human-readable explanation of the group's purpose */
  description?: string;
}

export type Condition = ConditionLeaf | ConditionGroup;

/** Result of evaluating a condition tree */
export interface ConditionEvaluationResult {
  matched: boolean;
  /** Human-readable trace of what was checked and why */
  trace: ConditionTraceEntry[];
}

export interface ConditionTraceEntry {
  conditionType: 'LEAF' | 'GROUP';
  factsPath?: string;
  operator?: ConditionOperator | LogicalOperator;
  expectedValue?: unknown;
  actualValue?: unknown;
  result: boolean;
  description?: string;
}
