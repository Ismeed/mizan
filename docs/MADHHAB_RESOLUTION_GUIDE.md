# MIZAN Madhhab-Specific Rule Resolution Guide (Phase 5)

## Overview

The MIZAN Madhhab-Specific Rule Resolution Engine ensures that every Islamic financial
or inheritance calculation is evaluated against scholar-approved rules specific to the
user's immutable **Calculation Profile** (`CalculationProfile.preferences.madhhab`).

The resolution algorithm avoids duplicating rules across five schools by supporting a
unified 4-level branching model:

```
                  ┌────────────────────────────────────────┐
                  │ 1. Filter by Target Madhhab            │
                  │    (MadhhabFilterService)              │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │ 2. Declarative Condition Matching     │
                  │    (RuleMatcherService)                │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │ 3. Resolve Family Overrides            │
                  │    (MadhhabOverrideService)            │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │ 4. Final Specificity & Priority Tie    │
                  │    (RuleResolutionService)             │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │ 5. Audit Log Written                   │
                  │    (MadhhabResolutionAudit)            │
                  └────────────────────────────────────────┘
```

---

## The 4 Branching Strategies

| Strategy | When Used | Example |
|---|---|---|
| `SHARED_BASE` | Position is identical across all schools | Base Quranic shares (Wife 1/8 with child) |
| `PARTIAL_AGREEMENT` | Position shared by selected schools | `ALL_SUNNI` consensus rules |
| `NARROW_OVERRIDE` | One or more schools differ on a specific detail | Maliki spouse Radd inclusion |
| `FULL_BRANCH` | Structural divergence in calculation logic | Ja'fari 3-Class Priority System |

---

## Madhhab Scoping Rules

Every rule record carries a `madhhabScope` array in `rule.scope.madhhabScope`:

- `['HANAFI']` — applies strictly to Hanafi school
- `['MALIKI']` — applies strictly to Maliki school
- `['SHAFII']` — applies strictly to Shafi'i school
- `['HANBALI']` — applies strictly to Hanbali school
- `['JAFARI']` — applies strictly to Ja'fari (Shia) school
- `['ALL_SUNNI']` — applies to Hanafi, Maliki, Shafi'i, and Hanbali (excludes Ja'fari)
- `['ALL_SCHOOLS']` — applies universally across all 5 schools

---

## Overriding Specificity Ranking

Within a rule family, when multiple candidate rules match, `MadhhabOverrideService` selects the winner using scope specificity rank:

- **Rank 3**: Explicit single-madhhab match (e.g. `['MALIKI']`)
- **Rank 2**: `ALL_SUNNI` match for a Sunni school
- **Rank 1**: `ALL_SCHOOLS` universal match

An explicit single-madhhab override (Rank 3) **always** beats an `ALL_SUNNI` base rule (Rank 2) or an `ALL_SCHOOLS` rule (Rank 1).

---

## Determinism & Invariants

1. **Profile Lock**: Resolution reads from the immutable `CalculationProfile` frozen at calculation initialization — never from live mutable settings.
2. **Jafari Isolation**: Jafari rules NEVER match Sunni calculations; `ALL_SUNNI` rules NEVER match Jafari calculations.
3. **No Random Selection**: If two rules tie in specificity and priority, resolution halts with `RULE_CONFLICT_DETECTED` and logs to governance.
4. **Audit Trail**: Every calculation writes a permanent `MadhhabResolutionAudit` DB record.
