/**
 * MIZAN — Mirath (Islamic Inheritance) Rule Engine
 *
 * Implements the Hanafi school's rules for distributing an estate among
 * legal heirs, as derived from:
 *   • Quran 4:11-12, 4:176 (An-Nisa)
 *   • Hadith (Bukhari, Muslim)
 *   • Classical Hanafi texts (Al-Sirajiyyah)
 *
 * Algorithm outline:
 *   1. Compute blocking (Hajb hirman — complete exclusion)
 *   2. Assign Fard (fixed Quranic) shares to eligible heirs
 *   3. Identify the Asabah (residuary) heir
 *   4. Sum Fard fractions; apply Awl if > 1 (proportional reduction)
 *   5. Pay Fard; distribute remainder to Asabah
 *   6. If underpaid and no Asabah, apply Radd (return surplus) to Fard heirs
 *      — excluding spouse in Hanafi
 */

import {
  Frac, addFrac, reduceFrac, scaleFrac, compareFrac, fracToDecimal, fracToLabel,
} from '../utils/fraction.utils';
import { HeirsInput, MirathInput, MirathResult, HeirShareResult, Madhhab } from '../types/inheritance.types';
import { getMadhhabRules } from './madhhab-rules';

// ─── Internal constants ────────────────────────────────────────────────────────

const ZERO: Frac = { n: 0, d: 1 };
const ONE: Frac  = { n: 1, d: 1 };

// ─── Blocking (Hajb Hirman) ────────────────────────────────────────────────────

interface BlockingResult {
  paternalGrandfathers: boolean;
  paternalGrandmothers: boolean;
  maternalGrandmothers: boolean;
  fullBrothers: boolean;
  fullSisters: boolean;
  paternalHalfBrothers: boolean;
  paternalHalfSisters: boolean;
  maternalHalfSiblings: boolean;
  sonsOfFullBrothers: boolean;
  sonsOfPatHalfBrothers: boolean;
  paternalUncles: boolean;
  sonsOfPatUncles: boolean;
}

export function computeBlocking(h: HeirsInput, madhhab: Madhhab): BlockingResult {
  const rules = getMadhhabRules(madhhab);
  const hasChildren  = h.sons > 0 || h.daughters > 0;
  const hasSon       = h.sons > 0;
  const hasFather    = h.father > 0;
  const hasGrandpa   = h.paternalGrandfathers > 0;

  // Full siblings block paternal half-siblings
  const hasFullSib   = h.fullBrothers > 0 || h.fullSisters > 0;

  // Paternal half-siblings block sons-of-brothers
  const hasPatHalfSib = h.paternalHalfBrothers > 0 || h.paternalHalfSisters > 0;

  // Sons-of-brothers block uncles
  const hasSonOfBrother = h.sonsOfFullBrothers > 0 || h.sonsOfPatHalfBrothers > 0;

  // Grandfather (when father absent) acts like father for blocking siblings in Hanafi
  const fatherOrGrandpa = hasFather || hasGrandpa;

  return {
    // Paternal grandfather blocked by father
    paternalGrandfathers:   hasFather,
    // Paternal grandmother blocked by father (Hanafi) or mother
    paternalGrandmothers:   h.mother > 0 || hasFather,
    // Maternal grandmother blocked by mother
    maternalGrandmothers:   h.mother > 0,
    // Full siblings blocked by son or father (or grandfather in Hanafi)
    fullBrothers:           hasSon || fatherOrGrandpa,
    fullSisters:            hasSon || fatherOrGrandpa,
    // Paternal half-sisters also blocked by full siblings
    paternalHalfBrothers:   hasSon || fatherOrGrandpa || hasFullSib,
    paternalHalfSisters:    hasSon || fatherOrGrandpa || hasFullSib,
    // Maternal half-siblings blocked by children (any), father, or (depending on Madhhab) grandfather
    maternalHalfSiblings:   hasChildren || hasFather || (rules.grandfatherBlocksMaternalSiblings ? hasGrandpa : false),
    // Sons of full brothers
    sonsOfFullBrothers:     hasSon || fatherOrGrandpa || hasFullSib || hasPatHalfSib,
    // Sons of paternal half-brothers
    sonsOfPatHalfBrothers:  hasSon || fatherOrGrandpa || hasFullSib || hasPatHalfSib || h.sonsOfFullBrothers > 0,
    // Paternal uncles
    paternalUncles:         hasSon || fatherOrGrandpa || hasFullSib || hasPatHalfSib || hasSonOfBrother,
    // Sons of paternal uncles
    sonsOfPatUncles:        hasSon || fatherOrGrandpa || hasFullSib || hasPatHalfSib || hasSonOfBrother || h.paternalUncles > 0,
  };
}

