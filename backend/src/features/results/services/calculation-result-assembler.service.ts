/**
 * MIZAN — Calculation Result Assembler Service (Phase 13)
 * Orchestrates full CalculationResultEnvelope assembly for Mirath and Zakat.
 * Never calls AI, never invents missing decisions.
 */

import type {
  CalculationResultEnvelope,
  CalculationProfile,
  MirathResult,
  ZakatResult,
  ResultItem,
  CalculationWarning,
  CalculationError,
  ReviewRequirement,
} from '@mizan/shared';
import { MirathResultAssemblerService } from './mirath-result-assembler.service';
import { ZakatResultAssemblerService } from './zakat-result-assembler.service';
import { CalculationStatusResolutionService } from './calculation-status-resolution.service';
import { ResultIntegrityService } from './result-integrity.service';
import crypto from 'crypto';

export interface AssembleEnvelopeInput {
  calculationId: string;
  module: 'MIRATH' | 'ZAKAT';
  profile: CalculationProfile;
  rawInput: Record<string, unknown>;
  mirathResult?: MirathResult;
  zakatResult?: ZakatResult | any;
  warnings?: CalculationWarning[];
  errors?: CalculationError[];
  review?: ReviewRequirement | null;
}

export class CalculationResultAssemblerService {
  static assembleEnvelope(input: AssembleEnvelopeInput): CalculationResultEnvelope {
    const resultId = `result_${crypto.randomUUID()}`;
    const resultSnapshotId = `snapshot_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    let moduleResult: any;
    let resultItems: ResultItem[] = [];

    if (input.module === 'MIRATH' && input.mirathResult) {
      const currency = input.profile.preferences.currency.code;
      const assembled = MirathResultAssemblerService.assembleMirathResult({
        mirathResult: input.mirathResult,
        netEstateAmount: input.mirathResult.netEstate,
        currencyCode: currency,
        calculationId: input.calculationId,
      });
      moduleResult = assembled.moduleResult;
      resultItems = assembled.resultItems;
    } else if (input.module === 'ZAKAT' && input.zakatResult) {
      const currency = input.profile.preferences.currency.code;
      const assembled = ZakatResultAssemblerService.assembleZakatResult({
        zakatResult: input.zakatResult,
        currencyCode: currency,
        calculationId: input.calculationId,
      });
      moduleResult = assembled.moduleResult;
      resultItems = assembled.resultItems;
    } else {
      throw new Error('INVALID_ASSEMBLY_INPUT: Missing module calculation output');
    }

    const warnings = input.warnings ?? [];
    const errors = input.errors ?? [];
    const review = input.review ?? null;

    const status = CalculationStatusResolutionService.resolveTopLevelStatus({
      resultItems,
      warnings,
      errors,
      review,
    });

    const rawInputChecksum = ResultIntegrityService.generateChecksum(input.rawInput);
    const profileChecksum = ResultIntegrityService.generateChecksum(input.profile);
    const decisionCodes = Array.from(new Set(resultItems.map((i) => i.decision.decisionCode)));

    const summary = {
      resultItemCount: resultItems.length,
      completedItemCount: resultItems.filter((i) => i.status === 'ELIGIBLE' || i.status === 'SHARE_ASSIGNED' || i.status === 'OBLIGATION_DUE').length,
      warningItemCount: warnings.length,
      reviewRequiredItemCount: resultItems.filter((i) => i.status === 'REVIEW_REQUIRED').length,
      unsupportedItemCount: resultItems.filter((i) => i.status === 'UNSUPPORTED').length,
      errorItemCount: errors.length,
      hasMonetaryResults: resultItems.some((i) => i.monetaryValues.length > 0),
      hasPhysicalObligations: resultItems.some((i) => i.itemType === 'LIVESTOCK_OBLIGATION_RESULT' || i.itemType === 'AGRICULTURE_OBLIGATION_RESULT'),
      hasBlockedHeirs: resultItems.some((i) => i.status === 'BLOCKED'),
      hasPartialResults: status === 'PARTIALLY_COMPLETED',
      decisionCodes,
    };

    const reviewSummary = {
      required: review ? review.required : false,
      items: resultItems.filter((i) => i.status === 'REVIEW_REQUIRED').map((i) => ({
        resultItemId: i.resultItemId,
        reasonCode: i.decision.decisionCode,
      })),
    };

    const presentation = {
      defaultView: 'SUMMARY' as const,
      sections: [
        { sectionCode: 'MAIN', displayOrder: 10, resultItemIds: resultItems.map((i) => i.resultItemId) },
      ],
      availableViews: ['SUMMARY' as const, 'DETAILED' as const, 'ADVANCED_AUDIT' as const],
      hasClickableEvidence: true,
      hasAIExplanationActions: true,
    };

    const audit = {
      createdAt: now,
      createdByService: 'MIZAN_RULE_ENGINE',
      calculationRequestId: `req_${crypto.randomUUID()}`,
      ruleExecutionTraceIds: [],
      resultAssemblyTraceId: `assembly_${crypto.randomUUID()}`,
      reviewEvents: [],
      securityContext: {},
    };

    const coreEnvelopePartial = {
      resultId,
      calculationId: input.calculationId,
      resultVersion: '1.0.0',
      resultSchemaVersion: '1.0.0',
      module: input.module,
      status,
      profile: {
        calculationProfileId: input.profile.calculationProfileId,
        module: input.module,
        madhhab: input.profile.preferences.madhhab.resolved,
        language: {
          languageTag: input.profile.preferences.language.tag,
          locale: input.profile.preferences.language.locale,
          direction: input.profile.preferences.language.direction,
        },
        currency: {
          preferredCurrencyCode: input.profile.preferences.currency.code,
          calculationCurrencyCode: input.profile.preferences.currency.code,
          reportCurrencyCode: input.profile.preferences.currency.code,
          currencyContextId: (input.profile.preferences.currency as any).currencyContextId ?? `ctx_${input.profile.preferences.currency.code}`,
        },
        region: { countryCode: input.profile.preferences.region.countryCode },
        capturedAt: input.profile.createdAt,
        isImmutable: true,
      },
      context: {
        knowledgeReleaseVersion: input.profile.versions?.knowledgeReleaseVersion ?? '1.0.0',
        ruleEngineVersion: input.profile.versions?.ruleEngineVersion ?? '1.0.0',
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
        inputSnapshotId: `snapshot_input_${input.calculationId}`,
        canonicalFactsSnapshotId: `snapshot_facts_${input.calculationId}`,
        rawInputChecksum,
        canonicalFactsChecksum: rawInputChecksum,
        inputSchemaVersion: '1.0.0',
        validation: { status: 'VALID' as const, validationResultIds: [] },
      },
      summary,
      moduleResult,
      resultItems,
      warnings,
      errors,
      review: reviewSummary,
      presentation,
      audit,
    };

    const resultChecksum = ResultIntegrityService.generateChecksum(coreEnvelopePartial);

    return {
      ...coreEnvelopePartial,
      integrity: {
        resultChecksum,
        resultSnapshotId,
        inputChecksum: rawInputChecksum,
        profileChecksum,
        canonicalFactsChecksum: rawInputChecksum,
        appliedRulePackageChecksum: 'package_rules_1.0.0',
        evidencePackageChecksum: 'package_evidence_1.0.0',
        explanationPackageChecksum: 'package_explanations_1.0.0',
        isImmutable: true,
        verifiedAt: now,
      },
    };
  }
}
