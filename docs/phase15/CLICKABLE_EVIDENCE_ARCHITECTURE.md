# MIZAN Standard Clickable Evidence and AI Assistant Navigation Architecture (Phase 15)

## Fundamental Principle

> **EVERY DISPLAYED EVIDENCE REFERENCE MUST CARRY A STRUCTURED, VERSIONED, VALIDATED NAVIGATION PAYLOAD.**

A reference must never be represented only as visible text such as:
- “Qur’an 4:11”
- “Hadith No. 1234”
- “See page 45”
- “According to the Maliki school”
- “View evidence”

The visible citation is **presentation**. The structured navigation payload is the **authoritative machine-readable link**.

---

## 1. System Flow

```
User clicks evidence reference
        ↓
Client reads structured navigation payload
        ↓
Payload schema validation
        ↓
Authenticated server request
        ↓
Calculation and result access validation
        ↓
Historical version resolution
        ↓
Rule, evidence, and explanation verification
        ↓
Madhhab and knowledge-release validation
        ↓
AI context package assembly
        ↓
AI Assistant opens in evidence-explanation mode
        ↓
Assistant explains without recalculating
```

---

## 2. Permanent Actions Registry

- `OPEN_AI_EVIDENCE`
- `OPEN_AI_RESULT_EVIDENCE`
- `OPEN_AI_RULE_EVIDENCE`
- `OPEN_AI_HIJAB_EVIDENCE`
- `OPEN_AI_MIRATH_SHARE_EVIDENCE`
- `OPEN_AI_ZAKAT_EVIDENCE`
- `OPEN_AI_NISAB_EVIDENCE`
- `OPEN_AI_LIVESTOCK_EVIDENCE`
- `OPEN_AI_AGRICULTURE_EVIDENCE`
- `OPEN_AI_REPORT_EVIDENCE`
- `OPEN_EVIDENCE_READER`
- `OPEN_RELATED_EXPLANATION`
- `OPEN_RELATED_RULE_DETAILS`
- `OPEN_COMPARATIVE_MADHHAB_EVIDENCE`

---

## 3. Mandatory AI Safety Restrictions (12 Must-Nots)

1. `mustNotRecalculate`
2. `mustNotChangeDecision`
3. `mustNotChangeMadhhab`
4. `mustNotInventEvidence`
5. `mustNotInventSourceText`
6. `mustNotInventTranslation`
7. `mustNotInventRule`
8. `mustNotInventException`
9. `mustNotPresentCommentaryAsEvidence`
10. `mustNotUseUnapprovedComparativeContext`
11. `mustUseProvidedVerifiedContext`
12. `mustDiscloseInsufficientContext`

---

## 4. Server-Side Context Hydration

The client submits permanent IDs and rendering preferences. The server resolves:
- Calculation profile & snapshot
- Result item & applied rule
- Authoritative evidence & translation
- Checksums & HMAC signature
- Mandatory AI safety restrictions

Client-submitted text, translations, or rulings are strictly rejected.
