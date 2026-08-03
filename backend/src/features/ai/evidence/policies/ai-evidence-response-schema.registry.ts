export const AI_EVIDENCE_RESPONSE_SCHEMA_001 = {
  schemaId: 'AI-EVIDENCE-RESPONSE-001',
  version: '1.0.0',
  status: 'APPROVED',
  jsonSchema: {
    type: 'object',
    properties: {
      aiResponseId: { type: 'string' },
      responseSchemaVersion: { type: 'string', enum: ['1.0.0'] },
      status: {
        type: 'string',
        enum: [
          'COMPLETED',
          'COMPLETED_WITH_LIMITATIONS',
          'INSUFFICIENT_VERIFIED_CONTEXT',
          'REFUSED_BY_POLICY',
          'INVALID_PROVIDER_RESPONSE',
        ],
      },
      language: {
        type: 'object',
        properties: {
          requestedLanguageTag: { type: 'string' },
          resolvedLanguageTag: { type: 'string' },
          fallbackUsed: { type: 'boolean' },
        },
        required: ['requestedLanguageTag', 'resolvedLanguageTag', 'fallbackUsed'],
      },
      content: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          evidenceReference: { type: 'string' },
          whatTheEvidenceSupports: { type: 'string' },
          approvedExplanationSummary: { type: 'string' },
          aiClarification: { type: 'string' },
          sourceDisclosure: { type: 'string' },
          limitations: { type: 'array', items: { type: 'string' } },
        },
        required: [
          'title',
          'evidenceReference',
          'whatTheEvidenceSupports',
          'approvedExplanationSummary',
          'aiClarification',
          'sourceDisclosure',
          'limitations',
        ],
      },
      sourceUsage: {
        type: 'object',
        properties: {
          evidenceIdsUsed: { type: 'array', items: { type: 'string' } },
          evidenceVersionsUsed: { type: 'array', items: { type: 'string' } },
          explanationIdsUsed: { type: 'array', items: { type: 'string' } },
          ruleIdsUsed: { type: 'array', items: { type: 'string' } },
          retrievedRecordIdsUsed: { type: 'array', items: { type: 'string' } },
        },
      },
      claims: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            claimId: { type: 'string' },
            claimType: { type: 'string' },
            text: { type: 'string' },
            validationStatus: { type: 'string' },
          },
        },
      },
      suggestedFollowUps: { type: 'array', items: { type: 'string' } },
      integrity: {
        type: 'object',
        properties: {
          responseChecksum: { type: 'string' },
        },
        required: ['responseChecksum'],
      },
    },
    required: ['aiResponseId', 'responseSchemaVersion', 'status', 'language', 'content', 'integrity'],
  },
};
