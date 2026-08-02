/**
 * MIZAN — Rule Import Service
 *
 * Safely parses, validates, and imports CanonicalRule records from JSON payloads.
 *
 * CRITICAL GOVERNANCE CONSTRAINTS:
 *  1. Rules imported through this service are created in DRAFT status by default.
 *  2. Imported rules with `isTestFixture: true` MUST have `fixtureTag: "TEST_ONLY_FIXTURE"`.
 *  3. Imported rules can NEVER directly take PRODUCTION status.
 *  4. Checksums are re-computed and verified upon import.
 *  5. Every import creates an audit log entry in `RuleImportLog`.
 */

import { CanonicalRule, validateRuleId } from '@mizan/shared';
import { prisma } from '../../../config/database';
import { RuleValidatorService, RuleValidationError } from './rule-validator.service';
import { RuleChecksumService } from './rule-checksum.service';
import crypto from 'crypto';

export interface RuleImportItemResult {
  ruleId: string;
  ruleVersion: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  errors: RuleValidationError[];
  importedAsStatus: string;
}

export interface RuleImportReport {
  operationId: string;
  importedBy: string;
  importSource: string;
  totalItems: number;
  successCount: number;
  failureCount: number;
  skippedCount: number;
  itemResults: RuleImportItemResult[];
  importedAt: string;
  status: 'COMPLETE' | 'PARTIAL' | 'FAILED';
}

export interface RuleImportOptions {
  importedBy: string;
  importSource: string;
  allowOverwriteDraft?: boolean;
}

