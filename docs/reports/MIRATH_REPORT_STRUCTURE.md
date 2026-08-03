# MIZAN Mirath Report Structure (Phase 14)

Mirath (Islamic Inheritance) reports adapt `CalculationResultEnvelope` items into the standard 12-section sequence via `MirathReportSectionAdapter`.

## Section Mappings

- `SECTION 01 (REPORT_IDENTITY)`: Mirath Title, calculationId, resultId, selected madhhab.
- `SECTION 03 (INPUT_SUMMARY)`: Gross estate, approved pre-distribution deductions (funeral, debts, wasiyyah), entered heirs count.
- `SECTION 06 (DETAILED_BREAKDOWN)`: Heir distribution table detailing heir label, count, status, exact share fraction (`1/8`, `1/4`, etc.), monetary allocation, decision code.
- `SECTION 07 (EXCLUDED_AND_REVIEW_ITEMS)`: Blocked heirs (`HIJAB_RESULT`) with blocker relationship (`blockedBy`).
- `SECTION 09 (TOTALS_AND_RECONCILIATION)`: Verifies sum of shares equals 100% (or Awl/Radd adjustment), verifies zero allocation to blocked heirs.
