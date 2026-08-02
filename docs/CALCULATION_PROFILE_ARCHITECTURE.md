# MIZAN Calculation Profile Architecture

> Single, authoritative, immutable context specification governing every Mirath and Zakat calculation in MIZAN.

## Core Flow

```
User Preferences (Mutable)
       │
       ├─► Calculation-Level Overrides (Optional)
       │
       ▼
CalculationProfileResolverService (Deterministic Priority Order)
       │
       ▼
Immutable Calculation Profile Snapshot (Frozen SHA-256 Checksum)
       │
       ├─► Deterministic Rule Engine (@mizan/shared)
       ├─► Structured Calculation Result & DB Storage
       ├─► Report Generator & PDF Ingestion Engine
       └─► AI Assistant Context (Restricted Perspective)
```

## Key Architectural Principles

1. **Strict Separation of Mutable Settings vs. Frozen Snapshots**: Changing a user's settings later will never alter a previous calculation result or historical PDF report.
2. **Deterministic Preference Priority**:
   - Priority 1: `CALCULATION_OVERRIDE` (calculation-specific override)
   - Priority 2: `USER_PROFILE` (user's saved settings)
   - Priority 3: `SYSTEM_DEFAULT` (approved system defaults: MALIKI / NGN / en / NG)
3. **No Hidden Cross-Madhhab Fallback**: If a decision rule is unsupported under the selected Madhhab, the system returns `UNSUPPORTED_FOR_SELECTED_MADHHAB` and stops that decision. It NEVER silently applies another Madhhab's position.
4. **Currency Safety**: ISO 4217 currencies dictate input interpretation and formatted display output. Currency choice NEVER alters Islamic fractions, Nisab thresholds, or Zakat rates.
