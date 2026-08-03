/**
 * Islamic Terminology Registry
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { TerminologyRecord } from '../types/explanation/terminology.types';

export const BASELINE_TERMINOLOGY_REGISTRY: Record<string, TerminologyRecord> = {
  TERM_MIRATH: {
    termId: 'TERM_MIRATH',
    version: '1.0.0',
    domain: 'MIRATH',
    canonicalConcept: 'INHERITANCE_SYSTEM',
    terms: {
      en: { preferred: 'Inheritance (Mirath)', alternatives: ['Islamic Inheritance', 'Faraid'], avoid: ['Will split'] },
      ha: { preferred: 'Gado (Mirath)', alternatives: ['Rab rabon gado'], avoid: ['Kudin mutuwa'] },
      ar: { preferred: 'علم المواضيع والفرائض', alternatives: ['الميراث', 'التركة'], avoid: [] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
  TERM_ZAKAT: {
    termId: 'TERM_ZAKAT',
    version: '1.0.0',
    domain: 'ZAKAT',
    canonicalConcept: 'OBLIGATORY_ALMS',
    terms: {
      en: { preferred: 'Zakat', alternatives: ['Zakah', 'Obligatory Charity'], avoid: ['Tax', 'Donation'] },
      ha: { preferred: 'Zakka', alternatives: ['Zakkah'], avoid: ['Haraji', 'Sadaka'] },
      ar: { preferred: 'الزكاة', alternatives: ['الزكاة المفروضة'], avoid: ['الصدقة'] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
  TERM_NISAB: {
    termId: 'TERM_NISAB',
    version: '1.0.0',
    domain: 'ZAKAT',
    canonicalConcept: 'MINIMUM_THRESHOLD',
    terms: {
      en: { preferred: 'Nisab', alternatives: ['Zakat Threshold', 'Nisab Minimum'], avoid: ['Tax bracket'] },
      ha: { preferred: 'Nisabi', alternatives: ['Mafi karancin dukiya'], avoid: [] },
      ar: { preferred: 'النصاب', alternatives: ['حد النصاب'], avoid: [] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
  TERM_HAWL: {
    termId: 'TERM_HAWL',
    version: '1.0.0',
    domain: 'ZAKAT',
    canonicalConcept: 'LUNAR_YEAR_HOLDING_PERIOD',
    terms: {
      en: { preferred: 'Hawl', alternatives: ['Lunar Year Holding Period', 'One Hijri Year'], avoid: ['Fiscal year'] },
      ha: { preferred: 'Shekara (Hawl)', alternatives: ['Cikar shekara guda'], avoid: [] },
      ar: { preferred: 'الحول', alternatives: ['حولان الحول'], avoid: [] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
  TERM_HIJAB: {
    termId: 'TERM_HIJAB',
    version: '1.0.0',
    domain: 'MIRATH',
    canonicalConcept: 'HEIR_EXCLUSION_OR_REDUCTION',
    terms: {
      en: { preferred: 'Exclusion (Hijab)', alternatives: ['Blocking', 'Disqualification'], avoid: ['Disinheritance'] },
      ha: { preferred: 'Hana Gado (Hijab)', alternatives: ['Kare gado'], avoid: ['Soke gado'] },
      ar: { preferred: 'الحجب', alternatives: ['حجب الحرمان', 'حجب النقصان'], avoid: [] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
  TERM_MADHHAB: {
    termId: 'TERM_MADHHAB',
    version: '1.0.0',
    domain: 'SHARED',
    canonicalConcept: 'SCHOOL_OF_ISLAMIC_JURISPRUDENCE',
    terms: {
      en: { preferred: 'Madhhab', alternatives: ['School of Fiqh', 'Jurisprudential School'], avoid: ['Sect'] },
      ha: { preferred: 'Madhab', alternatives: ['Doka ko Tafarkin Fiqhu'], avoid: [] },
      ar: { preferred: 'المذهب الفقهي', alternatives: ['المذهب'], avoid: ['الفرقة'] },
    },
    madhhabScope: { appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'] },
    governance: { status: 'APPROVED' },
  },
};
