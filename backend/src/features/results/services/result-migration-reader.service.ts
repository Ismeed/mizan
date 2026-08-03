/**
 * MIZAN — Result Migration Reader Service (Phase 13)
 * Wraps legacy MirathResult and ZakatResult structures in a standard envelope projection
 * without mutating historical records.
 */

import type { CalculationResultEnvelope, MirathResult, ZakatResult } from '@mizan/shared';
import { MirathResultAssemblerService } from './mirath-result-assembler.service';
import { ZakatResultAssemblerService } from './zakat-result-assembler.service';
import { ResultIntegrityService } from './result-integrity.service';
import crypto from 'crypto';

export class ResultMigrationReaderService {
  static projectLegacyMirath(
    calculationId: string,
    legacyResult: MirathResult,
    netEstateAmount: number,
    currencyCode: string = 'USD'
  ): CalculationResultEnvelope {
    const assembled = MirathResultAssemblerService.assembleMirathResult({
      mirathResult: legacyResult,
      netEstateAmount,
      currencyCode,
      calculationId,
    });

    const resultId = `legacy_res_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const core = {
      resultId,
      calculationId,
      resultVersion: '1.0.0',
      resultSchemaVersion: 'legacy-v0',
      module: 'MIRATH' as const,
      status: 'COMPLETED' as const,
      profile: {
        calculationProfileId: `legacy_profile_${calculationId}`,
        module: 'MIRATH' as const,
        madhhab: legacyResult.madhhab ?? 'HANAFI',
        language: { languageTag: 'en', locale: 'en-US', direction: 'LTR' as const },
        currency: {
          preferredCurrencyCode: currencyCode,
          calculationCurrencyCode: currencyCode,
          reportCurrencyCode: currencyCode,
          currencyContextId: `legacy_curr_${calculationId}`,
        },
        region: { countryCode: 'NG' },
        capturedAt: now,
        isImmutable: true,
      },
      context: {
        knowledgeReleaseVersion: '1.0.0-legacy',
        ruleEngineVersion: '1.0.0-legacy',
        registryVersions: {
          evidenceRegistryVersion: '1.0.0',
          explanationRegistryVersion: '1.0.0',
          currencyRegistryVersion: '1.0.0',
        },
        calculationStartedAt: now,
        calculationCompletedAt: now,
        executionEnvironment: {
          engineMode: 'PRODUCTION' as const,
          region: 'us-central1',
          serviceVersion: '1.0.0',
        },
      },
      input: {
        inputSnapshotId: `snapshot_input_${calculationId}`,
        canonicalFactsSnapshotId: `snapshot_facts_${calculationId}`,
        rawInputChecksum: 'legacy_checksum',
        canonicalFactsChecksum: 'legacy_checksum',
        inputSchemaVersion: 'legacy-v0',
        validation: { status: 'VALID' as const, validationResultIds: [] },
      },
      summary: {
        resultItemCount: assembled.resultItems.length,
        completedItemCount: assembled.resultItems.length,
        warningItemCount: 0,
        reviewRequiredItemCount: 0,
        unsupportedItemCount: 0,
        errorItemCount: 0,
        hasMonetaryResults: true,
        hasPhysicalObligations: false,
        hasBlockedHeirs: assembled.resultItems.some((i) => i.status === 'BLOCKED'),
        hasPartialResults: false,
        decisionCodes: assembled.resultItems.map((i) => i.decision.decisionCode),
      },
      moduleResult: assembled.moduleResult,
      resultItems: assembled.resultItems,
      warnings: [],
      errors: [],
      review: { required: false, items: [] },
      presentation: {
        defaultView: 'SUMMARY' as const,
        sections: [{ sectionCode: 'MAIN', displayOrder: 10, resultItemIds: assembled.resultItems.map((i) => i.resultItemId) }],
        availableViews: ['SUMMARY' as const, 'DETAILED' as const],
        hasClickableEvidence: true,
        hasAIExplanationActions: true,
      },
      audit: {
        createdAt: now,
        createdByService: 'MIGRATION_READER',
        calculationRequestId: `req_${calculationId}`,
        ruleExecutionTraceIds: [],
        resultAssemblyTraceId: `assembly_${calculationId}`,
        reviewEvents: [],
        securityContext: {},
      },
    };

    const checksum = ResultIntegrityService.generateChecksum(core);

    return {
      ...core,
      integrity: {
        resultChecksum: checksum,
        resultSnapshotId: `snapshot_${resultId}`,
        inputChecksum: 'legacy_checksum',
        profileChecksum: 'legacy_checksum',
        canonicalFactsChecksum: 'legacy_checksum',
        appliedRulePackageChecksum: 'package_legacy',
        evidencePackageChecksum: 'package_legacy',
        explanationPackageChecksum: 'package_legacy',
        isImmutable: true,
        verifiedAt: now,
      },
    };
  }
}
