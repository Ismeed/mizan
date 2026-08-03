# MIZAN Zakat Report Structure (Phase 14)

Zakat reports adapt `CalculationResultEnvelope` items into the standard 12-section sequence via `ZakatReportSectionAdapter`.

## Section Mappings

- `SECTION 01 (REPORT_IDENTITY)`: Zakat Title, calculationId, resultId, selected madhhab.
- `SECTION 03 (INPUT_SUMMARY)`: Asset categories evaluated (monetary, precious metals, livestock, agriculture).
- `SECTION 06 (DETAILED_BREAKDOWN)`: Monetary obligations (`ZAKAT_CATEGORY_RESULT` at rate 1/40), livestock obligations (`LIVESTOCK_OBLIGATION_RESULT`), agriculture obligations (`AGRICULTURE_OBLIGATION_RESULT`).
- `SECTION 07 (EXCLUDED_AND_REVIEW_ITEMS)`: Items below nisab (`BELOW_NISAB`), exempt items, review-required items.
- `SECTION 09 (TOTALS_AND_RECONCILIATION)`: Verifies monetary total sum, retains physical obligations separately.
