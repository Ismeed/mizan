# MIZAN Madhhab Branch Strategy Standard (Phase 5)

## Overview

The `MadhhabBranchStrategy` enum classifies how a selected rule relates to other madhhab positions
within the MIZAN Canonical Rule Registry.

---

## Strategy Definitions

### 1. `SHARED_BASE`
- **Definition**: A single base rule applies universally because all covered schools share an identical jurisprudential position.
- **Example**: Quranic prescribed share of 1/8 for the wife when children exist (`RULE-MIRATH-WIFE-CHILD-1-8`).

### 2. `PARTIAL_AGREEMENT`
- **Definition**: Multiple schools agree on a position, but at least one school diverges.
- **Example**: `ALL_SUNNI` consensus rules that apply to Hanafi, Maliki, Shafi'i, and Hanbali, but not Ja'fari.

### 3. `NARROW_OVERRIDE`
- **Definition**: A narrow, additive, or modifying rule that overrides a specific aspect of a base rule for a single madhhab.
- **Example**: Maliki rule allowing the surviving spouse to receive surplus from Radd (`RULE-MIRATH-RADD-MALIKI`).

### 4. `FULL_BRANCH`
- **Definition**: Completely separate rule logic where the jurisprudential structure differs fundamentally between schools.
- **Example**: Ja'fari Class 1/2/3 priority rules vs Sunni Asaba residual distribution rules.

---

## Registry Representation

In database records and API responses:
- `MadhhabRuleBranch` Prisma model records the explicit strategy tag for every rule family branch.
- `MadhhabResolutionTrace` tags every applied rule with its resolved `branchStrategy`.
- Mobile and PDF reports render appropriate Madhhab indicator badges based on the strategy tag.