// ─── Special Case: Al-Umariyyatan ─────────────────────────────────────────────

/**
 * The "Two Umar Cases" — ruling of Umar ibn al-Khattab (RA) followed by all
 * four major schools except Ibn Abbas.
 *
 * When ONLY spouse + father + mother are present (no children, no siblings):
 *   Mother normally gets 1/3; instead she gets 1/3 of what remains AFTER
 *   the spouse's share, giving:
 *     Case 1 — Husband (1/2) + Father + Mother:  Mother → 1/6
 *     Case 2 — Wife(s) (1/4) + Father + Mother:  Mother → 1/4
 *
 * Returns the mother's corrected fraction, or null if not applicable.
 */
function umariyyatanMotherShare(h: HeirsInput): Frac | null {
  const hasChildren = h.sons > 0 || h.daughters > 0;
  const hasSiblings = h.fullBrothers + h.fullSisters + h.paternalHalfBrothers +
                      h.paternalHalfSisters + h.maternalHalfSiblings > 0;
  if (hasChildren || hasSiblings) return null;
  if (h.mother === 0 || h.father === 0) return null;
  if (h.husband === 0 && h.wives === 0) return null;

  if (h.husband > 0) {
    // After husband's 1/2, remainder is 1/2. Mother gets 1/3 of 1/2 = 1/6.
    return { n: 1, d: 6 };
  } else {
    // After wife(s)' 1/4, remainder is 3/4. Mother gets 1/3 of 3/4 = 1/4.
    return { n: 1, d: 4 };
  }
}

// ─── Fard (Fixed-Share) Computation ───────────────────────────────────────────

interface FardEntry {
  key: keyof HeirsInput;
  frac: Frac;
  label: string;
  reference: string;
}

