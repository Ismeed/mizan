# MIZAN — Hijab Madhhab Variance Guide

## Overview

Madhhab-specific variance in inheritance blocking is handled through **separate HijabRule records**
with scoped `madhhabScope` values. There is no runtime branching code for madhhab differences —
the variance is encoded in the rule data itself.

---

## Variance Representation Strategy

| Scenario | Strategy |
|---|---|
| All five schools agree on a block | Single rule with `madhhabScope: ['ALL_SCHOOLS']` |
| All four Sunni schools agree | Single rule with `madhhabScope: ['ALL_SUNNI']` |
| Only one madhhab applies a block | Rule scoped to that specific madhhab |
| Madhhabs differ on effect type | Separate HIRMAN and NUQSAN rules per madhhab |
| Jafari has unique blocking position | Rule scoped to `['JAFARI']` — fully isolated |

---

## Registry Filtering

The `HijabRuleRegistryService.loadRulesForMadhhab` method filters by:
1. `governance_status IN ('PRODUCTION')` — only live rules
2. **Application-layer scope check**: rule's `madhhabScope` must include:
   - The exact madhhab code (e.g. `'HANAFI'`), OR
   - `'ALL_SCHOOLS'`, OR
   - `'ALL_SUNNI'` (only for Hanafi, Maliki, Shafi'i, Hanbali)

**Jafari calculations only receive rules explicitly scoped to `JAFARI` or `ALL_SCHOOLS`.**
`ALL_SUNNI` rules are never returned for Jafari.

---

## Known Variance Areas

The following are areas where madhhab variance in hijab exists in classical fiqh.
Actual rule content must be authored by qualified Islamic scholars following the
`HIJAB_RULE_STANDARD.md` governance process.

> **IMPORTANT**: No rule records are pre-populated by this system.  
> The following is documentation of known variance areas only, not jurisprudential rulings.

### Paternal Grandfather and Siblings

- In some schools, the paternal grandfather inherits alongside brothers in certain scenarios
- Variance exists between schools on how grandfather and siblings interact
- This requires separate rule records per school

### Children of Daughters

- Sunni schools generally exclude children of daughters when sons are present
- Jafari fiqh has distinct positions on this matter
- Separate Jafari rules required

### Maternal Relatives

- Significant variance exists across schools regarding maternal relatives
- Each school requires its own scoped rule set

---

## Adding a New Madhhab-Specific Rule

1. Author the rule following `HIJAB_RULE_STANDARD.md`
2. Set `madhhabScope` to the appropriate scope
3. Set `hijabRuleId` using the HIJAB-<BLOCKED>-<CAUSE>-NNN format
4. Submit for scholar review following `SCHOLAR_REVIEW_GUIDE.md`
5. Only set `governance_status: PRODUCTION` after full approval

---

## Testing Madhhab Variance

Use the `hijab-madhhab-variance.test.ts` test suite to verify:
- Scope filtering returns correct rules per madhhab
- Jafari rules do not bleed into Sunni calculations
- ALL_SUNNI rules are not returned for Jafari calculations
- Madhhab-specific HIRMAN/NUQSAN decisions are correctly isolated
