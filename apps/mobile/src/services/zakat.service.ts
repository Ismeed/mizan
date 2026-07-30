/**
 * Zakat service — mobile
 *
 * Strategy:
 *   1. Fetch current Nisab rates from backend (or use cached/fallback)
 *   2. Run the Zakat engine LOCALLY for instant offline-capable results
 *   3. Sync result to backend in the background for history
 */
import { calculateZakat } from '@mizan/shared';
import { apiClient } from './api.client';

/** Fallback silver Nisab in USD when backend is unreachable */
const FALLBACK_NISAB_USD = 450; // ~595g silver × ~$0.75/g

export interface CalculateZakatPayload {
  cash: number;
  gold: number;         // monetary value already (not grams)
  silver?: number;      // monetary value
  business: number;
  investments: number;
  receivables?: number;
  debts: number;
  exempt?: number;      // legacy field, ignored (use debts)
  currency?: string;
  hawlMet?: boolean;
}

export interface ZakatResult {
  isDue: boolean;
  hawlMet: boolean;
  totalZakatableWealth: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  zakatDue: number;
  zakatRate: number;
  breakdown: Array<{ name: string; value: number; isZakatable: boolean }>;
  currency?: string;
}

/** In-memory cache for Nisab rates (refreshed every 24h) */
let cachedNisab: { value: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchNisabThreshold(): Promise<number> {
  // Return cached value if fresh
  if (cachedNisab && Date.now() - cachedNisab.timestamp < CACHE_TTL_MS) {
    return cachedNisab.value;
  }
  try {
    const response = await apiClient.get('/zakat/nisab-rates');
    const rates: Array<{ type: string; value_in_grams: number; price_per_gram_usd: number }> = response.data.data;
    const silverRate = rates.find(r => r.type === 'SILVER');
    const goldRate   = rates.find(r => r.type === 'GOLD');

    const silverNisab = silverRate
      ? silverRate.value_in_grams * silverRate.price_per_gram_usd
      : FALLBACK_NISAB_USD;
    const goldNisab   = goldRate
      ? goldRate.value_in_grams * goldRate.price_per_gram_usd
      : FALLBACK_NISAB_USD * 10;

    const nisab = Math.min(silverNisab, goldNisab); // Hanafi: use lower
    cachedNisab = { value: nisab, timestamp: Date.now() };
    return nisab;
  } catch {
    return FALLBACK_NISAB_USD;
  }
}

export const zakatService = {
  calculate: async (payload: CalculateZakatPayload): Promise<ZakatResult> => {
    const {
      cash = 0,
      gold = 0,
      silver = 0,
      business = 0,
      investments = 0,
      receivables = 0,
      debts = 0,
      currency = 'USD',
      hawlMet = true,
    } = payload;

    const nisabThreshold = await fetchNisabThreshold();

    const result = calculateZakat({
      assets: {
        cash,
        goldValue:         gold,
        silverValue:       silver,
        businessInventory: business,
        investments,
        receivables,
      },
      liabilities:              debts,
      nisabThresholdInCurrency: nisabThreshold,
      hawlMet,
      currency,
    });

    // Background sync to backend (non-blocking)
    apiClient.post('/zakat/calculate', {
      assets: { cash, goldValue: gold, silverValue: silver, businessInventory: business, investments, receivables },
      liabilities: debts,
      currency,
      hawlMet,
    }).catch(() => { /* offline or not authed — ignore */ });

    return result;
  },

  /** Fetch user's saved zakat calculations */
  getHistory: async () => {
    const response = await apiClient.get('/zakat/history');
    return response.data.data;
  },

  /** Get current Nisab rates for display */
  getNisabRates: async () => {
    const response = await apiClient.get('/zakat/nisab-rates');
    return response.data.data;
  },
};
