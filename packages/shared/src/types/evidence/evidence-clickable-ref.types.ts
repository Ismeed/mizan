/**
 * Clickable Reference Navigation Contract (Phase 4)
 * Deep-linking navigation payload from calculation result to AI Assistant.
 */

export interface ClickableEvidenceParams {
  calculationId?: string;
  calculationProfileId?: string;
  ruleId: string;
  ruleVersion: string;
  evidenceId: string;
  evidenceVersion: string;
  explanationId?: string;
  madhhab: string;
  languageTag: string;
  knowledgeReleaseVersion: string;
}

export interface ClickableEvidenceNavigation {
  action: 'OPEN_AI_EVIDENCE';
  route: '/ai-assistant/evidence';
  params: ClickableEvidenceParams;
}
