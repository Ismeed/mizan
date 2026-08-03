/**
 * MIZAN — Result Rendering Service (Phase 13)
 * Resolves localized labels, formatted money, and explanations into a RenderedCalculationResult.
 * Does NOT mutate or alter the underlying authoritative CalculationResultEnvelope.
 */

import type { CalculationResultEnvelope, RenderedCalculationResult, TextDirection } from '@mizan/shared';
import { ResultIntegrityService } from './result-integrity.service';
import crypto from 'crypto';

export class ResultRenderingService {
  static renderResult(
    envelope: CalculationResultEnvelope,
    requestedLanguageTag: string = 'en',
    requestedLocale: string = 'en-US',
    requestedDirection: TextDirection = 'LTR'
  ): RenderedCalculationResult {
    const renderedResultId = `render_${crypto.randomUUID()}`;

    const localizedSubjects: Record<string, any> = {};
    const renderedExplanations: Record<string, any> = {};
    const formattedValues: Record<string, any> = {};
    const formattedEvidenceCitations: Record<string, any> = {};

    envelope.resultItems.forEach((item) => {
      const subjectId = item.subject.subjectId;
      localizedSubjects[subjectId] = {
        subjectId,
        localizedName: subjectId.replace(/_/g, ' '),
        localizedDescription: `Subject: ${subjectId}`,
      };

      item.monetaryValues.forEach((mv) => {
        if (mv.money) {
          const minor = Number(mv.money.amountMinor || '0');
          const decimalVal = (minor / 100).toLocaleString(requestedLocale, {
            style: 'currency',
            currency: mv.money.currencyCode,
          });

          formattedValues[mv.valueId] = {
            valueId: mv.valueId,
            formattedString: decimalVal,
            displayMode: 'STANDARD',
          };
        }
      });

      item.evidence.forEach((ev) => {
        formattedEvidenceCitations[ev.evidenceId] = {
          evidenceId: ev.evidenceId,
          formattedCitation: `Citation [${ev.evidenceType}]: ${ev.evidenceId}`,
        };
      });
    });

    const coreRender = {
      authoritativeResultId: envelope.resultId,
      renderedResultId,
      language: {
        languageTag: requestedLanguageTag,
        locale: requestedLocale,
        direction: requestedDirection,
      },
      localizedSubjects,
      renderedExplanations,
      formattedValues,
      formattedEvidenceCitations,
      translationFallbacks: [],
    };

    const renderedChecksum = ResultIntegrityService.generateChecksum(coreRender);

    return {
      ...coreRender,
      renderedChecksum,
    };
  }
}
