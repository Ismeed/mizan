# MIZAN Multilingual Explanation & Localization Architecture

> Phase 11 — MIZAN Structured Islamic Financial Knowledge Implementation Programme

## Core Architectural Principle

**CALCULATION LOGIC MUST REMAIN LANGUAGE-NEUTRAL.**

Changing the user's language or locale must NEVER alter:
- The selected Madhhab
- The applicable rule ID or version
- The conditions evaluated
- The rule decision
- An inheritance fraction
- A Hijab decision
- A Zakat rate
- A Nisab threshold
- An agriculture obligation
- A livestock schedule
- An eligible or blocked status
- The evidence selected
- The calculated monetary value
- The knowledge release used

Language controls presentation and explanation ONLY.

---

## System Flow

```
Deterministic Rule Engine
        ↓
Structured Result with Permanent IDs
        ↓
Approved Explanation ID
        ↓
Explanation Resolver Service
        ↓
Selected Language & Locale (with Fallback Policy)
        ↓
Safe Variable Interpolation
        ↓
User-Facing Explanation Card / PDF / AI Context
```

---

## 1. Permanent Explanation Identifiers

All explanation records are identified using stable, permanent IDs formatted as:
`<MODULE>-EXPLANATION-<TOPIC>-<CONTEXT>-<SEQUENCE>`

Examples:
- `MIRATH-EXPLANATION-SPOUSE-SHARE-001`
- `ZAKAT-EXPLANATION-NISAB-RESULT-001`
- `ZAKAT-EXPLANATION-LIVESTOCK-OBLIGATION-001`
- `ZAKAT-EXPLANATION-AGRICULTURE-IRRIGATION-001`

Identifiers are uppercase, ASCII, hyphen-separated, language-neutral, and carry no translated words, numbers, rates, or currencies inside the ID.

---

## 2. 19 Canonical Explanation Types

1. `CALCULATION_DECISION`
2. `ELIGIBILITY`
3. `FIXED_SHARE`
4. `RESIDUARY_STATUS`
5. `HIJAB_COMPLETE_EXCLUSION`
6. `HIJAB_PARTIAL_EFFECT`
7. `NISAB_RESULT`
8. `HOLDING_PERIOD_RESULT`
9. `ZAKAT_RATE`
10. `LIVESTOCK_SCHEDULE_RESULT`
11. `AGRICULTURE_IRRIGATION_RESULT`
12. `AGRICULTURE_AGGREGATION_RESULT`
13. `DEDUCTION_RESULT`
14. `EVIDENCE_EXPLANATION`
15. `WARNING`
16. `REVIEW_REQUIRED`
17. `UNSUPPORTED_CASE`
18. `EDUCATIONAL_NOTE`

---

## 3. Governance Pipeline

Every translation record passes through a strict 4-stage governance workflow:
`DRAFT → LINGUISTIC_REVIEW → SHARIA_TERMINOLOGY_REVIEW → TECHNICAL_VALIDATION → APPROVED → PRODUCTION`

Synthetic test fixtures carry `isTestFixture: true` and `translationStatus: 'DRAFT'` during the infrastructure phase. No production religious rulings are automatically generated or published.

---

## 4. Supported Languages & Locales

- **English (`en`)**: Primary baseline fallback language (`en-NG`, `en-GB`, `en-US`)
- **Arabic (`ar`)**: Full RTL support, Arabic terminology (`ar-SA`, `ar-AE`)
- **Hausa (`ha`)**: Native Hausa fiqh terminology (`ha-NG`)
- **Extensible**: Designed for French (`fr`), Swahili (`sw`), Yoruba (`yo`), Igbo (`ig`)

---

## 5. Non-Negotiable Rules

1. Never put religious calculation logic inside translation files.
2. Never use translated labels as permanent identifiers.
3. Never allow language changes to alter a calculation decision.
4. Never replace exact fractions (`{ numerator, denominator }`) with rounded decimals.
5. Never call AI as a silent translation fallback.
