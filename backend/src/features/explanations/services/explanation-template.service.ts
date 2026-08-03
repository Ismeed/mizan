/**
 * Explanation Safe Template Engine
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { RenderedVariableValue } from '@mizan/shared';

export class ExplanationTemplateService {
  /**
   * Safe variable interpolation replacing {VARIABLE_ID} placeholders with rendered variable values.
   * Disallows eval, dynamic code, or unsanitized HTML execution.
   */
  public static interpolateTemplate(
    templateText: string,
    renderedVariables: RenderedVariableValue[]
  ): string {
    if (!templateText) return '';

    let result = templateText;
    const variableMap: Record<string, string> = {};

    for (const v of renderedVariables) {
      variableMap[v.variableId] = v.renderedValue;
    }

    // Replace {VARIABLE_ID} placeholders safely
    result = result.replace(/\{([A-Z_]+)\}/g, (match, varName) => {
      if (varName in variableMap) {
        return variableMap[varName];
      }
      return match; // Keep as is if variable not present
    });

    return result;
  }
}