function computeFardShares(
  h: HeirsInput,
  blocked: BlockingResult,
  madhhab: Madhhab,
): FardEntry[] {
  const entries: FardEntry[] = [];
  const hasChildren = h.sons > 0 || h.daughters > 0;
  // A daughter alone (with no son) qualifies as "children" for spouse share reduction
  const childrenForSpouse = h.sons > 0 || h.daughters > 0;

  // ── Husband ──────────────────────────────────────────────────────────────────
  if (h.husband > 0) {
    entries.push({
      key: 'husband',
      frac: childrenForSpouse ? { n: 1, d: 4 } : { n: 1, d: 2 },
      label: 'Husband',
      reference: 'Quran 4:12',
    });
  }

  // ── Wife / Wives ─────────────────────────────────────────────────────────────
  if (h.wives > 0) {
    entries.push({
      key: 'wives',
      frac: childrenForSpouse ? { n: 1, d: 8 } : { n: 1, d: 4 },
      label: h.wives === 1 ? 'Wife' : `${h.wives} Wives (shared)`,
      reference: 'Quran 4:12',
    });
  }

  // ── Daughters (only when NO son — they become Asabah with son) ────────────────
  if (h.daughters > 0 && h.sons === 0) {
    const frac: Frac = h.daughters === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 };
    entries.push({
      key: 'daughters',
      frac,
      label: h.daughters === 1 ? '1 Daughter' : `${h.daughters} Daughters (shared)`,
      reference: 'Quran 4:11',
    });
  }

  // ── Mother ───────────────────────────────────────────────────────────────────
  if (h.mother > 0) {
    const umar = umariyyatanMotherShare(h);
    if (umar) {
      entries.push({
        key: 'mother',
        frac: umar,
        label: 'Mother (Al-Umariyyatan)',
        reference: 'Quran 4:11; ruling of Umar (RA)',
      });
    } else {
      // 1/6 with children OR 2+ siblings; 1/3 otherwise
      const hasTwoPlusSiblings =
        h.fullBrothers + h.fullSisters + h.paternalHalfBrothers +
        h.paternalHalfSisters + h.maternalHalfSiblings >= 2;
      const frac: Frac = (hasChildren || hasTwoPlusSiblings)
        ? { n: 1, d: 6 }
        : { n: 1, d: 3 };
      entries.push({ key: 'mother', frac, label: 'Mother', reference: 'Quran 4:11' });
    }
  }

  // ── Father ───────────────────────────────────────────────────────────────────
  // Father's Fard share: 1/6 when a son (or grandson) exists.
  // When only daughters (no sons): Father gets 1/6 FARD + residue ASABAH.
  // When no children: Father is pure Asabah (no Fard share here).
  if (h.father > 0) {
    if (h.sons > 0) {
      // Son present: father gets fixed 1/6
      entries.push({ key: 'father', frac: { n: 1, d: 6 }, label: 'Father (1/6)', reference: 'Quran 4:11' });
    } else if (h.daughters > 0) {
      // Daughters only: father gets 1/6 Fard (residue handled in Asabah)
      entries.push({ key: 'father', frac: { n: 1, d: 6 }, label: 'Father (1/6 + residue)', reference: 'Quran 4:11' });
    }
    // else: father is pure Asabah — no Fard entry, he takes all residue
  }

  // ── Paternal Grandfather (acts like Father when Father absent) ───────────────
  if (h.paternalGrandfathers > 0 && !blocked.paternalGrandfathers) {
    if (h.sons > 0) {
      entries.push({ key: 'paternalGrandfathers', frac: { n: 1, d: 6 }, label: 'Paternal Grandfather', reference: 'Al-Sirajiyyah' });
    } else if (h.daughters > 0) {
      entries.push({ key: 'paternalGrandfathers', frac: { n: 1, d: 6 }, label: 'Paternal Grandfather (1/6 + residue)', reference: 'Al-Sirajiyyah' });
    }
    // else pure Asabah
  }

  // ── Paternal Grandmother ─────────────────────────────────────────────────────
  if (h.paternalGrandmothers > 0 && !blocked.paternalGrandmothers) {
    entries.push({ key: 'paternalGrandmothers', frac: { n: 1, d: 6 }, label: 'Paternal Grandmother', reference: 'Hadith (Ibn Majah)' });
  }

  // ── Maternal Grandmother ─────────────────────────────────────────────────────
  if (h.maternalGrandmothers > 0 && !blocked.maternalGrandmothers) {
    // When both grandmothers are present they SHARE 1/6 (Hanafi)
    if (h.paternalGrandmothers > 0 && !blocked.paternalGrandmothers) {
      // Already counted above; don't add a second 1/6 if sharing
      // Actually in Hanafi both share the same 1/6 total if both present
      // We handle this by overwriting: if both present, each gets 1/12
    } else {
      entries.push({ key: 'maternalGrandmothers', frac: { n: 1, d: 6 }, label: 'Maternal Grandmother', reference: 'Hadith (Ibn Majah)' });
    }
  }

  // ── Full Sisters (when no brother → they take Fard; with brother → Asabah) ──
  if (h.fullSisters > 0 && !blocked.fullSisters) {
    if (h.fullBrothers === 0) {
      const frac: Frac = h.fullSisters === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 };
      entries.push({ key: 'fullSisters', frac, label: h.fullSisters === 1 ? 'Full Sister' : `${h.fullSisters} Full Sisters (shared)`, reference: 'Quran 4:176' });
    }
    // else: Asabah with full brothers — handled in Asabah
  }

  // ── Paternal Half-Sisters (when no paternal half-brother) ────────────────────
  if (h.paternalHalfSisters > 0 && !blocked.paternalHalfSisters) {
    if (h.paternalHalfBrothers === 0) {
      // Additionally, they can only get a share if full sisters haven't taken 2/3
      const fullSisFrac = entries.find(e => e.key === 'fullSisters')?.frac;
      const fullSisTook = fullSisFrac ? fracToDecimal(fullSisFrac) : 0;
      if (fullSisTook < 2 / 3 - 0.001) {
        // Full sisters took 1/2 (single); pat-half-sisters can take up to 1/6 (completing 2/3)
        const remaining = { n: 1, d: 6 };
        entries.push({ key: 'paternalHalfSisters', frac: remaining, label: `${h.paternalHalfSisters} Paternal Half-Sister(s)`, reference: 'Quran 4:176; Al-Sirajiyyah' });
      }
      // else: they get nothing (1/6 already "completed" by full sisters reaching 2/3 quota)
    }
  }

  // ── Maternal Half-Siblings (fixed 1/6 each; 1/3 shared if multiple) ──────────
  if (h.maternalHalfSiblings > 0 && !blocked.maternalHalfSiblings) {
    const frac: Frac = h.maternalHalfSiblings === 1 ? { n: 1, d: 6 } : { n: 1, d: 3 };
    entries.push({ key: 'maternalHalfSiblings', frac, label: h.maternalHalfSiblings === 1 ? 'Maternal Half-Sibling' : `${h.maternalHalfSiblings} Maternal Half-Siblings (shared)`, reference: 'Quran 4:12' });
  }

  return entries;
}

