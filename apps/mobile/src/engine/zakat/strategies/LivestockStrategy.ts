import { CategoryResult, IslamicReference, LivestockCounts, LivestockType, ZakatInput } from '../types';

// ─── Shared references (applied to each animal category result) ──────────────

const BASE_REFERENCES: IslamicReference[] = [
  {
    type:   'hadith',
    text:   '"The Messenger of Allah ﷺ prescribed Zakat on livestock — camels, cattle, and sheep — in specific amounts."',
    source: 'Sahih Bukhari 1450',
  },
  {
    type:   'hadith',
    text:   '"On 5 camels: 1 sheep. On 30 cattle: 1 yearling (Tabi\'). On 40 sheep: 1 sheep."',
    source: 'Sunan Abu Dawud 1568',
  },
  {
    type:   'quran',
    text:   '"And those who hoard gold and silver and do not spend them in the way of Allah — give them tidings of a painful punishment."',
    source: 'Surah At-Tawbah (9:34)',
  },
];

/**
 * Nisab thresholds (minimum number of animals for Zakat to be obligatory)
 * Source: Sahih Bukhari 1450 / Abu Dawud 1568
 */
const NISAB: Record<LivestockType, number> = {
  camels: 5,
  cattle: 30,
  sheep:  40,
  goats:  40,
  sheepGoatCombined: 40,
};

const ANIMAL_LABELS: Record<LivestockType, string> = {
  camels: 'Camels',
  cattle: 'Cattle',
  sheep:  'Sheep',
  goats:  'Goats',
  sheepGoatCombined: 'Sheep & Goats Combined',
};

/**
 * Calculate the number of animals due based on Sunnah-prescribed schedules.
 * Returns a human-readable description of what is owed.
 */
function computeLivestockDue(type: LivestockType, count: number): string {
  if (type === 'camels') {
    if (count < 5)   return 'None (below Nisab)';
    if (count < 10)  return '1 Sheep';
    if (count < 15)  return '2 Sheep';
    if (count < 20)  return '3 Sheep';
    if (count < 25)  return '4 Sheep';
    if (count < 36)  return '1 Bint Makhad (1-year-old she-camel)';
    if (count < 46)  return '1 Bint Labun (2-year-old she-camel)';
    if (count < 61)  return '1 Hiqqah (3-year-old she-camel)';
    if (count < 76)  return '1 Jadha\'ah (4-year-old she-camel)';
    if (count < 91)  return '2 Bint Labun';
    if (count < 121) return '2 Hiqqah';
    return 'Consult a scholar (progressive scale above 120 camels)';
  }

  if (type === 'cattle') {
    if (count < 30) return 'None (below Nisab)';
    const sets30 = Math.floor(count / 30);
    const sets40 = Math.floor(count / 40);
    if (count % 30 === 0) return `${sets30} Tabi' (yearling cattle)`;
    if (count % 40 === 0) return `${sets40} Musinna (two-year-old cattle)`;
    return `${Math.floor(count / 30)} Tabi' or ${Math.floor(count / 40)} Musinna (consult a scholar for exact mix)`;
  }

  if (type === 'sheep' || type === 'goats' || type === 'sheepGoatCombined') {
    if (count < 40)   return 'None (below Nisab)';
    if (count < 121)  return '1 Sheep/Goat';
    if (count < 201)  return '2 Sheep/Goats';
    if (count < 301)  return '3 Sheep/Goats';
    return `${3 + Math.floor((count - 301) / 100) + 1} Sheep/Goats (progressive scale)`;
  }

  return 'Consult a scholar';
}

