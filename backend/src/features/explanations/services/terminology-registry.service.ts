/**
 * Terminology Registry Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { BASELINE_TERMINOLOGY_REGISTRY, TerminologyRecord } from '@mizan/shared';

export class TerminologyRegistryService {
  public static getTerm(termId: string): TerminologyRecord | null {
    return BASELINE_TERMINOLOGY_REGISTRY[termId] || null;
  }

  public static getPreferredTerm(termId: string, languageTag: string): string | null {
    const record = this.getTerm(termId);
    if (!record) return null;
    const langTerms = record.terms[languageTag] || record.terms['en'];
    return langTerms ? langTerms.preferred : null;
  }
}