// ─── Asabah (Residuary) Heir ──────────────────────────────────────────────────

/**
 * Returns the single heir key that acts as Asabah (takes the estate residue
 * after Fard shares). Priority order per Hanafi:
 *   Sons > Father (no children) > Paternal Grandfather (no father) >
 *   Full Brothers > Paternal Half-Brothers > Sons of Full Brothers >
 *   Sons of Paternal Half-Brothers > Paternal Uncles > Sons of Paternal Uncles
 *
 * When daughters are present and the Asabah is a male (son, father, etc.),
 * the daughters also become Asabah (taking residue, each female gets half of
 * each male's share — i.e., sons+daughters share residue 2:1).
 */
function getAsabahKey(h: HeirsInput, blocked: BlockingResult): keyof HeirsInput | null {
  if (h.sons > 0)               return 'sons';
  if (h.father > 0 && h.sons === 0 && h.daughters === 0) return 'father'; // pure Asabah
  if (h.father > 0 && h.daughters > 0) return 'father'; // father + daughters share residue
  if (h.paternalGrandfathers > 0 && !blocked.paternalGrandfathers && h.sons === 0 && h.daughters === 0) return 'paternalGrandfathers';
  if (h.paternalGrandfathers > 0 && !blocked.paternalGrandfathers && h.daughters > 0) return 'paternalGrandfathers';
  if (h.fullBrothers > 0 && !blocked.fullBrothers) return 'fullBrothers';
  if (h.paternalHalfBrothers > 0 && !blocked.paternalHalfBrothers) return 'paternalHalfBrothers';
  if (h.sonsOfFullBrothers > 0 && !blocked.sonsOfFullBrothers) return 'sonsOfFullBrothers';
  if (h.sonsOfPatHalfBrothers > 0 && !blocked.sonsOfPatHalfBrothers) return 'sonsOfPatHalfBrothers';
  if (h.paternalUncles > 0 && !blocked.paternalUncles) return 'paternalUncles';
  if (h.sonsOfPatUncles > 0 && !blocked.sonsOfPatUncles) return 'sonsOfPatUncles';
  return null;
}

// ─── Radd (Return of Surplus) ─────────────────────────────────────────────────

/**
 * In Hanafi, when Fard shares total < 1 and there is no Asabah, surplus is
 * returned proportionally to all Fard heirs EXCEPT the spouse (husband/wife).
 * Returns the updated list of entries with adjusted fractions summing to 1.
 */
