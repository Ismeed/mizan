/**
 * MIZAN Zakat Rule Engine — Core Types
 *
 * The AI Assistant MUST NEVER perform Zakat calculations.
 * Every calculation is delegated to this deterministic engine.
 */

export type IrrigationMethod = 'rain' | 'artificial' | 'mixed';
export type LivestockType    = 'camels' | 'cattle' | 'sheep' | 'goats' | 'sheepGoatCombined';

/**
 * Multi-livestock counts — a user may own multiple animal types simultaneously.
 * Each type is calculated independently by LivestockStrategy.
 */
export interface LivestockCounts {
  camels: number;
  cattle: number;
  sheep:  number;
  goats:  number;
  sheepGoatCombined?: number;
}


export interface ZakatInput {
  cash:           number;
  gold:           number;
  silver:         number;
  business:       number;
  investments:    number;
  other:          number;
  agriculture:    number;         // Market value of crop produce
  irrigation:     IrrigationMethod;
  /** Multi-livestock: counts per animal type. */
  livestockCounts: LivestockCounts;
  debts:          number;
  selectedTypes:  string[];
  nisabThreshold: number;         // Fetched from backend or fallback
  currency:       string;
  madhhab?:       string;         // Active Madhhab (Maliki, Hanafi, Shafi'i, Hanbali, Ja'fari)
}

export interface IslamicReference {
  type:   'quran' | 'hadith';
  text:   string;
  source: string;
}

export interface CategoryResult {
  id:          string;
  name:        string;
  declared:    number;
  rate:        number;
  rateLabel:   string;
  zakatDue:    number;
  isEligible:  boolean;
  explanation: string;
  references:  IslamicReference[];
  metadata?:   Record<string, string>;
}

export interface ZakatEngineResult {
  isDue:               boolean;
  totalDeclaredWealth: number;
  totalDebts:          number;
  netZakatableWealth:  number;
  nisabThreshold:      number;
  totalZakatDue:       number;
  categories:          CategoryResult[];
  madhhab:             string;
  currency:            string;
  calculatedAt:        string;    // ISO timestamp
}
