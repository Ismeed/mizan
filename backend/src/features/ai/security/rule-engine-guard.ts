import { calculateMirath, calculateZakat } from '@mizan/shared';

export interface CalculationContext {
  type: 'MIRATH' | 'ZAKAT' | 'NONE';
  engineOutput?: any;
  rawInputDetected?: boolean;
}

export class RuleEngineGuard {
  /**
   * Evaluates if the user prompt involves a calculation scenario.
   * If detected, executes the deterministic @mizan/shared rule engine
   * so that Gemini NEVER calculates raw numbers itself.
   */
  static processCalculationGuard(prompt: string, contextData?: any): CalculationContext {
    const q = prompt.toLowerCase();

    // 1. Mirath Calculation Detection
    const isMirathCalc = (
      q.includes('calculate inheritance') ||
      (q.includes('estate') && (q.includes('share') || q.includes('distribute'))) ||
      (q.includes('how much') && (q.includes('wife') || q.includes('daughter') || q.includes('son') || q.includes('mother')) && q.includes('get'))
    );

    if (isMirathCalc && contextData?.heirs) {
      try {
        const gross = contextData.estate || 1000000;
        const d = contextData.debts || 0;
        const f = contextData.funeralExpenses || 0;
        const rem = Math.max(0, gross - d - f);
        const w = Math.min(contextData.wasiyyah || 0, rem / 3);
        const netEstate = Math.max(0, rem - w);

        const engineResult = calculateMirath({
          netEstate,
          heirs: contextData.heirs,
          madhhab: (contextData.madhhab || 'HANAFI').toUpperCase() as any,
        });

        return {
          type: 'MIRATH',
          engineOutput: engineResult,
          rawInputDetected: true,
        };
      } catch (err) {
        console.warn('[RuleEngineGuard] Mirath engine execution error:', err);
      }
    }

    // 2. Zakat Calculation Detection
    const isZakatCalc = (
      q.includes('zakat') && (
        q.includes('calculate') ||
        q.includes('my zakat') ||
        q.includes('how much') ||
        q.includes('pay') ||
        q.includes('due')
      )
    );

    if (isZakatCalc && contextData?.assets) {
      try {
        const engineResult = calculateZakat({
          assets: contextData.assets,
          liabilities: contextData.liabilities || 0,
          nisabThresholdInCurrency: contextData.nisabThreshold || 1025000,
          hawlMet: contextData.hawlMet !== false,
          currency: contextData.currency || 'NGN',
        });

        return {
          type: 'ZAKAT',
          engineOutput: engineResult,
          rawInputDetected: true,
        };
      } catch (err) {
        console.warn('[RuleEngineGuard] Zakat engine execution error:', err);
      }
    }

    return { type: 'NONE' };
  }
}
