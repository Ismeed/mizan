/**
 * Islamic Terminology Registry Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export interface TermVariant {
  preferred: string;
  alternatives: string[];
  avoid: string[];
}

export interface TerminologyRecord {
  termId: string;
  version: string;
  domain: 'MIRATH' | 'ZAKAT' | 'SHARED';
  canonicalConcept: string;
  terms: {
    en?: TermVariant;
    ha?: TermVariant;
    ar?: TermVariant;
    [key: string]: TermVariant | undefined;
  };
  definitionExplanationId?: string;
  madhhabScope: {
    appliesTo: string[];
  };
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
  };
}

export interface ArabicTermRecord {
  originalTerm: string;
  transliteration: string;
  translatedTerm: string;
  definitionExplanationId?: string;
}
