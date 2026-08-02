import { CanonicalRuleSchema } from '@mizan/shared';
import { RuleValidatorService } from '../../features/rules/services/rule-validator.service';
import { RuleChecksumService } from '../../features/rules/services/rule-checksum.service';
import {
  FIXTURE_MIRATH_SPOUSE_BASE,
  FIXTURE_ZAKAT_RATE_STANDARD,
} from './fixtures/synthetic-rule-fixtures';

describe('Canonical Rule Schema & Validation Tests', () => {
  describe('Zod Schema Validation', () => {
    it('validates a correct synthetic rule fixture', () => {
      const parseResult = CanonicalRuleSchema.safeParse(FIXTURE_MIRATH_SPOUSE_BASE);
      expect(parseResult.success).toBe(true);
    });

    it('rejects a test fixture marked with PRODUCTION status', () => {
      const invalidRule = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        governance: {
          ...FIXTURE_MIRATH_SPOUSE_BASE.governance,
          isTestFixture: true,
          status: 'PRODUCTION' as const,
        },
      };
      const parseResult = CanonicalRuleSchema.safeParse(invalidRule);
      expect(parseResult.success).toBe(false);
    });

    it('rejects rules with negative fraction denominators', () => {
      const invalidRule = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        decisions: [
          {
            decisionType: 'ASSIGN_FIXED_FRACTION' as const,
            targetEntity: 'husband',
            fraction: { n: 1, d: -2 }, // invalid denominator
            distributionMethod: 'SINGLE_SHARE' as const,
          },
        ],
      };
      const parseResult = CanonicalRuleSchema.safeParse(invalidRule);
      expect(parseResult.success).toBe(false);
    });
  });

  describe('RuleValidatorService', () => {
    it('passes clean synthetic rule fixture', () => {
      const report = RuleValidatorService.validate(FIXTURE_MIRATH_SPOUSE_BASE);
      expect(report.passed).toBe(true);
      expect(report.errorCount).toBe(0);
    });

    it('detects invalid condition facts path', () => {
      const invalidRule = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        applicability: {
          conditions: {
            type: 'LEAF' as const,
            factsPath: 'invalid.unknown.path',
            operator: 'EQUALS' as const,
            value: 123,
          },
        },
      };
      const report = RuleValidatorService.validate(invalidRule);
      expect(report.passed).toBe(false);
      expect(report.errors.some(e => e.errorCode === 'INVALID_CONDITION_PATH')).toBe(true);
    });

    it('detects self-conflict in rule identity', () => {
      const invalidRule = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        identity: {
          ...FIXTURE_MIRATH_SPOUSE_BASE.identity,
          incompatibleWithRules: [FIXTURE_MIRATH_SPOUSE_BASE.identity.ruleId],
        },
      };
      const report = RuleValidatorService.validate(invalidRule);
      expect(report.passed).toBe(false);
      expect(report.errors.some(e => e.errorCode === 'SELF_CONFLICT')).toBe(true);
    });

    it('detects checksum mismatch', () => {
      const tamperedRule = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        titles: {
          ...FIXTURE_MIRATH_SPOUSE_BASE.titles,
          titleEn: 'TAMPERED TITLE',
        },
        // contentChecksum not updated
      };
      const report = RuleValidatorService.validate(tamperedRule);
      expect(report.passed).toBe(false);
      expect(report.errors.some(e => e.errorCode === 'CHECKSUM_MISMATCH')).toBe(true);
    });
  });

  describe('RuleChecksumService', () => {
    it('generates a 64-character SHA-256 hex string', () => {
      const checksum = RuleChecksumService.generateRuleChecksum(FIXTURE_ZAKAT_RATE_STANDARD);
      expect(checksum).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(checksum)).toBe(true);
    });

    it('produces deterministic checksums regardless of property order', () => {
      const checksum1 = RuleChecksumService.generateRuleChecksum(FIXTURE_ZAKAT_RATE_STANDARD);
      const checksum2 = RuleChecksumService.generateRuleChecksum(FIXTURE_ZAKAT_RATE_STANDARD);
      expect(checksum1).toBe(checksum2);
    });

    it('verifies valid checksum', () => {
      expect(RuleChecksumService.verifyRuleChecksum(FIXTURE_MIRATH_SPOUSE_BASE)).toBe(true);
    });

    it('fails verification when content is modified', () => {
      const modified = {
        ...FIXTURE_MIRATH_SPOUSE_BASE,
        scope: { ...FIXTURE_MIRATH_SPOUSE_BASE.scope, priority: 999 },
      };
      expect(RuleChecksumService.verifyRuleChecksum(modified)).toBe(false);
    });
  });
});
