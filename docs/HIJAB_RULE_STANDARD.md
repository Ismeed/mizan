# MIZAN — Hijab Rule Standard

## Overview

The Hijab Rule System defines how the MIZAN Mirath engine determines whether an heir is:
- Completely excluded from inheritance (**Hijab Hirman** / حجب حرمان)
- Partially reduced in share (**Hijab Nuqsan** / حجب نقصان)
- Fully eligible to inherit

Every Hijab determination is governed by a canonical, versioned `HijabRuleRecord`.

---

## Rule ID Format

```
HIJAB-<BLOCKED_HEIR>-<BLOCKING_CAUSE>-NNN
```

Examples:
- `HIJAB-FULLBROTHERS-SONS-001` — Son blocks Full Brothers
- `HIJAB-MOTHER-SONS-001` — Son reduces Mother's share
- `HIJAB-PATERNALGRANDFATHERS-FATHER-001` — Father blocks Paternal Grandfather

All segments must be uppercase. NNN is a three-digit zero-padded sequence number.

---

## Rule Categories

### HAJB_BIL_WASF (Blocking by Attribute)
The heir is blocked due to a personal attribute or impediment:
- Murder of the deceased
- Different religion (non-Muslim heir)
- Slavery (in classical fiqh texts)

### HAJB_BIL_SHAKHSY (Blocking by Person)
The heir is blocked by the presence of another specific person:
- Son blocks Full Brother
- Father blocks Paternal Grandfather
- Son reduces Mother's share from 1/3 to 1/6

---

## Effect Types

| Effect | Code | Meaning |
|---|---|---|
| Complete exclusion | `HIRMAN` | Heir receives nothing |
| Share reduction | `NUQSAN` | Heir's share is reduced |

`NUQSAN` rules MUST specify `reducedFraction`.  
`HIRMAN` rules MUST NOT specify `reducedFraction`.

---

## Resolution Priority

When both `HIRMAN` and `NUQSAN` rules apply to the same heir:
- **HIRMAN always takes precedence**
- The heir is completely excluded

---

## Governance Requirements

Every HijabRule record requires:
1. At least one `evidenceRef` (Quran, Hadith, Fiqh book, Consensus, or Scholarly Opinion)
2. A `governance.status` — must not be `PRODUCTION` without full scholar review
3. Test fixtures MUST be tagged `TEST_ONLY_FIXTURE` and may not have `status: PRODUCTION`
4. Every new rule must pass Zod schema validation via `HijabRuleRecordSchema`

---

## Madhhab Scope

| Scope | Meaning |
|---|---|
| `ALL_SCHOOLS` | Applies to all five madhhabs |
| `ALL_SUNNI` | Applies to Hanafi, Maliki, Shafi'i, Hanbali |
| `HANAFI` | Applies to Hanafi only |
| `MALIKI` | Applies to Maliki only |
| `SHAFII` | Applies to Shafi'i only |
| `HANBALI` | Applies to Hanbali only |
| `JAFARI` | Applies to Jafari only — fully isolated |

---

## Schema Version

Current schema version: **6.0.0**

See `hijab-rule.types.ts` and `hijab-rule.schema.ts` for the full type and Zod schema.
