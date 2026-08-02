# MIZAN Typed Decision System Guide

## Overview

Rule execution outcomes in MIZAN are represented as discriminated union members called **Rule Decisions**. Every decision payload is strictly typed. Executable code or dynamic scripts inside decision payloads are prohibited.

---

## Complete Decision Type Catalog

### 1. Mirath Decisions

- `ASSIGN_FIXED_FRACTION`: Assigns a Quranic fixed fraction (Fard) to an heir group. Fraction uses exact rational `{ n: number, d: number }`.
- `ASSIGN_RESIDUARY_STATUS`: Assigns Asabah (residuary) status (`ASABAH_BIN_NAFS`, `ASABAH_BIL_GHAIR`, `ASABAH_MAL_GHAIR`).
- `BLOCK_HEIR`: Applies Hijab hirman (complete blocking) or Hijab nuqsan (partial reduction).
- `REDUCE_SHARE`: Proportional reduction (`AWL`) or share adjustment.
- `CHANGE_ELIGIBILITY`: Modifies heir eligibility (`ELIGIBLE`, `INELIGIBLE`, `CONDITIONAL`).

### 2. Zakat Decisions

- `SET_ZAKAT_RATE`: Sets exact rational rate (e.g. `{ n: 1, d: 40 }`) and basis points (`250`).
- `SET_NISAB_METHOD`: Sets Nisab commodity (`GOLD`, `SILVER`, `LOWER`, `HIGHER`).
- `APPLY_LIVESTOCK_SCHEDULE`: Binds a livestock count schedule record.
- `SET_HOLDING_PERIOD`: Sets Hawl requirement in lunar months (`12`).
- `AGGREGATE_ASSET_CATEGORIES`: Combines asset categories for Nisab check.
- `EXCLUDE_ASSET_CATEGORY`: Excludes an exempt asset category.

### 3. Governance Decisions

- `REQUIRE_SCHOLAR_REVIEW`: Triggers mandatory scholar review gate.
- `ADD_WARNING`: Attaches a user-visible warning.
- `STOP_CALCULATION_BRANCH`: Halts execution of the current branch.
