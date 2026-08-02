# Rule-to-Evidence Linking Guide (Phase 4)

## Structured Rule Evidence Links

Replaces flat evidence ID string arrays with `StructuredRuleEvidenceLink` objects:

```typescript
interface StructuredRuleEvidenceLink {
  linkId: string;
  rule: { ruleId: string; ruleVersion: string };
  evidence: { evidenceId: string; evidenceVersion: string };
  relationship: {
    type: 'PRIMARY_EVIDENCE' | 'SECONDARY_EVIDENCE' | 'EXPLANATORY_EVIDENCE';
    supports: 'APPLICABILITY' | 'DECISION' | 'RATE' | 'FRACTION' | 'BLOCKING' | 'ELIGIBILITY' | 'EXCEPTION' | 'EXPLANATION';
  };
  display: { showInResult: boolean; showInPdf: boolean; showInAIContext: boolean; displayPriority: number };
}
```

Rules are linked only to evidence explicitly approved for their specific calculation decision.