function getExplanation(type: LivestockType, count: number, isEligible: boolean): string {
  if (!isEligible) {
    return `Your herd of ${count} ${ANIMAL_LABELS[type].toLowerCase()} does not reach the Nisab threshold of ${NISAB[type]} animals required for Zakat to be obligatory on this category.`;
  }

  const explanations: Record<LivestockType, string> = {
    camels: `With ${count} camels, Zakat is obligatory. The Zakat on camels follows a progressive Sunnah-prescribed schedule established by the Messenger ﷺ (Sahih Bukhari 1450). The due amount is expressed in animals, not monetary value.`,
    cattle: `With ${count} cattle, Zakat is due. The rule: for every 30 cattle, one yearling (Tabi'); for every 40, one two-year-old cow (Musinna). These thresholds are established in authenticated Hadith (Abu Dawud 1568).`,
    sheep:  `With ${count} sheep, Zakat is due. For 40–120 animals, 1 sheep is owed. The scale increases progressively with herd size according to the Sunnah (Sahih Bukhari 1450).`,
    goats:  `With ${count} goats, Zakat is due. For 40–120 animals, 1 goat is owed. Goats share the same Nisab rules as sheep (Sahih Bukhari 1450).`,
    sheepGoatCombined: `With ${count} combined sheep & goats, Zakat is due. Sunnah fiqh combines sheep and goats into a single flock for Nisab calculation (Sahih Bukhari 1450).`,
  };

  return explanations[type];
}

/**
 * Livestock Zakat Strategy (Zakat Al-An'am) — Multi-Type Support
 *
 * Independently calculates Zakat eligibility for each of the three livestock
 * categories: Camels, Cattle, and Sheep/Goats. A user may own multiple
 * livestock types simultaneously, each assessed against its own Nisab.
 *
 * Key rules (from Sahih Bukhari 1450 / Abu Dawud 1568):
 * - Camels: Nisab = 5. Progressive scale per Hadith of Abu Bakr (RA).
 * - Cattle: Nisab = 30. 1 yearling per 30; 1 two-year-old per 40.
 * - Sheep/Goats: Nisab = 40. 1 sheep per 40–120; scales progressively.
 *
 * Livestock Zakat is PAID IN KIND (animals), not as a monetary amount.
 * The zakatDue monetary field is intentionally 0 — the engine returns
 * the prescribed animals due as metadata for the user to consult a scholar.
 */
export class LivestockStrategy {
  /**
   * Calculate Zakat for ALL selected livestock types independently.
   * Returns an array of CategoryResult (one per owned animal type with count > 0).
   */
  calculateAll(input: ZakatInput): CategoryResult[] {
    if (!input.selectedTypes.includes('livestock')) {
      return [];
    }

    const results: CategoryResult[] = [];
    const { livestockCounts } = input;

    const typesToCheck: LivestockType[] = ['camels', 'cattle', 'sheep'];

    for (const type of typesToCheck) {
      const count = livestockCounts[type] ?? 0;
      if (count <= 0) continue;

      const isEligible  = count >= NISAB[type];
      const animalsDue  = isEligible ? computeLivestockDue(type, count) : 'None (below Nisab)';
      const label       = ANIMAL_LABELS[type];

      results.push({
        id:         `livestock_${type}`,
        name:       `Livestock — ${label}`,
        declared:   0,         // Not expressed in monetary value
        rate:       0,         // Not a percentage rate
        rateLabel:  'Per Hadith Table',
        zakatDue:   0,         // Paid in kind (animals)
        isEligible,
        explanation: getExplanation(type, count, isEligible),
        references:  BASE_REFERENCES,
        metadata: {
          'Animal Type':   label,
          'Animals Owned': `${count}`,
          'Nisab':         `${NISAB[type]} ${label}`,
          'Status':        isEligible ? '✓ Zakat Due' : 'Below Nisab',
          'Animals Due':   animalsDue,
          'Payment':       'In kind (animals) — consult a qualified scholar for monetary equivalent',
        },
      });
    }

    return results;
  }

  /**
   * @deprecated Use calculateAll() for multi-type support.
   * Kept for backward compatibility with ZakatEngine if called directly.
   */
  calculate(input: ZakatInput): CategoryResult | null {
    const results = this.calculateAll(input);
    return results.length > 0 ? results[0] : null;
  }
}
