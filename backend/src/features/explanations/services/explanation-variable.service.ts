/**
 * Explanation Variable Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { EXPLANATION_VARIABLE_DEFINITIONS, ExplanationVariableId, RenderedVariableValue } from '@mizan/shared';
import { EntityLabelResolutionService } from './entity-label-resolution.service';
import { FractionFormattingService } from './fraction-formatting.service';
import { MoneyFormattingService } from './money-formatting.service';
import { QuantityFormattingService, DateFormattingService } from './quantity-formatting.service';

export class ExplanationVariableService {
  public static resolveVariable(
    variableId: string,
    structuredResult: Record<string, any>,
    languageTag: string,
    localeTag: string = 'en-NG'
  ): RenderedVariableValue | null {
    const varDef = EXPLANATION_VARIABLE_DEFINITIONS[variableId as ExplanationVariableId];
    if (!varDef) return null;

    const sourceValue = this.extractValueFromPath(structuredResult, varDef.sourcePath);

    if (sourceValue === undefined || sourceValue === null) {
      if (varDef.required) {
        throw new Error(`MISSING_REQUIRED_VARIABLE: ${variableId} at path ${varDef.sourcePath}`);
      }
      return null;
    }

    let renderedValue = String(sourceValue);

    switch (varDef.valueType) {
      case 'FRACTION':
        if (typeof sourceValue === 'object' && 'numerator' in sourceValue && 'denominator' in sourceValue) {
          renderedValue = FractionFormattingService.formatFraction(sourceValue, varDef.formattingPolicyId, 'full', languageTag);
        }
        break;
      case 'MONEY':
        const currency = structuredResult.currencyCode || 'NGN';
        renderedValue = MoneyFormattingService.formatMoney(sourceValue, currency, localeTag);
        break;
      case 'ENTITY_LABEL':
      case 'CATEGORY_LABEL':
        renderedValue = EntityLabelResolutionService.resolveEntityLabel(String(sourceValue), varDef.valueType, languageTag);
        break;
      case 'DECIMAL':
      case 'INTEGER':
        renderedValue = QuantityFormattingService.formatQuantity(sourceValue, structuredResult.unitId, localeTag);
        break;
      case 'DATE':
        renderedValue = DateFormattingService.formatDate(sourceValue, localeTag);
        break;
    }

    return {
      variableId: varDef.variableId,
      sourceValue,
      renderedValue,
    };
  }

  private static extractValueFromPath(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }
}
