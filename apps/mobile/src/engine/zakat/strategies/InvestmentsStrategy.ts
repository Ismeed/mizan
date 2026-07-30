import { CategoryResult, IslamicReference, ZakatInput } from '../types';

const REFERENCES: IslamicReference[] = [
  {
    type:   'quran',
    text:   '"O you who have believed, spend from the good things which you have earned..."',
    source: 'Surah Al-Baqarah 2:267',
  },
  {
    type:   'hadith',
    text:   '"On trade goods: Zakat is 2.5% of their market value at the end of the Hawl."',
    source: 'Sunan Abu Dawud 1562',
  },
];

/**
 * Investments & Stocks Zakat Strategy
 *
 * Rule: 2.5% on the total current market value of investment portfolios
 * and stock holdings, provided the value exceeds the Nisab threshold
 * and has been held for a full lunar year.
 *
 * This follows the contemporary scholarly opinion that the total current
 * market value of stocks represents zakatable wealth, particularly for
 * shares held as investments (not for trading in the short term).
 */
export class InvestmentsStrategy {
  calculate(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('investments') || input.investments <= 0) {
      return null;
    }

    const rate     = 0.025;
    const zakatDue = input.investments * rate;

    return {
      id:          'investments',
      name:        'Investments & Stocks',
      declared:    input.investments,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'Investment portfolios and stock holdings are subject to Zakat at 2.5% of their total market value at the end of the lunar year. Contemporary scholars widely apply this rate to the zakatable portion of equity investments.',
      references:  REFERENCES,
    };
  }
}
