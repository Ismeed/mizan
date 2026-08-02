# MIZAN — Hijab Audit Guide

## Overview

The `HijabAuditService` writes an immutable `HijabResolutionAudit` record
for every calculation that invokes the hijab resolver. This audit trail is
permanent and supports:

- Knowledge auditing
- Scholar review of decisions
- Rule traceability
- Calculation report generation
- PDF evidence citation
- Governance review

---

## Audit Record Structure

The `hijab_resolution_audits` table stores:

| Column | Description |
|---|---|
| `calculation_id` | Links to the parent Calculation record |
| `madhhab` | The madhhab used for resolution |
| `profile_id` | The Calculation Profile ID (optional) |
| `present_heirs_json` | All heirs and their counts at calculation time |
| `rules_evaluated_count` | Total number of HijabRules evaluated |
| `rules_applied_count` | Number of rules that resulted in a blocking decision |
| `heir_statuses_json` | Full per-heir status array |
| `resolution_trace_json` | Complete trace of all rules evaluated |
| `has_partial_resolution` | Whether any NUQSAN reductions were applied |
| `resolved_at` | ISO timestamp of resolution |

---

## Rule Links

The `hijab_resolution_audit_rule_links` junction table links:
- Each audit record to the specific `HijabRule` DB records that were applied
- Includes `was_applied`, `blocked_heir_key`, and `effect_type` per link

This allows governance reviewers to query which rules were applied across
all calculations for a given madhhab or heir type.

---

## Audit Resilience

> **CRITICAL**: Audit write failures MUST NEVER crash a calculation.

The `HijabAuditService.writeAudit` method catches all errors internally
and logs them without re-throwing. If the audit fails:
- The calculation result is still returned to the user
- The failure is logged for operational monitoring
- No user-visible error is generated from the audit subsystem

---

## Querying Audit Records

### By Calculation ID

```typescript
const records = await HijabAuditService.getAuditForCalculation('calc-abc-123');
```

### API Endpoint

```
GET /api/hijab/audit/:calculationId
Authorization: Bearer <token>

Response:
{
  "calculationId": "calc-abc-123",
  "records": [
    {
      "id": "...",
      "calculation_id": "calc-abc-123",
      "madhhab": "HANAFI",
      "rules_evaluated_count": 5,
      "rules_applied_count": 2,
      "heir_statuses_json": [...],
      "resolution_trace_json": [...],
      "resolved_at": "2026-08-01T12:00:00Z",
      "ruleLinks": [...]
    }
  ]
}
```

---

## Governance Queries

Scholars and governance administrators can query audit records by madhhab
to review how hijab decisions are being made across the platform:

```typescript
const records = await HijabAuditService.getAuditsByMadhhab('HANAFI', 100, 0);
```

This supports periodic knowledge auditing and helps identify:
- Rules that are never being applied (may need review or removal)
- High-frequency blocking scenarios (may need explanation content)
- Madhhab-specific patterns for quality assurance

---

## Immutability Guarantee

Audit records are written once via `create` and never updated.
The `HijabResolutionAuditRuleLink` records use `upsert` with an empty
`update` clause — ensuring no duplication without risk of overwriting.
