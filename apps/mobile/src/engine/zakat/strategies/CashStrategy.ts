import { CategoryResult, IslamicReference, ZakatInput } from '../types';

const REFERENCES: IslamicReference[] = [
  {
    type:   'quran',
    text:   '"Take from their wealth a charity by which you purify them and cause them increase..."',
    source: 'Surah At-Tawbah 9:103',
  },
  {
    type:   'hadith',
    text:   '"On silver: its Zakat is a quarter of a tenth (2.5%)."',
    source: 'Sahih Bukhari 1454',
  },
];

/**
 * Cash & Savings Zakat Strategy
 *
 * Rule: 2.5% (1/40th) on the total monetary value of cash and savings
 * that has been held for one full lunar year (Hawl) above the Nisab threshold.
 *
 * Applicable across all four major Madhhabs (Hanafi, Maliki, Shafi'i, Hanbali).
 */
export class CashStrategy {
  calculate(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('cash') || input.cash <= 0) {
      return null;
    }

    const rate   = 0.025;
    const zakatDue = input.cash * rate;

    return {
      id:          'cash',
      name:        'Cash & Savings',
      declared:    input.cash,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'The declared cash and savings exceed the Nisab threshold and are subject to the standard Zakat rate of 2.5% (one-fortieth), which applies to all monetary wealth held for a full lunar year.',
      references:  REFERENCES,
    };
  }
}
