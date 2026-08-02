/**
 * MIZAN — Rule Validator Service
 *
 * Validates a CanonicalRule against all 29 error categories.
 * Used before any rule enters the DRAFT → PRODUCTION lifecycle.
 *
 * CRITICAL: This service NEVER accepts or generates Islamic rulings.
 * It only validates structural and governance correctness.
 */

import { CanonicalRule, validateRuleId, isValidConditionPath } from '@mizan/shared';
import { CanonicalRuleSchema } from '@mizan/shared';
import { RuleChecksumService } from './rule-checksum.service';

export interface RuleValidationError {
  errorCode: string;
  fieldPath: string;
  message: string;
  recommendedCorrection: string;
  severity: 'ERROR' | 'WARNING';
}

export interface RuleValidationReport {
  ruleId: string;
  ruleVersion: string;
  passed: boolean;
  errorCount: number;
  warningCount: number;
  errors: RuleValidationError[];
  validatedAt: string;
  schemaVersion: string;
}

export class RuleValidatorService {
  static readonly SCHEMA_VERSION = '1.0.0';

  /**
   * Runs all validation checks against a CanonicalRule object.
   */
  static validate(rule: CanonicalRule): RuleValidationReport {
    const errors: RuleValidationError[] = [];

    // 1. Zod schema validation
    const zodResult = CanonicalRuleSchema.safeParse(rule);
    if (!zodResult.success) {
      for (const issue of zodResult.error.issues) {
        errors.push({
          errorCode: 'SCHEMA_VALIDATION_FAILED',
          fieldPath: issue.path.join('.'),
          message: issue.message,
          recommendedCorrection: 'Correct the field value to match the canonical rule schema.',
          severity: 'ERROR',
        });
      }
    }

    // 2. Rule ID format validation
    try {
      validateRuleId(rule.identity?.ruleId ?? '');
    } catch (e) {
      errors.push({
        errorCode: 'INVALID_RULE_ID',
        fieldPath: 'identity.ruleId',
        message: e instanceof Error ? e.message : 'Invalid rule ID format.',
        recommendedCorrection: 'Use format: MODULE-TYPE-SUBJECT-CONTEXT-NNN (e.g. MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001)',
        severity: 'ERROR',
      });
    }

    // 3. Self-conflict check
    if (rule.identity?.incompatibleWithRules?.includes(rule.identity.ruleId)) {
      errors.push({
        errorCode: 'SELF_CONFLICT',
        fieldPath: 'identity.incompatibleWithRules',
        message: 'A rule cannot declare itself as incompatible.',
        recommendedCorrection: 'Remove the rule\'s own ID from incompatibleWithRules.',
        severity: 'ERROR',
      });
    }

    // 4. Self-dependency check
    if (rule.identity?.requiresPreviousRules?.includes(rule.identity.ruleId)) {
      errors.push({
        errorCode: 'SELF_DEPENDENCY',
        fieldPath: 'identity.requiresPreviousRules',
        message: 'A rule cannot depend on itself.',
        recommendedCorrection: 'Remove the rule\'s own ID from requiresPreviousRules.',
        severity: 'ERROR',
      });
    }

    // 5. Test fixture cannot be PRODUCTION
    if (rule.governance?.isTestFixture && rule.governance.status === 'PRODUCTION') {
      errors.push({
        errorCode: 'TEST_FIXTURE_PRODUCTION_STATUS',
        fieldPath: 'governance.status',
        message: 'A test fixture rule cannot have PRODUCTION status.',
        recommendedCorrection: 'Set isTestFixture to false and complete full governance review, or change status to DRAFT.',
        severity: 'ERROR',
      });
    }

    // 6. Test fixture must have fixtureTag
    if (rule.governance?.isTestFixture && rule.governance.fixtureTag !== 'TEST_ONLY_FIXTURE') {
      errors.push({
        errorCode: 'TEST_FIXTURE_MISSING_TAG',
        fieldPath: 'governance.fixtureTag',
        message: 'Test fixtures must have fixtureTag = "TEST_ONLY_FIXTURE".',
        recommendedCorrection: 'Add fixtureTag: "TEST_ONLY_FIXTURE" to governance.',
        severity: 'ERROR',
      });
    }

    // 7. Validate all condition fact paths
    const conditionPathErrors = RuleValidatorService.collectConditionPathErrors(
      rule.applicability?.conditions,
      'applicability.conditions'
    );
    errors.push(...conditionPathErrors);

    // 8. At least one decision required
    if (!rule.decisions || rule.decisions.length === 0) {
      errors.push({
        errorCode: 'NO_DECISIONS',
        fieldPath: 'decisions',
        message: 'Every rule must have at least one typed decision.',
        recommendedCorrection: 'Add at least one decision to the decisions array.',
        severity: 'ERROR',
      });
    }

    // 9. Checksum verification (if already set)
    if (rule.versioning?.contentChecksum && rule.versioning.contentChecksum.length === 64) {
      const checksumValid = RuleChecksumService.verifyRuleChecksum(rule);
      if (!checksumValid) {
        errors.push({
          errorCode: 'CHECKSUM_MISMATCH',
          fieldPath: 'versioning.contentChecksum',
          message: 'The contentChecksum does not match the computed checksum of the rule content.',
          recommendedCorrection: 'Recompute the checksum using RuleChecksumService.generateRuleChecksum().',
          severity: 'ERROR',
        });
      }
    }

    // 10. Empty madhhab scope
    if (!rule.scope?.madhhabScope || rule.scope.madhhabScope.length === 0) {
      errors.push({
        errorCode: 'EMPTY_MADHHAB_SCOPE',
        fieldPath: 'scope.madhhabScope',
        message: 'madhhabScope must contain at least one value.',
        recommendedCorrection: 'Specify at least one madhhab or use "ALL_SCHOOLS".',
        severity: 'ERROR',
      });
    }

    // 11. Missing English title/description
    if (!rule.titles?.titleEn?.trim()) {
      errors.push({
        errorCode: 'MISSING_TITLE_EN',
        fieldPath: 'titles.titleEn',
        message: 'English title is required.',
        recommendedCorrection: 'Add a clear English title describing what this rule does.',
        severity: 'ERROR',
      });
    }
    if (!rule.titles?.descriptionEn?.trim()) {
      errors.push({
        errorCode: 'MISSING_DESCRIPTION_EN',
        fieldPath: 'titles.descriptionEn',
        message: 'English description is required.',
        recommendedCorrection: 'Add a detailed English description of the rule\'s purpose and basis.',
        severity: 'ERROR',
      });
    }

    // 12. Knowledge release version required
    if (!rule.scope?.knowledgeReleaseVersion?.trim()) {
      errors.push({
        errorCode: 'MISSING_KNOWLEDGE_RELEASE_VERSION',
        fieldPath: 'scope.knowledgeReleaseVersion',
        message: 'knowledgeReleaseVersion is required.',
        recommendedCorrection: 'Specify the target knowledge release version (e.g. "1.0.0").',
        severity: 'ERROR',
      });
    }

    // 13. WARNING: No evidence refs
    if (!rule.evidenceRefs || rule.evidenceRefs.length === 0) {
      errors.push({
        errorCode: 'NO_EVIDENCE_REFS',
        fieldPath: 'evidenceRefs',
        message: 'This rule has no evidence references. Scholar review will require at least one.',
        recommendedCorrection: 'Add at least one evidence reference linking to a verified source.',
        severity: 'WARNING',
      });
    }

    const errorCount = errors.filter(e => e.severity === 'ERROR').length;
    const warningCount = errors.filter(e => e.severity === 'WARNING').length;

    return {
      ruleId: rule.identity?.ruleId ?? 'UNKNOWN',
      ruleVersion: rule.identity?.ruleVersion ?? 'UNKNOWN',
      passed: errorCount === 0,
      errorCount,
      warningCount,
      errors,
      validatedAt: new Date().toISOString(),
      schemaVersion: this.SCHEMA_VERSION,
    };
  }

  /** Recursively collects invalid factsPath references from a condition tree */
  private static collectConditionPathErrors(
    condition: any,
    path: string
  ): RuleValidationError[] {
    const errors: RuleValidationError[] = [];
    if (!condition) return errors;

    if (condition.type === 'LEAF') {
      if (condition.factsPath && !isValidConditionPath(condition.factsPath)) {
        errors.push({
          errorCode: 'INVALID_CONDITION_PATH',
          fieldPath: `${path}.factsPath`,
          message: `"${condition.factsPath}" is not a registered canonical condition path.`,
          recommendedCorrection: 'Use only paths from MIRATH_CONDITION_PATHS or ZAKAT_CONDITION_PATHS.',
          severity: 'ERROR',
        });
      }
    } else if (condition.type === 'GROUP' && Array.isArray(condition.conditions)) {
      condition.conditions.forEach((child: any, i: number) => {
        errors.push(...RuleValidatorService.collectConditionPathErrors(child, `${path}.conditions[${i}]`));
      });
    }

    return errors;
  }
}
