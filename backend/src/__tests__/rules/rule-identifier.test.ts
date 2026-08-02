import {
  validateRuleId,
  parseRuleId,
  buildRuleId,
  RULE_ID_REGEX,
} from '@mizan/shared';

describe('Permanent Rule Identifier Standard Tests', () => {
  describe('Rule ID Format Regex', () => {
    it('accepts valid rule IDs across all modules', () => {
      expect(RULE_ID_REGEX.test('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001')).toBe(true);
      expect(RULE_ID_REGEX.test('ZAKAT-RATE-STANDARD-ALL-001')).toBe(true);
      expect(RULE_ID_REGEX.test('SHARED-ELIGIBILITY-GENERAL-GLOBAL-099')).toBe(true);
      expect(RULE_ID_REGEX.test('SYS-REVIEW_GATE-SCHOLAR-MANDATORY-001')).toBe(true);
    });

    it('rejects invalid rule IDs', () => {
      expect(RULE_ID_REGEX.test('mirath-fixed_share-spouse-001')).toBe(false); // lowercase
      expect(RULE_ID_REGEX.test('INVALID_MODULE-TYPE-SUBJ-CTX-001')).toBe(false); // unknown module
      expect(RULE_ID_REGEX.test('MIRATH-FIXED_SHARE-SPOUSE-001')).toBe(false); // missing segment (only 4)
      expect(RULE_ID_REGEX.test('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-1')).toBe(false); // unpadded sequence
      expect(RULE_ID_REGEX.test('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-v1.0')).toBe(false); // semver in ID
    });
  });

  describe('validateRuleId()', () => {
    it('does not throw for valid IDs', () => {
      expect(() => validateRuleId('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001')).not.toThrow();
    });

    it('throws INVALID_RULE_ID error for invalid IDs', () => {
      expect(() => validateRuleId('INVALID_ID')).toThrow(/INVALID_RULE_ID/);
    });
  });

  describe('parseRuleId()', () => {
    it('correctly parses a 5-segment rule ID', () => {
      const parsed = parseRuleId('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001');
      expect(parsed).toEqual({
        module: 'MIRATH',
        ruleType: 'FIXED_SHARE',
        subject: 'SPOUSE',
        context: 'NO_CHILDREN',
        sequence: '001',
      });
    });

    it('throws when parsing malformed ID', () => {
      expect(() => parseRuleId('BAD-ID')).toThrow(/INVALID_RULE_ID/);
    });
  });

  describe('buildRuleId()', () => {
    it('constructs and validates a formatted rule ID', () => {
      const id = buildRuleId('ZAKAT', 'rate', 'standard', 'all', 1);
      expect(id).toBe('ZAKAT-RATE-STANDARD-ALL-001');
    });

    it('zero-pads sequence numbers', () => {
      const id = buildRuleId('MIRATH', 'hijab', 'son', 'father', 7);
      expect(id).toBe('MIRATH-HIJAB-SON-FATHER-007');
    });
  });
});
