# MIZAN Rule Conflict Resolution Guide

## Non-Negotiable Governance Policy

> [!CAUTION]
> **MIZAN NEVER resolves rule conflicts randomly.** If two incompatible rules match the same calculation context with equal precedence, the engine MUST halt execution, log a `RULE_CONFLICT_DETECTED` audit record, and surface a mandatory scholar review gate.

---

## Conflict Detection Categories

1. **Declared Incompatibility**: Rule A lists Rule B in `identity.incompatibleWithRules`.
2. **Database Conflict Record**: A pair registered in the `rule_conflicts` DB table.
3. **Precedence Tie**: Two rules in the same family match with equal condition count and equal priority.

---

## Resolution Workflow

```
[Matched Rules] ──► Scan for Incompatibilities ──► Conflict Found?
                                                        │
                                          ┌─────────────┴─────────────┐
                                          ▼                           ▼
                                       (YES)                         (NO)
                                          │                           │
                               ┌──────────┴──────────┐     ┌──────────┴──────────┐
                               │ Halt Calculation    │     │ Select Winner by    │
                               │ Log Audit Conflict  │     │ Specificity         │
                               │ Surface Gate        │     └─────────────────────┘
                               └─────────────────────┘
```
