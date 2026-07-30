/**
 * Zakat domain types — mobile app layer
 * These re-export from the Rule Engine and add legacy compatibility.
 */
export type { ZakatEngineResult, CategoryResult, IslamicReference, IrrigationMethod, LivestockType } from '../engine/zakat/types';

/** Legacy type — retained for backwards compatibility with pdf.service.ts */
export interface ZakatAssetBreakdown {
  name: string;
  value: number;
  isZakatable: boolean;
}

/** Legacy result type — retained for pdf.service.ts compatibility */
export interface ZakatResult {
  isDue: boolean;
  hawlMet: boolean;
  totalZakatableWealth: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  zakatDue: number;
  zakatRate: number;
  breakdown: ZakatAssetBreakdown[];
  currency?: string;
}
