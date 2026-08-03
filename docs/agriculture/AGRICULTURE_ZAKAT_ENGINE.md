# MIZAN Agriculture Zakat Engine Specification (Phase 10)

## Architecture Overview

The MIZAN Agriculture Zakat Engine provides a deterministic, versioned, scholar-governed calculation pipeline for agricultural produce Zakat.

### 10-Step Deterministic Calculation Pipeline

```mermaid
graph TD
    A[1. Validate Produce Type] --> B[2. Normalize Facts & Convert Units]
    B --> C[3. Evaluate Eligibility]
    C --> D[4. Classify Irrigation Method]
    D --> E[5. Resolve Nisab Threshold]
    E --> F[6. Compare Harvest Quantity to Nisab]
    F --> G[7. Aggregate Multi-Harvest if Applicable]
    G --> H[8. Resolve Applicable Rate]
    H --> I[9. Compute Obligatory Produce Quantity]
    I --> J[10. Assemble Result & Execution Trace]
```

## Key Principles

1. **ExactFraction Arithmetic**: All rates (1/10 rain-fed, 1/20 irrigated) and quantities are stored and computed as exact fractions (`{ numerator: bigint, denominator: bigint }`). Floating-point numbers are prohibited.
2. **Obligation in Produce Weight**: Obligation is expressed in produce weight/volume (e.g. Wasq / kg of Wheat), not as monetary currency.
3. **No Hawl Required**: Agriculture Zakat is due at harvest time (Surah Al-An'am 6:141).
4. **Synthetic Fixtures**: All Nisab, rate, and aggregation policy records are tagged `TEST_ONLY_FIXTURE`.
