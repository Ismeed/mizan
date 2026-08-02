# MIZAN Madhhab Resolution Audit Guide (Phase 5)

## Overview

Every calculation performed by MIZAN automatically writes an immutable `MadhhabResolutionAudit`
record to the database. This audit record provides 100% transparency for scholar reviews, legal audits,
and user verification.

---

## Audit Record Schema

```prisma
model MadhhabResolutionAudit {
  id                        String    @id @default(cuid())
  calculation_id            String
  madhhab                   String
  profile_id                String?
  rules_evaluated_count     Int       @default(0)
  rules_after_filter_count  Int       @default(0)
  branches_selected_json    Json      @default("[]")
  resolution_trace_json     Json      @default("[]")
  conflict_detected         Boolean   @default(false)
  conflict_details_json     Json      @default("[]")
  resolved_at               DateTime  @default(now())
}
```

---

## API Audit Access

### Endpoint
`GET /api/admin/rules/resolution/audit/:calculationId`

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "cld123xyz",
    "calculation_id": "CALC-2026-001",
    "madhhab": "MALIKI",
    "profile_id": "PROF-987",
    "rules_evaluated_count": 42,
    "rules_after_filter_count": 28,
    "branches_selected_json": [
      {
        "ruleFamilyId": "FAM-RADD-01",
        "branchStrategy": "NARROW_OVERRIDE",
        "selectedRuleId": "RULE-RADD-MALIKI-01"
      }
    ],
    "resolution_trace_json": [ ... ],
    "conflict_detected": false,
    "resolved_at": "2026-08-02T07:00:00.000Z"
  }
}
```

---

## Key Invariants

- **Write Once, Read Many**: Audit records are written at calculation time and are never updated or deleted.
- **Complete Traceability**: Every evaluated rule, whether selected or overridden, appears in `resolution_trace_json` with exact selection reasons.