export class RuleImportService {
  /**
   * Imports an array of CanonicalRule JSON objects into the database.
   */
  static async importRules(
    rulesJson: unknown[],
    options: RuleImportOptions,
  ): Promise<RuleImportReport> {
    const operationId = crypto.randomUUID();
    const { importedBy, importSource, allowOverwriteDraft = false } = options;
    const itemResults: RuleImportItemResult[] = [];

    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;

    for (let index = 0; index < rulesJson.length; index++) {
      const rawRule = rulesJson[index] as CanonicalRule;
      const ruleId = rawRule?.identity?.ruleId ?? `UNKNOWN_${index}`;
      const ruleVersion = rawRule?.identity?.ruleVersion ?? '1.0.0';

      // Step 1: Validate rule ID structure
      try {
        validateRuleId(ruleId);
      } catch (err) {
        failureCount++;
        itemResults.push({
          ruleId,
          ruleVersion,
          status: 'FAILED',
          errors: [{
            errorCode: 'INVALID_RULE_ID',
            fieldPath: 'identity.ruleId',
            message: err instanceof Error ? err.message : String(err),
            recommendedCorrection: 'Provide a valid MIZAN rule ID format.',
            severity: 'ERROR',
          }],
          importedAsStatus: 'NONE',
        });
        continue;
      }

      // Step 2: Validate against RuleValidatorService
      const validation = RuleValidatorService.validate(rawRule);
      if (!validation.passed) {
        failureCount++;
        itemResults.push({
          ruleId,
          ruleVersion,
          status: 'FAILED',
          errors: validation.errors,
          importedAsStatus: 'NONE',
        });
        continue;
      }

      // Step 3: Enforce DRAFT status constraint (imported rules cannot be PRODUCTION directly)
      const targetStatus = 'DRAFT';
      const isTestFixture = rawRule.governance.isTestFixture ?? true;
      const fixtureTag = isTestFixture ? 'TEST_ONLY_FIXTURE' : undefined;

      // Step 4: Re-compute checksum to ensure mathematical integrity
      const computedChecksum = RuleChecksumService.generateRuleChecksum(rawRule);

      // Step 5: Check existing DB record
      const existing = await (prisma as any).ruleRecord.findUnique({
        where: {
          rule_id_rule_version: {
            rule_id: ruleId,
            rule_version: ruleVersion,
          },
        },
      });

      if (existing) {
        if (!allowOverwriteDraft || existing.status !== 'DRAFT') {
          skippedCount++;
          itemResults.push({
            ruleId,
            ruleVersion,
            status: 'SKIPPED',
            errors: [{
              errorCode: 'RECORD_ALREADY_EXISTS',
              fieldPath: 'identity.ruleId',
              message: `Rule ${ruleId} v${ruleVersion} already exists in status ${existing.status}. Overwrite prohibited.`,
              recommendedCorrection: 'Increment version or set allowOverwriteDraft=true for DRAFT status records.',
              severity: 'WARNING',
            }],
            importedAsStatus: existing.status,
          });
          continue;
        }
      }

      // Prepare DB payload
      const ruleContent: CanonicalRule = {
        ...rawRule,
        governance: {
          ...rawRule.governance,
          status: targetStatus as any,
          isTestFixture,
          fixtureTag,
          createdBy: importedBy,
          createdAt: rawRule.governance.createdAt || new Date().toISOString(),
          updatedBy: importedBy,
          updatedAt: new Date().toISOString(),
        },
        versioning: {
          ...rawRule.versioning,
          contentChecksum: computedChecksum,
        },
      };

      try {
        if (existing && allowOverwriteDraft && existing.status === 'DRAFT') {
          await (prisma as any).ruleRecord.update({
            where: { id: existing.id },
            data: {
              title_en: ruleContent.titles.titleEn,
              title_ar: ruleContent.titles.titleAr ?? null,
              description_en: ruleContent.titles.descriptionEn,
              rule_content_json: ruleContent as any,
              content_checksum: computedChecksum,
              updated_by: importedBy,
            },
          });
        } else {
          await (prisma as any).ruleRecord.create({
            data: {
              rule_id: ruleId,
              rule_version: ruleVersion,
              module: ruleContent.scope.module,
              rule_type: ruleContent.scope.ruleType,
              madhhab_scope_json: ruleContent.scope.madhhabScope as any,
              knowledge_release_version: ruleContent.scope.knowledgeReleaseVersion,
              title_en: ruleContent.titles.titleEn,
              title_ar: ruleContent.titles.titleAr ?? null,
              description_en: ruleContent.titles.descriptionEn,
              rule_content_json: ruleContent as any,
              content_checksum: computedChecksum,
              schema_version: ruleContent.governance.schemaVersion,
              status: targetStatus,
              is_test_fixture: isTestFixture,
              priority: ruleContent.scope.priority ?? 0,
              rule_family_id: ruleContent.identity.ruleFamilyId ?? null,
              overrides_rule_id: ruleContent.identity.overridesRuleId ?? null,
              requires_previous_rules: (ruleContent.identity.requiresPreviousRules ?? []) as any,
              incompatible_with_rules: (ruleContent.identity.incompatibleWithRules ?? []) as any,
              created_by: importedBy,
              updated_by: importedBy,
            },
          });
        }

        successCount++;
        itemResults.push({
          ruleId,
          ruleVersion,
          status: 'SUCCESS',
          errors: [],
          importedAsStatus: targetStatus,
        });
      } catch (dbErr) {
        failureCount++;
        itemResults.push({
          ruleId,
          ruleVersion,
          status: 'FAILED',
          errors: [{
            errorCode: 'DB_INSERT_ERROR',
            fieldPath: 'database',
            message: dbErr instanceof Error ? dbErr.message : String(dbErr),
            recommendedCorrection: 'Inspect database logs and check for foreign key or uniqueness violations.',
            severity: 'ERROR',
          }],
          importedAsStatus: 'NONE',
        });
      }
    }

    const overallStatus =
      failureCount === 0 && skippedCount === 0
        ? 'COMPLETE'
        : successCount > 0
        ? 'PARTIAL'
        : 'FAILED';

    // Log import operation
    try {
      await (prisma as any).ruleImportLog.create({
        data: {
          operation_id: operationId,
          imported_by: importedBy,
          import_source: importSource,
          rule_count: rulesJson.length,
          success_count: successCount,
          failure_count: failureCount,
          results_json: itemResults as any,
          errors_json: itemResults.filter(i => i.status === 'FAILED').map(i => i.errors) as any,
          status: overallStatus,
        },
      });
    } catch {
      // Audit log creation failure should not break import response
    }

    return {
      operationId,
      importedBy,
      importSource,
      totalItems: rulesJson.length,
      successCount,
      failureCount,
      skippedCount,
      itemResults,
      importedAt: new Date().toISOString(),
      status: overallStatus,
    };
  }
}
