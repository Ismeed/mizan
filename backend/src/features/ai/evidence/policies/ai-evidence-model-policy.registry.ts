export const GEMINI_EVIDENCE_MODEL_POLICY_001 = {
  modelPolicyId: 'GEMINI-EVIDENCE-MODEL-POLICY-001',
  version: '1.0.0',
  providerId: 'GEMINI',
  approvedModelIdentifiers: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
  defaultModel: 'gemini-1.5-pro',
  taskScopes: ['EVIDENCE_EXPLANATION', 'EVIDENCE_CLARIFICATION'],
  structuredOutputRequired: true,
  externalSearchAllowed: false,
  toolUseAllowed: false,
  temperaturePolicy: 'LOW_VARIANCE',
  fallbackProviderPolicy: 'NO_SILENT_FALLBACK',
  governance: {
    status: 'APPROVED',
    reviewedBy: ['SCHOLAR_1', 'SECURITY_LEAD'],
  },
};