function applyRadd(entries: FardEntry[], h: HeirsInput, madhhab: Madhhab): FardEntry[] {
  const rules = getMadhhabRules(madhhab);

  if (!rules.allowRadd) {
    // Shafii/Hanbali: no Radd to anyone, surplus goes to Bayt al-Mal
    return entries;
  }

  const spouseKeys: (keyof HeirsInput)[] = ['husband', 'wives'];
  let raddRecipients = entries.filter(e => !spouseKeys.includes(e.key));
  
  if (rules.raddIncludesSpouse) {
    // Maliki: spouses can get Radd
    raddRecipients = [...entries];
  }

  const spouseEntries  = entries.filter(e =>  spouseKeys.includes(e.key));

  if (raddRecipients.length === 0) {
    // Only spouses — in Hanafi no Radd to spouse; estate goes to Bayt al-Mal
    return entries;
  }

  // Sum of Radd recipients' Fard shares
  let recipientSum: Frac = ZERO;
  for (const e of raddRecipients) recipientSum = addFrac(recipientSum, e.frac);

  // Sum of spouse shares
  let spouseSum: Frac = ZERO;
  for (const e of spouseEntries) spouseSum = addFrac(spouseSum, e.frac);

  // Remainder available for Radd = 1 - spouseSum
  const remainder: Frac = reduceFrac({ n: spouseSum.d - spouseSum.n, d: spouseSum.d });

  // Scale each Radd recipient proportionally
  // New share_i = (original_i / recipientSum) * remainder
  return entries.map(e => {
    if (spouseKeys.includes(e.key)) return e;
    // new_frac = e.frac / recipientSum * remainder
    // = (e.frac.n / e.frac.d) / (recipientSum.n / recipientSum.d) * (remainder.n / remainder.d)
    // = e.frac.n * recipientSum.d * remainder.n / (e.frac.d * recipientSum.n * remainder.d)
    const newN = e.frac.n * recipientSum.d * remainder.n;
    const newD = e.frac.d * recipientSum.n * remainder.d;
    return { ...e, frac: reduceFrac({ n: newN, d: newD }) };
  });
}

// ─── Human-Readable Labels ────────────────────────────────────────────────────

function heirLabel(key: keyof HeirsInput, count: number): string {
  const map: Partial<Record<keyof HeirsInput, [string, string]>> = {
    husband:              ['Husband', 'Husband'],
    wives:                ['Wife', 'Wives (shared)'],
    sons:                 ['Son', 'Sons (shared)'],
    daughters:            ['Daughter', 'Daughters (shared)'],
    father:               ['Father', 'Father'],
    mother:               ['Mother', 'Mother'],
    paternalGrandfathers: ['Paternal Grandfather', 'Paternal Grandfathers'],
    paternalGrandmothers: ['Paternal Grandmother', 'Paternal Grandmothers'],
    maternalGrandmothers: ['Maternal Grandmother', 'Maternal Grandmothers'],
    fullBrothers:         ['Full Brother', 'Full Brothers'],
    fullSisters:          ['Full Sister', 'Full Sisters'],
    paternalHalfBrothers: ['Paternal Half-Brother', 'Paternal Half-Brothers'],
    paternalHalfSisters:  ['Paternal Half-Sister', 'Paternal Half-Sisters'],
    maternalHalfSiblings: ['Maternal Half-Sibling', 'Maternal Half-Siblings'],
    sonsOfFullBrothers:   ["Brother's Son (Full)", "Brothers' Sons (Full)"],
    sonsOfPatHalfBrothers:["Brother's Son (Pat.)", "Brothers' Sons (Pat.)"],
    paternalUncles:       ['Paternal Uncle', 'Paternal Uncles'],
    sonsOfPatUncles:      ["Uncle's Son (Pat.)", "Uncles' Sons (Pat.)"],
  };
  const [sing, plur] = map[key] ?? [String(key), String(key)];
  return count === 1 ? sing : plur;
}

// ─── Main Engine Entry Point ───────────────────────────────────────────────────

/**
 * calculateMirath — the primary Mirath calculation function.
 *
 * Usage:
 *   import { calculateMirath } from '@mizan/shared';
 *   const result = calculateMirath({ netEstate: 1_000_000, heirs: { sons: 2, daughters: 1, wife: 1 } });
 */
