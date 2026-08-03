/**
 * Fraction Formatting Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExactFraction, FRACTION_FORMATTING_POLICIES } from '@mizan/shared';

export class FractionFormattingService {
  public static formatFraction(
    fraction: ExactFraction | { numerator: number | bigint; denominator: number | bigint },
    policyId: string = 'FRACTION-DISPLAY-STANDARD-001',
    displayMode: 'compact' | 'full' | 'report' = 'full',
    languageTag: string = 'en'
  ): string {
    const num = BigInt(fraction.numerator);
    const den = BigInt(fraction.denominator);

    if (den === 0n) return '0';

    const symbolic = `${num.toString()}/${den.toString()}`;

    // Words mapping for common fractions
    const fractionWords: Record<string, Record<string, string>> = {
      '1/2': { en: 'one-half', ha: 'rabi (1/2)', ar: 'النصف' },
      '1/3': { en: 'one-third', ha: 'sulusi (1/3)', ar: 'الثلث' },
      '2/3': { en: 'two-thirds', ha: 'sulusani (2/3)', ar: 'الثلثان' },
      '1/4': { en: 'one-fourth', ha: 'rubu’i (1/4)', ar: 'الربع' },
      '1/6': { en: 'one-sixth', ha: 'sudusi (1/6)', ar: 'السدس' },
      '1/8': { en: 'one-eighth', ha: 'sumuni (1/8)', ar: 'الثمن' },
    };

    const words = fractionWords[symbolic]?.[languageTag] || fractionWords[symbolic]?.['en'] || symbolic;

    if (displayMode === 'compact') {
      return symbolic;
    }

    if (displayMode === 'full') {
      return `${symbolic} (${words})`;
    }

    if (displayMode === 'report') {
      const pct = (Number(num) / Number(den)) * 100;
      return `${symbolic} (${words}, ${pct.toFixed(2)}%)`;
    }

    return symbolic;
  }
}
