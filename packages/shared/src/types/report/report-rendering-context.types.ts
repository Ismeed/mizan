/**
 * MIZAN — Report Rendering Context Contract (Phase 14)
 */

import type { Madhhab } from '../inheritance.types';
import type { TextDirection } from '../profile.types';

export type ReportFormat = 'DIGITAL' | 'PDF' | 'PRINT' | 'HTML';
export type ReportRenderingMode = 'SUMMARY' | 'DETAILED' | 'SCHOLAR' | 'TECHNICAL_AUDIT';

export interface ReportRenderingContext {
  languageTag: string;
  locale: string;
  direction: TextDirection;
  reportCurrencyCode: string;
  selectedMadhhab: Madhhab;
  reportTemplateId: string;
  reportTemplateVersion: string;
  format: ReportFormat;
  renderingMode: ReportRenderingMode;
  generatedAt: string;
  historicalRendering: boolean;
  alternativeCurrencyRendering: boolean;
  exchangeRateSnapshot?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    rateDate: string;
    rateSource: string;
  } | null;
}
