/**
 * MIZAN — Permanent Evidence Navigation Action Registry (Phase 15)
 * Strictly controlled registry of evidence navigation actions.
 * Arbitrary action strings are prohibited in production payloads.
 */

export const EvidenceNavigationAction = {
  /** Open one evidence record in the AI Assistant */
  OPEN_AI_EVIDENCE: 'OPEN_AI_EVIDENCE',
  /** Open evidence in the context of one Result Item */
  OPEN_AI_RESULT_EVIDENCE: 'OPEN_AI_RESULT_EVIDENCE',
  /** Open evidence in the context of one applied rule */
  OPEN_AI_RULE_EVIDENCE: 'OPEN_AI_RULE_EVIDENCE',
  /** Open evidence supporting a Hijab decision */
  OPEN_AI_HIJAB_EVIDENCE: 'OPEN_AI_HIJAB_EVIDENCE',
  /** Open evidence supporting a Mirath share decision */
  OPEN_AI_MIRATH_SHARE_EVIDENCE: 'OPEN_AI_MIRATH_SHARE_EVIDENCE',
  /** Open evidence supporting a Zakat category decision */
  OPEN_AI_ZAKAT_EVIDENCE: 'OPEN_AI_ZAKAT_EVIDENCE',
  /** Open evidence supporting a nisab result */
  OPEN_AI_NISAB_EVIDENCE: 'OPEN_AI_NISAB_EVIDENCE',
  /** Open evidence supporting a livestock schedule decision */
  OPEN_AI_LIVESTOCK_EVIDENCE: 'OPEN_AI_LIVESTOCK_EVIDENCE',
  /** Open evidence supporting an agriculture decision */
  OPEN_AI_AGRICULTURE_EVIDENCE: 'OPEN_AI_AGRICULTURE_EVIDENCE',
  /** Open evidence from a specific report section */
  OPEN_AI_REPORT_EVIDENCE: 'OPEN_AI_REPORT_EVIDENCE',
  /** Open the authoritative evidence reader without starting an AI conversation */
  OPEN_EVIDENCE_READER: 'OPEN_EVIDENCE_READER',
  /** Open the approved explanation connected to the evidence */
  OPEN_RELATED_EXPLANATION: 'OPEN_RELATED_EXPLANATION',
  /** Open safe rule details for the applied rule */
  OPEN_RELATED_RULE_DETAILS: 'OPEN_RELATED_RULE_DETAILS',
  /** Open an approved comparative madhhab record */
  OPEN_COMPARATIVE_MADHHAB_EVIDENCE: 'OPEN_COMPARATIVE_MADHHAB_EVIDENCE',
} as const;

export type EvidenceNavigationAction =
  (typeof EvidenceNavigationAction)[keyof typeof EvidenceNavigationAction];

export const ALL_EVIDENCE_NAVIGATION_ACTIONS: EvidenceNavigationAction[] = Object.values(
  EvidenceNavigationAction
);

export function isValidEvidenceNavigationAction(action: string): action is EvidenceNavigationAction {
  return ALL_EVIDENCE_NAVIGATION_ACTIONS.includes(action as EvidenceNavigationAction);
}