export function calculateMirath(input: MirathInput): MirathResult {
  const { netEstate, heirs: h, madhhab = 'HANAFI' } = input;

  // ── 1. Blocking ────────────────────────────────────────────────────────────
  const blocked = computeBlocking(h, madhhab);

  // ── 2. Fard shares ────────────────────────────────────────────────────────
  let fardEntries = computeFardShares(h, blocked, madhhab);

  // ── 3. Asabah heir ────────────────────────────────────────────────────────
  const asabahKey = getAsabahKey(h, blocked);

  // ── 4. Sum Fard fractions ─────────────────────────────────────────────────
  let fardTotal: Frac = ZERO;
  for (const e of fardEntries) fardTotal = addFrac(fardTotal, e.frac);

  // ── 5. Awl or Radd correction ─────────────────────────────────────────────
  let method: MirathResult['calculationMethod'] = 'NORMAL';
  let awlFactor: number | undefined;

  const fardDecimal = fracToDecimal(fardTotal);

  if (fardDecimal > 1 + 1e-9) {
    // AWL — Fard exceeds estate: proportionally reduce all Fard shares
    method = 'AWL';
    awlFactor = fardDecimal; // > 1
    // Scale each entry: new_frac = original / fardTotal
    fardEntries = fardEntries.map(e => ({
      ...e,
      frac: reduceFrac({ n: e.frac.n * fardTotal.d, d: e.frac.d * fardTotal.n }),
    }));
    fardTotal = ONE; // after scaling, total == 1
  } else if (fardDecimal < 1 - 1e-9 && asabahKey === null) {
    // RADD — underpaid and no Asabah
    method = 'RADD';
    fardEntries = applyRadd(fardEntries, h, madhhab);
    // Recalculate fardTotal
    fardTotal = ZERO;
    for (const e of fardEntries) fardTotal = addFrac(fardTotal, e.frac);
  }

  // ── 6. Build share results ────────────────────────────────────────────────
  const shares: HeirShareResult[] = [];

  // All possible heir keys (for completeness — blocked/zero ones shown as blocked)
  const allKeys: (keyof HeirsInput)[] = [
    'husband', 'wives', 'sons', 'daughters', 'father', 'mother',
    'paternalGrandfathers', 'paternalGrandmothers', 'maternalGrandmothers',
    'fullBrothers', 'fullSisters', 'paternalHalfBrothers', 'paternalHalfSisters',
    'maternalHalfSiblings', 'sonsOfFullBrothers', 'sonsOfPatHalfBrothers',
    'paternalUncles', 'sonsOfPatUncles',
  ];

  // Pre-compute residue after Fard for Asabah
  const fardPaid = netEstate * fracToDecimal(fardTotal);
  let residue = netEstate - fardPaid;
  if (residue < 0) residue = 0;

  for (const key of allKeys) {
    const count = h[key];
    if (count === 0) continue; // Skip heirs that are 0

    const isBlocked = (blocked as any)[key] ?? false;
    const fardEntry = fardEntries.find(e => e.key === key);
    const isAsabah  = key === asabahKey;

    // Check for daughters who become Asabah WITH son (not standalone Fard)
    const daughtersAsAsabah = key === 'daughters' && h.sons > 0;

    if (isBlocked) {
      // Build a meaningful blocking reason
      const reason = buildBlockingReason(key, h, blocked);
      shares.push({
        key,
        label: heirLabel(key, count),
        count,
        shareType: 'BLOCKED',
        fractionLabel: 'Blocked (Hajb)',
        fractionNumerator: 0,
        fractionDenominator: 1,
        shareOfEstate: 0,
        totalAmount: 0,
        perPersonAmount: 0,
        isBlocked: true,
        blockingReason: reason,
        reference: fardEntry?.reference,
      });
      continue;
    }

    if (fardEntry && !daughtersAsAsabah) {
      // This heir has a Fard share
      const shareOfEstate = fracToDecimal(fardEntry.frac);
      const totalAmount   = netEstate * shareOfEstate;
      const perPerson     = totalAmount / count;
      shares.push({
        key,
        label: fardEntry.label,
        count,
        shareType: 'FARD',
        fractionLabel: fracToLabel(fardEntry.frac),
        fractionNumerator: fardEntry.frac.n,
        fractionDenominator: fardEntry.frac.d,
        shareOfEstate,
        totalAmount,
        perPersonAmount: perPerson,
        isBlocked: false,
        reference: fardEntry.reference,
      });
    } else if (isAsabah || daughtersAsAsabah) {
      // Asabah distribution (residue)
      let asabahAmount = residue;

      if (key === 'sons') {
        // Sons alone take all residue; daughters join 2:1
        if (h.daughters > 0) {
          // Total "units": each son = 2 units, each daughter = 1 unit
          const totalUnits = h.sons * 2 + h.daughters;
          const unitValue  = residue / totalUnits;
          const sonTotal   = h.sons * 2 * unitValue;
          const sonPer     = sonTotal / h.sons;
          shares.push({
            key: 'sons',
            label: heirLabel('sons', h.sons),
            count: h.sons,
            shareType: 'ASABAH',
            fractionLabel: 'Residue (2 parts)',
            fractionNumerator: h.sons * 2,
            fractionDenominator: totalUnits,
            shareOfEstate: (h.sons * 2) / totalUnits * (residue / netEstate),
            totalAmount: sonTotal,
            perPersonAmount: sonPer,
            isBlocked: false,
            reference: 'Quran 4:11',
          });
          // Daughters as Asabah
          const daughterTotal = h.daughters * unitValue;
          const daughterPer   = daughterTotal / h.daughters;
          shares.push({
            key: 'daughters',
            label: heirLabel('daughters', h.daughters),
            count: h.daughters,
            shareType: 'ASABAH',
            fractionLabel: 'Residue (1 part)',
            fractionNumerator: h.daughters,
            fractionDenominator: totalUnits,
            shareOfEstate: h.daughters / totalUnits * (residue / netEstate),
            totalAmount: daughterTotal,
            perPersonAmount: daughterPer,
            isBlocked: false,
            reference: 'Quran 4:11',
          });
          continue; // sons & daughters handled together; skip default push
        } else {
          asabahAmount = residue;
        }
      } else if (key === 'fullBrothers') {
        // Full brothers + full sisters: 2:1
        if (h.fullSisters > 0 && !blocked.fullSisters) {
          const totalUnits = h.fullBrothers * 2 + h.fullSisters;
          const unitValue  = residue / totalUnits;
          const bTotal     = h.fullBrothers * 2 * unitValue;
          const sTotal     = h.fullSisters * unitValue;
          shares.push({
            key: 'fullBrothers',
            label: heirLabel('fullBrothers', h.fullBrothers),
            count: h.fullBrothers,
            shareType: 'ASABAH',
            fractionLabel: 'Residue (2 parts)',
            fractionNumerator: h.fullBrothers * 2,
            fractionDenominator: totalUnits,
            shareOfEstate: (h.fullBrothers * 2) / totalUnits * (residue / netEstate),
            totalAmount: bTotal,
            perPersonAmount: bTotal / h.fullBrothers,
            isBlocked: false,
            reference: 'Quran 4:176',
          });
          shares.push({
            key: 'fullSisters',
            label: heirLabel('fullSisters', h.fullSisters),
            count: h.fullSisters,
            shareType: 'ASABAH',
            fractionLabel: 'Residue (1 part)',
            fractionNumerator: h.fullSisters,
            fractionDenominator: totalUnits,
            shareOfEstate: h.fullSisters / totalUnits * (residue / netEstate),
            totalAmount: sTotal,
            perPersonAmount: sTotal / h.fullSisters,
            isBlocked: false,
            reference: 'Quran 4:176',
          });
          continue;
        }
      }

      // Father / Grandfather who also have a Fard share + residue
      if ((key === 'father' || key === 'paternalGrandfathers') && h.daughters > 0 && h.sons === 0) {
        // Father already added as Fard (1/6). Now add his residue on top.
        shares.push({
          key,
          label: heirLabel(key, count) + ' (residue)',
          count,
          shareType: 'ASABAH',
          fractionLabel: 'Residue',
          fractionNumerator: 1,
          fractionDenominator: 1,
          shareOfEstate: residue / netEstate,
          totalAmount: residue,
          perPersonAmount: residue / count,
          isBlocked: false,
          reference: 'Quran 4:11',
        });
        continue;
      }

      // Generic Asabah entry
      const perPerson = asabahAmount / count;
      shares.push({
        key,
        label: heirLabel(key, count),
        count,
        shareType: 'ASABAH',
        fractionLabel: 'Residue',
        fractionNumerator: 1,
        fractionDenominator: 1,
        shareOfEstate: asabahAmount / netEstate,
        totalAmount: asabahAmount,
        perPersonAmount: perPerson,
        isBlocked: false,
        reference: (key === 'father' || key === 'paternalGrandfathers') ? 'Quran 4:11' : 'Al-Sirajiyyah',
      });
    } else {
      // Heir is present but gets nothing (e.g. daughter when no son but full sisters took 2/3 limit)
      shares.push({
        key,
        label: heirLabel(key, count),
        count,
        shareType: 'NONE',
        fractionLabel: '—',
        fractionNumerator: 0,
        fractionDenominator: 1,
        shareOfEstate: 0,
        totalAmount: 0,
        perPersonAmount: 0,
        isBlocked: false,
      });
    }
  }

  const totalAllocated = shares.reduce((s, e) => s + e.totalAmount, 0);
  const unallocated    = Math.max(0, netEstate - totalAllocated);

  return {
    netEstate,
    shares,
    totalAllocated,
    unallocated,
    calculationMethod: method,
    awlFactor,
    madhhab,
  };
}

