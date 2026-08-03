# MIZAN Standard Mirath and Zakat Report Architecture (Phase 14)

## Fundamental Principle
**EVERY MIRATH OR ZAKAT REPORT MUST FOLLOW THE SAME CORE SEQUENCE.**

Every report is generated exclusively from the immutable `CalculationResultEnvelope` produced in Phase 13.
No report renderer recalculates Islamic results.

---

## The 12 Canonical Report Sections

| # | Permanent Section ID | Description |
|---|---|---|
| 01 | `REPORT_IDENTITY` | MIZAN header, report title, IDs, status, madhhab, language, currency |
| 02 | `CALCULATION_PROFILE` | Immutable profile snapshot governing the calculation |
| 03 | `INPUT_SUMMARY` | Normalized user facts & inputs processed by rule engine |
| 04 | `VALIDATION_AND_SCOPE` | Input validation status and automated rule engine coverage scope |
| 05 | `RESULT_SUMMARY` | High-level outcome, primary items, reconciliation status |
| 06 | `DETAILED_BREAKDOWN` | Complete step-by-step breakdown of shares or zakat categories |
| 07 | `EXCLUDED_AND_REVIEW_ITEMS` | Blocked heirs (Hijab), exempt assets, items below nisab, review gates |
| 08 | `EVIDENCE_AND_EXPLANATIONS` | Ordered evidence citations (Qur’an, Hadith, Fiqh) & approved explanations |
| 09 | `TOTALS_AND_RECONCILIATION` | Financial & share sum verification, remainders, and rounding adjustments |
| 10 | `WARNINGS_AND_ACTIONS` | System disclosures, exchange rate disclosures, and required user actions |
| 11 | `TECHNICAL_AND_AUDIT_DETAILS` | Checksums, snapshot IDs, trace IDs, rule engine versioning |
| 12 | `DECLARATION_AND_CLOSING` | Closing statements, Shariah board attribution, verification QR reference |

---

## Standard Report Envelope Structure

```json
{
  "reportId": "report_12345",
  "reportVersion": "1.0.0",
  "reportSchemaVersion": "1.0.0",
  "reportType": "DETAILED_REPORT",
  "source": {
    "calculationId": "calc_12345",
    "resultId": "result_12345",
    "resultVersion": "1.0.0",
    "resultSchemaVersion": "1.0.0",
    "resultSnapshotId": "snapshot_12345"
  },
  "module": "MIRATH",
  "status": "GENERATED",
  "renderingContext": {
    "languageTag": "en",
    "locale": "en-US",
    "direction": "LTR",
    "reportCurrencyCode": "USD",
    "selectedMadhhab": "HANAFI",
    "reportTemplateId": "STANDARD-MIZAN-REPORT-001",
    "reportTemplateVersion": "1.0.0",
    "format": "PDF",
    "renderingMode": "DETAILED"
  },
  "sections": [ /* 12 canonical sections in order */ ],
  "integrity": {
    "reportChecksum": "sha256_hash",
    "resultChecksum": "sha256_hash",
    "isImmutable": true
  }
}
```

---

## Confirmed Invariants

1. **Zero Recalculation**: Renderers consume the Result Envelope; they never recalculate fractions or rates.
2. **Language & Currency Neutrality**: Changing language or currency produces a rendered view without altering exact fractions, rates, or checksums.
3. **Immutability**: Every generated report creates an immutable report snapshot.
