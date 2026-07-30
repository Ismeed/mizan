import { CategoryResult, IrrigationMethod, IslamicReference, ZakatInput } from '../types';

const QURAN_REF: IslamicReference = {
  type:   'quran',
  text:   '"And give its due [Zakat] on the day of its harvest..."',
  source: 'Surah Al-An\'am 6:141',
};

const HADITH_RAIN_REF: IslamicReference = {
  type:   'hadith',
  text:   '"For crops watered by rain or springs: one-tenth (10%). For those watered by irrigation: one-twentieth (5%)."',
  source: 'Sahih Bukhari 1483',
};

/**
 * Agriculture (Zakat Al-Zuru'a) Strategy
 *
 * Rule: Zakat is due on agricultural produce at harvest time (no Hawl required).
 * The rate depends on the irrigation method used:
 *
 *   - Rain-fed / Natural (Athari): 10% (one-tenth / 'Ushr)
 *   - Artificially irrigated:       5% (one-twentieth / Nisf 'Ushr)
 *   - Mixed:                       7.5% (average of both)
 *
 * This is agreed upon by all four major Madhhabs.
 * No Hawl (lunar year) is required — Zakat is due at each harvest.
 *
 * The Nisab for agricultural produce is 5 Awsuq = ~653kg of the staple crop.
 * Since the user provides a monetary value, we apply the rate directly.
 */
export class AgricultureStrategy {
  private getRateForIrrigation(method: IrrigationMethod): { rate: number; label: string; description: string } {
    switch (method) {
      case 'rain':
        return { rate: 0.10, label: '10%', description: 'Rain-fed / Natural Rainfall' };
      case 'artificial':
        return { rate: 0.05, label: '5%', description: 'Artificial Irrigation' };
      case 'mixed':
        return { rate: 0.075, label: '7.5%', description: 'Mixed Irrigation (Rain & Artificial)' };
      default:
        return { rate: 0.10, label: '10%', description: 'Rain-fed / Natural Rainfall' };
    }
  }

  calculate(input: ZakatInput): CategoryResult | null {
    if (!input.selectedTypes.includes('agriculture') || input.agriculture <= 0) {
      return null;
    }

    const { rate, label, description } = this.getRateForIrrigation(input.irrigation);
    const zakatDue = input.agriculture * rate;

    const explanations: Record<IrrigationMethod, string> = {
      rain:       'Crops watered solely by natural rainfall or springs are subject to one-tenth (10%, \'Ushr) of their harvest value. Zakat on agriculture is due at the time of harvest and does not require a full lunar year (Hawl).',
      artificial: 'Crops requiring artificial irrigation incur additional production costs, hence Zakat is reduced to one-twentieth (5%, Nisf \'Ushr) of their harvest value. This ruling is agreed upon by all four major Madhhabs.',
      mixed:      'For crops using a combination of rainfall and artificial irrigation, scholars have determined an intermediate rate of 7.5%, representing the average of the two standard rates.',
    };

    return {
      id:          'agriculture',
      name:        'Agriculture',
      declared:    input.agriculture,
      rate,
      rateLabel:   label,
      zakatDue,
      isEligible:  true,
      explanation: explanations[input.irrigation],
      references:  [QURAN_REF, HADITH_RAIN_REF],
      metadata:    { 'Irrigation Method': description },
    };
  }
}