// ─── Blocking Reason Descriptions ─────────────────────────────────────────────

function buildBlockingReason(
  key: keyof HeirsInput,
  h: HeirsInput,
  blocked: BlockingResult,
): string {
  switch (key) {
    case 'paternalGrandfathers':
      return 'Blocked by Father (Hajb Hirman)';
    case 'paternalGrandmothers':
      return h.mother > 0 ? 'Blocked by Mother' : 'Blocked by Father (Hanafi)';
    case 'maternalGrandmothers':
      return 'Blocked by Mother';
    case 'fullBrothers':
    case 'fullSisters':
      return h.sons > 0 ? 'Blocked by Son' : 'Blocked by Father';
    case 'paternalHalfBrothers':
    case 'paternalHalfSisters':
      if (h.sons > 0)          return 'Blocked by Son';
      if (h.father > 0)        return 'Blocked by Father';
      if (h.fullBrothers > 0)  return 'Blocked by Full Brother';
      return 'Blocked by Paternal Grandfather';
    case 'maternalHalfSiblings':
      if (h.sons > 0 || h.daughters > 0) return 'Blocked by Children';
      if (h.father > 0)        return 'Blocked by Father';
      return 'Blocked by Paternal Grandfather';
    case 'sonsOfFullBrothers':
      if (h.fullBrothers > 0)         return 'Blocked by Full Brother';
      if (h.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      if (h.sons > 0)                  return 'Blocked by Son';
      return 'Blocked by Father';
    case 'sonsOfPatHalfBrothers':
      if (h.sonsOfFullBrothers > 0)   return "Blocked by Full Brother's Son";
      if (h.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      return 'Blocked by Full Brother';
    case 'paternalUncles':
      if (h.sonsOfFullBrothers > 0)   return "Blocked by Brother's Son";
      if (h.paternalHalfBrothers > 0) return 'Blocked by Paternal Half-Brother';
      if (h.fullBrothers > 0)         return 'Blocked by Full Brother';
      return 'Blocked by Father / Grandfather';
    case 'sonsOfPatUncles':
      if (h.paternalUncles > 0) return 'Blocked by Paternal Uncle';
      return "Blocked by Uncle's nearer relative";
    default:
      return 'Blocked (Hajb Hirman)';
  }
}
