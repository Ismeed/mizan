import { CategoryResult, IslamicReference, ZakatInput } from '../types';

const REFERENCES: IslamicReference[] = [
  {
    type:   'quran',
    text:   '"Take from their wealth a charity by which you purify them and cause them increase..."',
    source: 'Surah At-Tawbah 9:103',
  },
  {
    type:   'hadith',
    text:   '"Zakat is due on all forms of wealth that exceed the Nisab threshold after one full lunar year."',
    source: 'Sunan Ibn Majah 1792',
  },
];

/**
 * Other Zakatable Assets Strategy
 *
 * Covers any remaining zakatable wealth not covered by the specific categories above.
 * This may include:
 * - Receivables (money owed to you)
 * - Rental income accumulated
 * - Savings in foreign currency
 * - Other liquid assets
 *
 * Rate: 2.5% on the declared market value.
 */
export class OtherStrategy {
  calculate(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('others') || input.other <= 0) {
      return null;
    }

    const rate     = 0.025;
    const zakatDue = input.other * rate;

    return {
      id:          'others',
      name:        'Other Zakatable Assets',
      declared:    input.other,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'Other zakatable assets — including receivables, liquid savings, and other eligible wealth — are subject to the standard 2.5% Zakat rate, provided the total wealth exceeds the Nisab threshold and has been held for a full lunar year.',
      references:  REFERENCES,
    };
  }
}
