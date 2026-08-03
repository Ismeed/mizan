/**
 * MIZAN — Result Export Service (Phase 13)
 * Formats standard result envelope for structured export or PDF reporting.
 */

import type { CalculationResultEnvelope } from '@mizan/shared';
import { ResultRenderingService } from './result-rendering.service';

export class ResultExportService {
  static exportToJson(envelope: CalculationResultEnvelope): string {
    return JSON.stringify(envelope, null, 2);
  }

  static exportToReportData(envelope: CalculationResultEnvelope, languageTag: string = 'en') {
    const rendered = ResultRenderingService.renderResult(envelope, languageTag);

    return {
      resultId: envelope.resultId,
      calculationId: envelope.calculationId,
      module: envelope.module,
      status: envelope.status,
      madhhab: envelope.profile.madhhab,
      currency: envelope.profile.currency.calculationCurrencyCode,
      createdAt: envelope.audit.createdAt,
      resultChecksum: envelope.integrity.resultChecksum,
      items: envelope.resultItems.map((item) => ({
        subjectId: item.subject.subjectId,
        localizedName: rendered.localizedSubjects[item.subject.subjectId]?.localizedName ?? item.subject.subjectId,
        status: item.status,
        decisionCode: item.decision.decisionCode,
        exactFractions: item.exactValues.fractions,
        exactRates: item.exactValues.rates,
        monetaryValues: item.monetaryValues.map((mv) => ({
          role: mv.role,
          currency: mv.money.currencyCode,
          formatted: rendered.formattedValues[mv.valueId]?.formattedString ?? `${mv.money.currencyCode} ${mv.money.value.amountMinor}`,
        })),
      })),
      audit: envelope.audit,
      integrity: envelope.integrity,
    };
  }
}
