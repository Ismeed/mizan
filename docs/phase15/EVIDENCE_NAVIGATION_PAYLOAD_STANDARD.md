# Standard Evidence Navigation Payload (Phase 15)

## Payload Structure

```json
{
  "navigationId": "NAV-RESULT-9a8f-...",
  "payloadVersion": "1.0.0",
  "action": "OPEN_AI_RESULT_EVIDENCE",
  "origin": {
    "originType": "RESULT_ITEM",
    "screenId": "CALCULATION_RESULT",
    "routeId": null,
    "reportId": null,
    "reportSectionId": null,
    "returnRoute": null
  },
  "calculation": {
    "calculationId": "CALC-001",
    "calculationProfileId": "PROF-001",
    "resultId": "RES-001",
    "resultVersion": "1.0.0",
    "resultSnapshotId": "SNAP-001",
    "resultItemId": "ITEM-001"
  },
  "subject": {
    "subjectType": "HEIR",
    "subjectId": "DAUGHTER",
    "subjectVersion": "1.0.0",
    "instanceId": "INST-001"
  },
  "rule": {
    "ruleId": "MIRATH-DAUGHTER-SHARE-SINGLE",
    "ruleVersion": "1.0.0",
    "ruleFamilyId": "FAMILY-DAUGHTER",
    "ruleType": "MIRATH_FIXED_SHARE"
  },
  "evidence": {
    "evidenceId": "QURAN-004-011-011",
    "evidenceVersion": "1.0.0",
    "evidenceType": "QURAN",
    "resultEvidenceLinkId": "LINK-001",
    "supports": "FRACTION"
  },
  "explanation": {
    "explanationId": "EXP-001",
    "explanationVersion": "1.0.0"
  },
  "profile": {
    "selectedMadhhab": "MALIKI",
    "languageTag": "ha",
    "locale": "ha-NG",
    "currencyCode": "NGN"
  },
  "versions": {
    "knowledgeReleaseVersion": "1.0.0",
    "ruleEngineVersion": "1.0.0"
  },
  "security": {
    "issuedAt": "2026-08-03T12:00:00.000Z",
    "payloadChecksum": "a1b2c3d4...",
    "signature": "e5f67890..."
  }
}
```
