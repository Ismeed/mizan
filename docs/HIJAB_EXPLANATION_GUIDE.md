# MIZAN — Hijab Explanation Guide

## Overview

The `HijabExplanationService` generates multilingual explanations for hijab decisions.
These explanations are used in:
- Calculation reports
- PDF exports
- Mobile UI display
- AI Assistant context (via approved explanation references only)

---

## Critical Constraints

> **NEVER**: Generate Islamic rulings from AI for display to users.  
> **ALWAYS**: Source explanations from scholar-approved `HijabExplanationRef` records.

All explanations are either:
1. Retrieved from approved `EvidenceTranslation` records (stored in DB, scholar-reviewed)
2. Generated as structural fallbacks from rule metadata (English only, labeled `isApproved: false`)

---

## Explanation Lookup Priority

For each heir status, the explanation service searches explanation refs in this order:

```
1. Exact match: languageCode + audienceType
2. Exact language match: any audienceType
3. English fallback: languageCode = 'en'
4. Structural fallback: generated from rule metadata (isApproved = false)
```

---

## Audience Types

| Audience | Description |
|---|---|
| `GENERAL_USER` | Simple, accessible language for lay users |
| `SCHOLAR` | Technical Islamic legal terminology |
| `TECHNICAL` | System-level explanation for developers |

---

## Explanation Payload

```typescript
interface HijabExplanationPayload {
  heirKey: string;
  effectType: 'HIRMAN' | 'NUQSAN' | 'ELIGIBLE';
  languageCode: string;
  headlineText: string;    // Short display headline
  bodyText: string;        // Full explanation body
  evidenceLabel?: string;  // e.g. "Quran 4:11"
  audienceType: string;
  isApproved: boolean;     // false = structural fallback
  fallbackApplied: boolean;
}
```

---

## API Endpoint

```
POST /api/hijab/explain
Authorization: Bearer <token>

Body:
{
  "heirStatuses": [...],     // From HijabResolutionOutput.heirStatuses
  "madhhab": "HANAFI",
  "languageCode": "ar",      // Optional: defaults to "en"
  "audienceType": "GENERAL_USER"  // Optional
}

Response:
{
  "explanations": [HijabExplanationPayload, ...]
}
```

---

## Adding Approved Explanations

To add a scholar-approved explanation for a hijab rule:

1. Create an `EvidenceRecord` of type `EXPLANATORY_NOTE` for the explanation text
2. Add an `EvidenceTranslation` record with:
   - `evidence_id` = the EvidenceRecord ID
   - `language_tag` = the language code (e.g. `ar`, `en`, `fr`)
   - `review_status` = `APPROVED`
   - `text` = JSON payload: `{ "headline": "...", "body": "..." }`
3. Add a `HijabExplanationRef` to the relevant `HijabRuleRecord` pointing to this evidence
4. The explanation service will automatically use the approved text

---

## Eligible Heirs

For heirs who are not blocked, the service generates a structural eligible message:
- English: `"{heirKey} is eligible to inherit"`
- Arabic: `"{heirKey}: وارث مستحق"`
- Other languages: English fallback with `fallbackApplied: true`
