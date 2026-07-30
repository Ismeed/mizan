/**
 * MIZAN — Zakat Calculation Engine
 *
 * Implements Zakat al-Mal (Zakat on wealth) per Hanafi fiqh:
 *   • Quran 9:60, 9:103
 *   • Hadith (Bukhari, Muslim, Abu Dawud)
 *
 * Key rules:
 *   1. Nisab — minimum threshold before Zakat is obligatory
 *      Gold Nisab:  85 grams (7.5 tola)
 *      Silver Nisab: 595 grams (52.5 tola)
 *      Hanafi: use the LOWER of the two (silver-based) for most wealth types
 *   2. Hawl — the wealth must have been held for one complete lunar year
 *   3. Rate — 2.5% (1/40) of net zakatable wealth
 *   4. Exempt assets — primary residence, personal vehicle, clothing, etc.
 */

export interface ZakatAssetInput {
  /** Cash in hand and bank accounts */
  cash: number;
  /** Gold value (at market price in user's currency) */
  goldValue: number;
  /** Silver value (at market price) */
  silverValue: number;
  /** Business inventory and trading stock */
  businessInventory: number;
  /** Quoted investments (stocks, funds) at market value */
  investments: number;
  /** Loans receivable that are expected to be recovered */
  receivables: number;
}

export interface ZakatInput {
  assets: ZakatAssetInput;
  /** Debts currently due/payable */
  liabilities: number;
  /**
   * Current Nisab threshold in the user's currency.
   * Pass the silver Nisab value (lower threshold, Hanafi preference)
   * fetched from the NisabRate DB table.
   */
  nisabThresholdInCurrency: number;
  /** Optional: whether Hawl (1 lunar year) has passed — default true */
  hawlMet?: boolean;
  /** Asset breakdown per category for display */
  currency?: string;
}

export interface ZakatAssetBreakdown {
  name: string;
  value: number;
  isZakatable: boolean;
}

export interface ZakatResult {
  isDue: boolean;
  hawlMet: boolean;
  totalZakatableWealth: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  zakatDue: number;
  /** 2.5% = 0.025 */
  zakatRate: number;
  breakdown: ZakatAssetBreakdown[];
  currency?: string;
}

/**
 * calculateZakat — the primary Zakat calculation function.
 *
 * Usage:
 *   import { calculateZakat } from '@mizan/shared';
 *   const result = calculateZakat({ assets: { cash: 500000, ... }, liabilities: 50000, nisabThresholdInCurrency: 430000 });
 */
export function calculateZakat(input: ZakatInput): ZakatResult {
  const { assets, liabilities, nisabThresholdInCurrency, hawlMet = true, currency } = input;

  // ── Total zakatable wealth ──────────────────────────────────────────────────
  const totalZakatableWealth =
    (assets.cash ?? 0) +
    (assets.goldValue ?? 0) +
    (assets.silverValue ?? 0) +
    (assets.businessInventory ?? 0) +
    (assets.investments ?? 0) +
    (assets.receivables ?? 0);

  // ── Net zakatable wealth (deduct liabilities) ──────────────────────────────
  const totalLiabilities     = Math.max(0, liabilities ?? 0);
  const netZakatableWealth   = Math.max(0, totalZakatableWealth - totalLiabilities);

  // ── Determine if Zakat is due ──────────────────────────────────────────────
  const meetsNisab = netZakatableWealth >= nisabThresholdInCurrency;
  const isDue      = meetsNisab && hawlMet;
  const zakatRate  = 0.025; // 2.5% = 1/40
  const zakatDue   = isDue ? netZakatableWealth * zakatRate : 0;

  // ── Breakdown for display ──────────────────────────────────────────────────
  const breakdown: ZakatAssetBreakdown[] = [
    { name: 'Cash & Bank',              value: assets.cash ?? 0,              isZakatable: true },
    { name: 'Gold',                     value: assets.goldValue ?? 0,         isZakatable: true },
    { name: 'Silver',                   value: assets.silverValue ?? 0,       isZakatable: true },
    { name: 'Business Inventory',       value: assets.businessInventory ?? 0, isZakatable: true },
    { name: 'Investments',              value: assets.investments ?? 0,       isZakatable: true },
    { name: 'Receivables',              value: assets.receivables ?? 0,       isZakatable: true },
    { name: 'Liabilities (deducted)',   value: -totalLiabilities,             isZakatable: false },
  ].filter(item => item.value !== 0);

  return {
    isDue,
    hawlMet,
    totalZakatableWealth,
    totalLiabilities,
    netZakatableWealth,
    nisabThreshold: nisabThresholdInCurrency,
    zakatDue,
    zakatRate,
    breakdown,
    currency,
  };
}
