/**
 * MIZAN — Permanent Rule Identifier Standard
 *
 * Format: <MODULE>-<RULE_TYPE>-<SUBJECT>-<CONTEXT>-<SEQUENCE>
 * Example: MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001
 *
 * Rules:
 *  - All uppercase
 *  - Only A-Z, 0-9, underscore segments separated by hyphens
 *  - Exactly 5 dash-separated segments
 *  - Sequence is zero-padded 3-digit number (001–999)
 *  - MODULE must be MIRATH or ZAKAT or SHARED or SYS
 */

export const RULE_ID_REGEX =
  /^(MIRATH|ZAKAT|SHARED|SYS)-([A-Z][A-Z0-9_]*)-([A-Z][A-Z0-9_]*)-([A-Z][A-Z0-9_]*)-([0-9]{3})$/;

export type RuleModule = 'MIRATH' | 'ZAKAT' | 'SHARED' | 'SYS';

export interface ParsedRuleId {
  module: RuleModule;
  ruleType: string;
  subject: string;
  context: string;
  sequence: string;
}

/**
 * Validates a rule ID against the permanent identifier standard.
 * @throws Error with code INVALID_RULE_ID if the format is wrong.
 */
export function validateRuleId(id: string): void {
  if (!RULE_ID_REGEX.test(id)) {
    throw new Error(
      `INVALID_RULE_ID: "${id}" does not match the MIZAN permanent rule identifier format. ` +
      `Expected: <MODULE>-<RULE_TYPE>-<SUBJECT>-<CONTEXT>-<NNN> ` +
      `(e.g. MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001).`
    );
  }
}

/**
 * Parses a validated rule ID into its constituent segments.
 * Throws INVALID_RULE_ID if the format is wrong.
 */
export function parseRuleId(id: string): ParsedRuleId {
  validateRuleId(id);
  const [module, ruleType, subject, context, sequence] = id.split('-') as [
    RuleModule, string, string, string, string
  ];
  return { module, ruleType, subject, context, sequence };
}

/**
 * Constructs a rule ID from its constituent segments.
 * Validates the result before returning.
 */
export function buildRuleId(
  module: RuleModule,
  ruleType: string,
  subject: string,
  context: string,
  sequence: number,
): string {
  const id = [
    module,
    ruleType.toUpperCase(),
    subject.toUpperCase(),
    context.toUpperCase(),
    String(sequence).padStart(3, '0'),
  ].join('-');
  validateRuleId(id);
  return id;
}
