/**
 * MIZAN — AI Agriculture Context Service (Phase 10)
 *
 * Prepares structured AI context packages for Agriculture Zakat explanations.
 * Enforces strict restrictions: AI assistant MUST NOT independently calculate Zakat.
 */

import {
  AIAgricultureContextPackage,
  AgricultureAssetResult,
} from '@mizan/shared';

export class AIAgricultureContextService {
  public buildContextPackage(
    result: AgricultureAssetResult,
    calculationId: string,
    madhhab: string,
    languageTag: string = 'en'
  ): AIAgricultureContextPackage {
    return {
      packageId: `AI-CTX-AGRI-${Date.now()}`,
      calculationId,
      assetResult: result,
      selectedMadhhab: madhhab,
      languageTag,
      disclaimerNotice:
        'IMPORTANT: The MIZAN Rule Engine is the sole authoritative calculator for Agriculture Zakat. This context is provided for explanation only. Do NOT recalculate or alter rates, nisab, or produce obligations.',
      aiRestrictions: {
        doNotRecalculate: true,
        doNotAlterRates: true,
        doNotAlterNisab: true,
        deferToRuleEngine: true,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}
