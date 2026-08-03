# MIZAN Livestock Zakat Schedule and Obligation Rule Engine Architecture

**Phase 9 — Structured Islamic Financial Knowledge Programme**

> [!IMPORTANT]
> Livestock Zakat in MIZAN MUST be represented through structured, versioned count-based schedules.
> It MUST NOT be represented as an ordinary percentage of market value unless a separate, verified,
> scholar-approved rule explicitly requires monetary valuation.

---

## 1. Primary Objectives

The MIZAN Livestock Zakat engine ensures:
- Every obligation traces to permanent identifiers (`scheduleId`, `bandId`, `obligationDefinitionId`, `animalClassId`).
- Deterministic calculation via pure, versioned TypeScript engines.
- Strict separation between **what the user owns** (herd facts) and **what the approved schedule requires** (due animal class).
- AI Assistant explains approved calculations and evidence only — it NEVER calculates.
- Zero production thresholds or obligations are populated during infrastructure setup; all synthetic test data carries `isTestFixture: true` and `fixtureTag: 'TEST_ONLY_FIXTURE'`.

---

## 2. 12-Step Resolution Pipeline

```
1. Validate animal type
       ↓
2. Validate herd count
       ↓
3. Validate required facts
       ↓
4. Evaluate livestock eligibility rules
       ↓
5. Evaluate holding period (Hawl) rules
       ↓
6. Evaluate grazing/feeding (Sa'imah) rules
       ↓
7. Evaluate commercial-purpose classification
       ↓
8. Resolve selected madhhab schedule
       ↓
9. Apply count schedule / band matching
       ↓
10. Resolve obligation definition
       ↓
11. Validate result
       ↓
12. Attach evidence and explanations
```

---

## 3. Canonical Identifiers

### Animal Species Identifiers
- `CAMEL` — Camels (Ibil)
- `CATTLE` — Cattle and Buffalo (Baqar)
- `SHEEP` — Sheep (Dha'n)
- `GOAT` — Goats (Ma'iz)
- `SHEEP_OR_GOAT` — Combined Sheep and Goats (Ghanam)
- `OTHER_LIVESTOCK_REVIEW_REQUIRED` — Unclassified species

### Schedule Identifier Format
`ZAKAT-LIVESTOCK-<ANIMAL_TYPE>-<CONTEXT>-<SEQUENCE>`  
Example: `ZAKAT-LIVESTOCK-CATTLE-STANDARD-001`

---

## 4. 19 Eligibility Result Codes

| Code | Description |
|---|---|
| `ELIGIBLE_FOR_LIVESTOCK_SCHEDULE` | Herd meets all eligibility criteria for schedule resolution |
| `NOT_ELIGIBLE_FOR_LIVESTOCK_SCHEDULE` | Herd is ineligible for schedule resolution |
| `BELOW_APPROVED_THRESHOLD` | Herd count is below the minimum threshold (Nisab) |
| `HOLDING_PERIOD_INCOMPLETE` | Hawl (lunar year) not completed |
| `FEEDING_OR_GRAZING_CONDITION_NOT_MET` | Grazing (Sa'imah) condition not met |
| `COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE` | Animals held for trade — routed to business inventory rule |
| `JOINT_OWNERSHIP_REVIEW_REQUIRED` | Joint ownership (Khulata) requires scholar review |
| `INSUFFICIENT_FACTS` | Required input facts missing |
| `UNSUPPORTED_FOR_SELECTED_MADHHAB` | Category not supported in selected madhhab |
| `SCHOLAR_REVIEW_REQUIRED` | Complex case requiring scholar review |
| `WORK_ANIMALS_EXEMPT` | Animals held for work are exempt |
| `PERSONAL_USE_EXEMPT` | Personal use animals exempt |
| `INVALID_ANIMAL_COUNT` | Count is negative or non-integer |
| `INVALID_ANIMAL_TYPE` | Unknown animal type ID |
| `SCHEDULE_NOT_FOUND` | No schedule record registered |
| `SCHEDULE_GAP_DETECTED` | Count falls in unmapped schedule gap |
| `SCHEDULE_OVERLAP_DETECTED` | Count matched multiple overlapping bands |
| `DUPLICATE_HERD_DETECTED` | Possible duplicate herd entry |
| `CROSS_CATEGORY_DOUBLE_COUNTING_RISK` | Overlap between livestock and business inventory |

---

## 5. Non-Negotiable Rules

1. Never calculate livestock Zakat as a generic percentage by default.
2. Never invent thresholds or obligations without approved scholar sources.
3. Never round animal counts or accept fractional animals.
4. Never allow AI to calculate or alter obligations.
5. All synthetic test fixtures MUST carry `isTestFixture: true` and `fixtureTag: 'TEST_ONLY_FIXTURE'`.
