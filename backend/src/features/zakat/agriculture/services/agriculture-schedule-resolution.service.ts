/**
 * MIZAN — Agriculture Schedule Resolution Service (Phase 10 Orchestrator)
 *
 * Coordinates the 10-step Agriculture Zakat calculation pipeline:
 * 1. Validate produce type
 * 2. Normalize facts & convert units
 * 3. Evaluate eligibility
 * 4. Classify irrigation method
 * 5. Resolve nisab threshold
 * 6. Compare harvest quantity to nisab
 * 7. Aggregate multi-harvest (if applicable)
 * 8. Resolve applicable rate
 * 9. Compute obligatory produce quantity (ExactFraction)
 * 10. Assemble result + attach evidence + trace
 */

import {
  CanonicalAgricultureFacts,
  AgricultureAssetResult,
} from '@mizan/shared';
import { AgricultureFactNormalizationService } from './agriculture-fact-normalization.service';
import { AgricultureEligibilityService } from './agriculture-eligibility.service';
import { AgricultureNisabService } from './agriculture-nisab.service';
import { AgricultureIrrigationService } from './agriculture-irrigation.service';
import { AgricultureRateService } from './agriculture-rate.service';
import { AgricultureObligationService } from './agriculture-obligation.service';
import { AgricultureResultAssemblerService } from './agriculture-result-assembler.service';
import { AgricultureExecutionTraceService } from './agriculture-execution-trace.service';

export interface AgricultureResolutionInput {
  calculationId: string;
  facts: CanonicalAgricultureFacts;
  madhhab: string;
  knowledgeReleaseVersion?: string;
}

export class AgricultureScheduleResolutionService {
  private normalizationService = new AgricultureFactNormalizationService();
  private eligibilityService = new AgricultureEligibilityService();
  private nisabService = new AgricultureNisabService();
  private irrigationService = new AgricultureIrrigationService();
  private rateService = new AgricultureRateService();
  private obligationService = new AgricultureObligationService();
  private resultAssembler = new AgricultureResultAssemblerService();

  public resolveAgriculture(input: AgricultureResolutionInput): {
    result: AgricultureAssetResult;
    trace: ReturnType<AgricultureExecutionTraceService['finalizeTrace']>;
  } {
    const traceService = new AgricultureExecutionTraceService();
    const { calculationId, facts: rawFacts, madhhab, knowledgeReleaseVersion = '1.0.0' } = input;

    // Step 1 & 2: Normalize facts
    traceService.addStep('NORMALIZE_FACTS', 'Validate and parse raw facts', 'SUCCESS');
    const facts = this.normalizationService.normalizeFacts(rawFacts);

    // Step 3: Evaluate eligibility
    traceService.addStep('EVALUATE_ELIGIBILITY', 'Check produce type, ownership, nisab criteria', 'EVALUATED');
    const eligibility = this.eligibilityService.evaluateEligibility(facts, madhhab);

    // Step 4: Classify irrigation method
    traceService.addStep('CLASSIFY_IRRIGATION', 'Determine primary irrigation method and cost status', 'CLASSIFIED');
    const irrigationClass = this.irrigationService.classifyIrrigation(
      facts.irrigation.method,
      facts.irrigation.irrigationCostBorne,
      facts.irrigation.mixedRecord
    );

    // Step 5 & 6: Resolve nisab threshold
    traceService.addStep('RESOLVE_NISAB', 'Look up nisab threshold for produce type', 'RESOLVED');
    const nisabRecord = this.nisabService.resolveNisab(facts.produceTypeId, madhhab);

    // Step 8: Resolve applicable rate
    traceService.addStep('RESOLVE_RATE', 'Look up rate for irrigation classification', 'RESOLVED');
    let rateRecord = this.rateService.resolveRate(irrigationClass.primaryMethod, madhhab);
    let appliedRate = rateRecord?.rate ?? { numerator: 1n, denominator: 10n };

    if (irrigationClass.primaryMethod === 'MIXED' && facts.irrigation.mixedRecord) {
      appliedRate = this.irrigationService.calculateMixedRate(
        facts.irrigation.mixedRecord.rainFedFraction,
        facts.irrigation.mixedRecord.irrigatedFraction
      );
    }

    // Step 9: Compute obligation
    traceService.addStep('COMPUTE_OBLIGATION', 'Multiply harvest quantity by rate as ExactFraction', 'COMPUTED');
    const obligation = this.obligationService.computeObligation(
      facts.produceTypeId,
      facts.harvest.quantity,
      facts.harvest.quantityUnit,
      appliedRate,
      eligibility.isEligible
    );

    // Step 10: Assemble result
    traceService.addStep('ASSEMBLE_RESULT', 'Assemble final result object', 'ASSEMBLED');
    const result = this.resultAssembler.assembleAssetResult(
      facts,
      eligibility,
      nisabRecord,
      rateRecord,
      obligation,
      madhhab,
      knowledgeReleaseVersion
    );

    const trace = traceService.finalizeTrace(calculationId, facts.assetInstanceId);

    return { result, trace };
  }
}
