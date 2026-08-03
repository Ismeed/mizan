# MIZAN Verified AI Evidence Context Contract

## Provider-Neutral Context Envelope Structure

```json
{
  "aiEvidenceContextId": "UNIQUE-CONTEXT-ID",
  "contextSchemaVersion": "1.0.0",
  "task": "EXPLAIN_VERIFIED_EVIDENCE",
  "contextType": "RESULT_EVIDENCE_CONTEXT",
  "binding": "CALCULATION_BOUND",
  "completenessStatus": "FULLY_VERIFIED",
  "navigationContext": {},
  "calculationContext": {},
  "reportContext": null,
  "subjectContext": {},
  "decisionContext": {},
  "ruleContext": {},
  "evidenceContext": {},
  "explanationContext": {},
  "comparativeContext": null,
  "localizationContext": {},
  "currencyContext": null,
  "approvedResponsePolicy": {},
  "restrictions": {},
  "provenance": {},
  "integrity": {}
}
```

---

## 20 Assembly Gates
1. Navigation payload schema validation
2. User authentication validation
3. Calculation or report authorization check
4. Calculation Profile immutability verification
5. Result Snapshot integrity check
6. Result Item existence check
7. Applied Rule reference check
8. Rule version resolution
9. Result Evidence Link validation
10. Evidence version resolution
11. Evidence-to-rule relationship validation
12. Evidence-to-decision support type check
13. Selected madhhab scope compatibility check
14. Knowledge Release membership validation
15. Explanation relationship validation
16. Translation approval status verification
17. Source-access policy check
18. Component checksum generation
19. Historical-version requirements check
20. Strict AI restriction policy attachment
