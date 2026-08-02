# MIZAN Madhhab Rule Scope Governance Standard (Phase 5)

## Overview

The `RuleMadhhabScope` field defines which Islamic jurisprudence schools a rule applies to.
This document governs how rule authors and Sharia reviewers assign madhhab scope tags to rules.

---

## Supported Madhhab Scopes

| Scope Tag | Description | Included Schools |
|---|---|---|
| `HANAFI` | Hanafi Jurisprudence | Hanafi |
| `MALIKI` | Maliki Jurisprudence | Maliki |
| `SHAFII` | Shafi'i Jurisprudence | Shafi'i |
| `HANBALI` | Hanbali Jurisprudence | Hanbali |
| `JAFARI` | Ja'fari Jurisprudence (Shia Ithna Ashari) | Ja'fari |
| `ALL_SUNNI` | Consensus across four Sunni schools | Hanafi, Maliki, Shafi'i, Hanbali |
| `ALL_SCHOOLS` | Consensus across all five recognized schools | All 5 schools |

---

## Authoring Guidelines

1. **Default to `ALL_SUNNI` or `ALL_SCHOOLS` where genuine consensus exists**:
   - Do NOT duplicate a rule five times when all five schools agree.
   - Assign `madhhabScope: ['ALL_SCHOOLS']` for indisputable Quranic fractional shares.

2. **Use explicit single madhhab scope for divergent rulings**:
   - Assign `madhhabScope: ['MALIKI']` for Maliki-specific spouse Radd inclusion.
   - Assign `madhhabScope: ['HANBALI']` for Hanbali grandfather-brother blocking rule.

3. **Isolate Ja'fari rules completely**:
   - Ja'fari class-based inheritance rules MUST use `madhhabScope: ['JAFARI']`.
   - Never tag a Ja'fari-specific structural rule with `ALL_SUNNI` or `ALL_SCHOOLS`.

---

## Auditing and Verification

- The `MadhhabFilterService` automatically rejects rules whose scope does not cover the calculation's target madhhab.
- The `MadhhabJafariBranchTest` unit test suite continuously verifies that Sunni rules never leak into Ja'fari calculations and vice versa.
