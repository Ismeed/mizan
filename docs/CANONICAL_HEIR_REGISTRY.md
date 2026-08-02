# MIZAN — Canonical Heir Registry Architecture

## Overview

The **Canonical Heir Registry** ensures every heir, potential heir, family relationship, Hijab blocker, Hijab target, calculation result, report, evidence explanation, and AI context uses permanent machine-readable identifiers (`FULL_BROTHER`) instead of translated or user-facing labels (`"Full Brother"`, `"Ɗan’uwa na uwa da uba"`, `"الأخ الشقيق"`).

---

## Core Principles

1. **Entity identity != Inheritance eligibility**: A canonical heir entity record describes identity, lineage, and presentation metadata ONLY.
2. **Permanent Identifiers**: All canonical heir IDs are uppercase ASCII English technical terms with underscores (e.g. `FULL_BROTHER`, `PATERNAL_GRANDFATHER`).
3. **Immutability**: Identifiers never change when languages change, UI is redesigned, or madhhab is selected.
4. **Controlled Normalization (Q1)**: Legacy inputs (`heirs.fullBrothers.count`) are normalized immediately into canonical ID facts (`heirs.FULL_BROTHER.count`).
5. **No Invented Rulings**: The registry does not determine entitlement, blocking, or fixed shares.

---

## Registry Architecture

```
User Input / Screen Label
        ↓
HeirNormalizationService (Alias Resolution)
        ↓
Permanent Canonical Heir ID (e.g. FULL_BROTHER)
        ↓
HeirEntityRecord (Registry Lookup)
        ↓
Rule Engine & Hijab Evaluation
        ↓
Result with Permanent Canonical Heir ID
        ↓
Localized Display & PDF Reports
```
