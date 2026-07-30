import { CategoryResult, IslamicReference, ZakatInput } from '../types';

const GOLD_REFERENCES: IslamicReference[] = [
  {
    type:   'quran',
    text:   '"And those who hoard gold and silver and spend it not in the way of Allah — give them tidings of a painful punishment."',
    source: 'Surah At-Tawbah 9:34',
  },
  {
    type:   'hadith',
    text:   '"On gold and silver, Zakat is due at 2.5% (one-fortieth)."',
    source: 'Sunan Abu Dawud 1573',
  },
];

const SILVER_REFERENCES: IslamicReference[] = [
  {
    type:   'hadith',
    text:   '"On silver: its Zakat is a quarter of a tenth (2.5%)."',
    source: 'Sahih Bukhari 1454',
  },
];

/**
 * Gold & Silver Zakat Strategy
 *
 * Rule: 2.5% (1/40th) on the monetary value of gold and silver
 * held for a full lunar year (Hawl) above the Nisab threshold.
 *
 * The user provides the total market value of their gold and silver
 * in the local currency. The engine does not require weight or purity
 * inputs — these are pre-calculated into the declared market value.
 *
 * Nisab for gold:   ~85g of 24K gold
 * Nisab for silver: ~595g of silver (typically the lower threshold, used in Hanafi)
 */
export class GoldSilverStrategy {
  /** Calculate Zakat on gold */
  calculateGold(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('gold') || input.gold <= 0) {
      return null;
    }

    const rate     = 0.025;
    const zakatDue = input.gold * rate;

    return {
      id:          'gold',
      name:        'Gold',
      declared:    input.gold,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'Gold held for one full lunar year above the Nisab threshold is subject to a 2.5% Zakat obligation. The declared market value is used to determine Zakat due.',
      references:  GOLD_REFERENCES,
    };
  }

  /** Calculate Zakat on silver */
  calculateSilver(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('gold') || input.silver <= 0) {
      return null;
    }

    const rate     = 0.025;
    const zakatDue = input.silver * rate;

    return {
      id:          'silver',
      name:        'Silver',
      declared:    input.silver,
      rate,
      rateLabel:   '2.5%',
      zakatDue,
      isEligible:  true,
      explanation: 'Silver is subject to the same 2.5% Zakat rate as gold when its value exceeds the Nisab threshold (595g of silver). The Hanafi school uses silver Nisab as the lower, more conservative threshold.',
      references:  SILVER_REFERENCES,
    };
  }
}
