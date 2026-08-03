/**
 * MIZAN — Agriculture AI Context Package Contracts (Phase 10)
 */

import type { AgricultureAssetResult } from './agriculture-result.types';

export interface AIAgricultureContextPackage {
  packageId: string;
  calculationId: string;
  assetResult: AgricultureAssetResult;
  selectedMadhhab: string;
  languageTag: string;
  disclaimerNotice: string;
  aiRestrictions: {
    doNotRecalculate: boolean;
    doNotAlterRates: boolean;
    doNotAlterNisab: boolean;
    deferToRuleEngine: boolean;
  };
  generatedAt: string;
}
