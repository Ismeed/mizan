# MIZAN Currency, Monetary Value and Exchange-Rate Architecture

## Core Architectural Principle

**CURRENCY MUST NEVER CHANGE ISLAMIC CALCULATION LOGIC.**

Changing the user's currency must never alter:
- An inheritance fraction
- An heir's eligibility or blocked status
- A Hijab decision
- An applied Mirath rule
- A Zakat rate
- A livestock schedule obligation
- An agriculture obligation fraction
- A Nisab methodology
- A madhhab-specific decision
- A religious evidence reference
- The knowledge release used

---

## Currency Roles

MIZAN distinguishes 7 currency roles:

| Role | Purpose |
|---|---|
| `USER_PREFERRED_CURRENCY` | Default currency for future calculations and UI |
| `CALCULATION_CURRENCY` | Authoritative currency selected for consolidated monetary results |
| `SOURCE_ASSET_CURRENCY` | Original currency in which an estate item or Zakat asset was entered |
| `VALUATION_CURRENCY` | Currency used when valuing non-cash assets (gold, inventory, etc.) |
| `REPORT_CURRENCY` | Currency in which a report/PDF is rendered |
| `SETTLEMENT_CURRENCY` | Currency in which distribution or payment practically occurs |
| `REFERENCE_CURRENCY` | Internal reference currency for valuation |

---

## Baseline Currency Registry

The baseline registry supports 8 governed currencies:

1. **NGN** — Nigerian Naira (`₦`)
2. **USD** — US Dollar (`$`)
3. **EUR** — Euro (`€`)
4. **GBP** — British Pound (`£`)
5. **SAR** — Saudi Riyal (`ر.س`)
6. **AED** — UAE Dirham (`د.إ`)
7. **GHS** — Ghanaian Cedi (`GH₵`)
8. **KES** — Kenyan Shilling (`KSh`)

---

## Immutable Monetary Snapshots

Every calculation freezes an immutable monetary snapshot (`MonetaryCalculationSnapshot`) containing:
- Original monetary values
- Approved exchange rate snapshots
- Asset valuation snapshots
- Converted money values
- Exact religious fractions & rates
- Applied rounding policies
- Monetary remainder reconciliation
- SHA-256 checksum

Re-opening or re-rendering a historical calculation preserves the original snapshot and exchange rates — current exchange rates or user preference changes can **never** mutate historical calculations.
