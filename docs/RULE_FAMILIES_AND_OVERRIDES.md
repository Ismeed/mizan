# MIZAN Rule Families and Overrides Standard (Phase 5)

## Overview

A **Rule Family** groups related rules that address the same jurisprudential topic.
Using Rule Families allows MIZAN to maintain one primary base rule and attach narrow
madhhab-specific overrides without duplicating condition trees or decision structures.

---

## Structure of a Rule Family

```typescript
export interface RuleFamily {
  ruleFamilyId: string;           // e.g. "FAM-MIRATH-RADD-01"
  titleEn: string;                // e.g. "Surplus Return (Radd) Family"
  module: 'MIRATH' | 'ZAKAT';
  ruleType: string;
  baseRuleId: string;             // The default rule ID for this family
  overrideRuleIds: string[];      // Array of override rule IDs
  conflictPolicy: 'SPECIFICITY_WINS' | 'PRIORITY_WINS' | 'STOP_AND_LOG';
  schemaVersion: string;
}
```

---

## How Override Selection Works

When `MadhhabOverrideService` evaluates candidate matched rules in a family:

1. **Step 1 — Calculate Specificity Rank**:
   - Single Madhhab Scope (`['MALIKI']`) = Rank 3
   - `ALL_SUNNI` Scope = Rank 2
   - `ALL_SCHOOLS` Scope = Rank 1

2. **Step 2 — Highest Rank Wins**:
   - For a Maliki calculation, a Rank 3 Maliki override rule beats a Rank 2 `ALL_SUNNI` base rule.

3. **Step 3 — Condition Count Tie-Breaker**:
   - If two rules have identical Madhhab scope rank, the rule with more leaf conditions (more specific) wins.

4. **Step 4 — Explicit Priority Tie-Breaker**:
   - If condition counts are equal, higher `rule.scope.priority` wins.

5. **Step 5 — Conflict Detection**:
   - If specificity rank, condition count, AND priority are equal, resolution halts and logs a governance conflict.

---

## Governance Rules

- An override rule MUST set `identity.ruleFamilyId` to the base rule's family ID.
- An override rule SHOULD reference the base rule ID in `identity.overridesRuleId`.
- Override rules MUST be scholar-reviewed before entering `PRODUCTION` status.
