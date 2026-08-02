/**
 * MIZAN — Canonical Rule Condition Evaluator
 *
 * Pure, deterministic evaluator for the declarative condition language.
 * Takes a condition tree and a canonical facts object, returns a boolean.
 *
 * INVARIANTS:
 *  - No side effects
 *  - No external calls
 *  - No exception-based control flow (returns false on unknown path, logs error)
 *  - Supports full trace output for audit
 */

import {
  Condition, ConditionLeaf, ConditionGroup,
  ConditionEvaluationResult, ConditionTraceEntry, ConditionOperator,
} from '../types/rule-condition.types';

// ─── Dot-path resolver ────────────────────────────────────────────────────────

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// ─── Leaf Evaluator ───────────────────────────────────────────────────────────

function evaluateLeaf(
  leaf: ConditionLeaf,
  facts: Record<string, unknown>,
  trace: ConditionTraceEntry[],
): boolean {
  const actualValue = resolvePath(facts, leaf.factsPath);
  const entry: ConditionTraceEntry = {
    conditionType: 'LEAF',
    factsPath: leaf.factsPath,
    operator: leaf.operator,
    expectedValue: leaf.value,
    actualValue,
    result: false,
    description: leaf.description,
  };

  let result = false;
  const op: ConditionOperator = leaf.operator;
  const expected = leaf.value;

  switch (op) {
    case 'EXISTS':
      result = actualValue !== undefined && actualValue !== null;
      break;
    case 'NOT_EXISTS':
      result = actualValue === undefined || actualValue === null;
      break;
    case 'IS_TRUE':
      result = actualValue === true;
      break;
    case 'IS_FALSE':
      result = actualValue === false;
      break;
    case 'EQUALS':
      result = actualValue === expected;
      break;
    case 'NOT_EQUALS':
      result = actualValue !== expected;
      break;
    case 'GREATER_THAN':
      result = typeof actualValue === 'number' && typeof expected === 'number' && actualValue > expected;
      break;
    case 'GREATER_THAN_OR_EQUAL':
      result = typeof actualValue === 'number' && typeof expected === 'number' && actualValue >= expected;
      break;
    case 'LESS_THAN':
      result = typeof actualValue === 'number' && typeof expected === 'number' && actualValue < expected;
      break;
    case 'LESS_THAN_OR_EQUAL':
      result = typeof actualValue === 'number' && typeof expected === 'number' && actualValue <= expected;
      break;
    case 'IN':
      result = Array.isArray(expected) && expected.includes(actualValue as string | number);
      break;
    case 'NOT_IN':
      result = Array.isArray(expected) && !expected.includes(actualValue as string | number);
      break;
    case 'CONTAINS':
      result = Array.isArray(actualValue) && actualValue.includes(expected as string | number);
      break;
    case 'DOES_NOT_CONTAIN':
      result = Array.isArray(actualValue) && !actualValue.includes(expected as string | number);
      break;
    case 'BETWEEN_INCLUSIVE':
      if (Array.isArray(expected) && expected.length === 2) {
        const [lo, hi] = expected as [number, number];
        result = typeof actualValue === 'number' && actualValue >= lo && actualValue <= hi;
      }
      break;
    case 'MATCHES_ENUM':
      result = typeof expected === 'string' && actualValue === expected;
      break;
    default:
      result = false;
  }

  entry.result = result;
  trace.push(entry);
  return result;
}

// ─── Group Evaluator ─────────────────────────────────────────────────────────

function evaluateGroup(
  group: ConditionGroup,
  facts: Record<string, unknown>,
  trace: ConditionTraceEntry[],
): boolean {
  const childTrace: ConditionTraceEntry[] = [];
  let result: boolean;

  switch (group.operator) {
    case 'ALL':
      result = group.conditions.every(c => evaluateConditionNode(c, facts, childTrace));
      break;
    case 'ANY':
      result = group.conditions.some(c => evaluateConditionNode(c, facts, childTrace));
      break;
    case 'NOT':
      if (group.conditions.length !== 1) {
        result = false;
      } else {
        result = !evaluateConditionNode(group.conditions[0], facts, childTrace);
      }
      break;
    default:
      result = false;
  }

  trace.push({
    conditionType: 'GROUP',
    operator: group.operator,
    result,
    description: group.description,
  });
  trace.push(...childTrace);
  return result;
}

// ─── Main dispatcher ─────────────────────────────────────────────────────────

function evaluateConditionNode(
  condition: Condition,
  facts: Record<string, unknown>,
  trace: ConditionTraceEntry[],
): boolean {
  if (condition.type === 'LEAF') return evaluateLeaf(condition, facts, trace);
  if (condition.type === 'GROUP') return evaluateGroup(condition, facts, trace);
  return false;
}

/**
 * Evaluates a condition tree against a canonical facts object.
 * Returns { matched, trace } — never throws.
 */
export function evaluateCondition(
  condition: Condition,
  facts: Record<string, unknown>,
): ConditionEvaluationResult {
  const trace: ConditionTraceEntry[] = [];
  let matched = false;
  try {
    matched = evaluateConditionNode(condition, facts, trace);
  } catch (err) {
    trace.push({
      conditionType: 'LEAF',
      result: false,
      description: `EVALUATOR_ERROR: ${err instanceof Error ? err.message : String(err)}`,
    });
    matched = false;
  }
  return { matched, trace };
}
