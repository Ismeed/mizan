# MIZAN Rule Identifier Standard Guide

## Format Overview

Every rule record in MIZAN must use a permanent, immutable identifier conforming to the following 5-segment pattern:

```
<MODULE>-<RULE_TYPE>-<SUBJECT>-<CONTEXT>-<SEQUENCE>
```

### Segment Breakdown

| Segment | Allowed Values / Pattern | Example |
|---|---|---|
| `MODULE` | `MIRATH`, `ZAKAT`, `SHARED`, `SYS` | `MIRATH` |
| `RULE_TYPE` | Registered type name in uppercase | `FIXED_SHARE` |
| `SUBJECT` | Target entity or subject | `SPOUSE` |
| `CONTEXT` | Primary application context | `NO_CHILDREN` |
| `SEQUENCE` | 3-digit zero-padded number (`001`–`999`) | `001` |

---

## Complete Examples

- `MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001`
- `MIRATH-FIXED_SHARE-SPOUSE-WITH_CHILDREN-002`
- `MIRATH-HIJAB-GRANDFATHER-FATHER-001`
- `ZAKAT-NISAB-SILVER_THRESHOLD-ALL-001`
- `ZAKAT-RATE-STANDARD-ALL-001`

---

## Validation Regex

```typescript
export const RULE_ID_REGEX =
  /^(MIRATH|ZAKAT|SHARED|SYS)-([A-Z][A-Z0-9_]*)-([A-Z][A-Z0-9_]*)-([A-Z][A-Z0-9_]*)-([0-9]{3})$/;
```

## Programmatic API

```typescript
import { validateRuleId, parseRuleId, buildRuleId } from '@mizan/shared';

// Validate
validateRuleId("MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001"); // OK

// Parse
const parsed = parseRuleId("MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001");

// Build
const ruleId = buildRuleId("ZAKAT", "RATE", "STANDARD", "ALL", 1);
```
