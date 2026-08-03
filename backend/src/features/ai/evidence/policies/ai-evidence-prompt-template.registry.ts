export const AI_EVIDENCE_PROMPT_TEMPLATE_001 = {
  templateId: 'AI-EVIDENCE-EXPLANATION-001',
  version: '1.0.0',
  status: 'APPROVED',
  task: 'Explain the supplied verified evidence in relation to the supplied authoritative result.',
  requiredBehaviour: [
    'Identify the evidence reference.',
    'State which decision aspect the evidence supports.',
    'Explain the approved relationship.',
    'Preserve the selected madhhab.',
    'Preserve exact calculation values.',
    'Disclose translation status.',
    'Label generated clarification.',
  ],
  prohibitedBehaviour: [
    'Recalculate.',
    'Invent evidence.',
    'Change the result.',
    'Infer another madhhab.',
    'Create unsupported quotations.',
  ],
};
