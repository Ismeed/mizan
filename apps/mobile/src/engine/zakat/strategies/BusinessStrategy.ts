import { CategoryResult, IslamicReference, ZakatInput } from '../types';

const REFERENCES: IslamicReference[] = [
  {
    type:   'quran',
    text:   '"And those who hoard gold and silver and spend it not in the way of Allah — give them tidings of a painful punishment."',
    source: 'Surah At-Tawbah 9:34',
  },
  {
    type:   'hadith',
    text:   '"On goods intended for trade, Zakat is 2.5% of their market value at the end of the lunar year."',
    source: 'Sunan Abu Dawud 1562',
  },
];

/**
 * Business Assets & Inventory Zakat Strategy
 *
 * Rule: 2.5% on the total market value of business assets, inventory,
 * and trade goods held for a full lunar year above the Nisab threshold.
 *
 * This covers:
 * - Merchandise intended for trade
 * - Raw materials
 * - Finished goods
 * - Business receivables
 *
 * Fixed assets (machinery, buildings used in production) are generally
 * NOT zakatable — the user is expected to declare only trade/inventory value.
 */
export class BusinessStrategy {
  calculate(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('business') || input.business <= 0) {
      return null;
    }

    const rate     = 0.025;
    const zakatDue = input.business * rate;

    return {
      id:          'business',
      name:        'Business Assets & Inventory',
      declared:    input.business,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'Business assets and inventory intended for trade are subject to Zakat at 2.5% of their total market value, provided the value exceeds the Nisab threshold and has been held for a full lunar year.',
      references:  REFERENCES,
    };
  }
}
