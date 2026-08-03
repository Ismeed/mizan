/**
 * MIZAN — Permanent Origin Type Registry (Phase 15)
 * Controls navigation return behaviour, permitted context, visibility policy,
 * audit information, historical handling, and deep-link behaviour.
 */

export const EvidenceNavigationOriginType = {
  CALCULATION_RESULT: 'CALCULATION_RESULT',
  RESULT_ITEM: 'RESULT_ITEM',
  MIRATH_HEIR_CARD: 'MIRATH_HEIR_CARD',
  HIJAB_RESULT_CARD: 'HIJAB_RESULT_CARD',
  ZAKAT_CATEGORY_CARD: 'ZAKAT_CATEGORY_CARD',
  LIVESTOCK_RESULT_CARD: 'LIVESTOCK_RESULT_CARD',
  AGRICULTURE_RESULT_CARD: 'AGRICULTURE_RESULT_CARD',
  DIGITAL_REPORT: 'DIGITAL_REPORT',
  PDF_REPORT: 'PDF_REPORT',
  HISTORICAL_REPORT: 'HISTORICAL_REPORT',
  TRANSLATED_HISTORICAL_REPORT: 'TRANSLATED_HISTORICAL_REPORT',
  ALTERNATIVE_CURRENCY_REPORT: 'ALTERNATIVE_CURRENCY_REPORT',
  EVIDENCE_LIBRARY: 'EVIDENCE_LIBRARY',
  RULE_DETAILS: 'RULE_DETAILS',
  EXPLANATION_DETAILS: 'EXPLANATION_DETAILS',
  SCHOLAR_REVIEW_SCREEN: 'SCHOLAR_REVIEW_SCREEN',
  AI_ASSISTANT_FOLLOW_UP: 'AI_ASSISTANT_FOLLOW_UP',
} as const;

export type EvidenceNavigationOriginType =
  (typeof EvidenceNavigationOriginType)[keyof typeof EvidenceNavigationOriginType];

export const ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES: EvidenceNavigationOriginType[] = Object.values(
  EvidenceNavigationOriginType
);

export function isValidEvidenceNavigationOriginType(origin: string): origin is EvidenceNavigationOriginType {
  return ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES.includes(origin as EvidenceNavigationOriginType);
}

export interface NavigationOriginContext {
  originType: EvidenceNavigationOriginType;
  screenId: string;
  routeId?: string | null;
  reportId?: string | null;
  reportSectionId?: string | null;
  returnRoute?: string | null;
}
