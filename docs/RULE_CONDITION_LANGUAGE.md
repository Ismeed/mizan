# MIZAN Declarative Condition Language Guide

## Overview

All rule applicability conditions in MIZAN are written in a purely declarative JSON tree structure. Executable code or dynamic scripts inside condition objects are strictly prohibited.

---

## Condition Structure

A condition is either a **Leaf** or a **Group**:

### 1. Condition Leaf

```json
{
  "type": "LEAF",
  "factsPath": "heirs.husband.count",
  "operator": "GREATER_THAN",
  "value": 0,
  "description": "Husband is present in heir count"
}
```

### 2. Condition Group

```json
{
  "type": "GROUP",
  "operator": "ALL",
  "conditions": [
    { "type": "LEAF", "factsPath": "heirs.husband.count", "operator": "GREATER_THAN", "value": 0 },
    { "type": "LEAF", "factsPath": "computed.hasChildren", "operator": "IS_FALSE" }
  ],
  "description": "Husband present AND no children present"
}
```

---

## Supported Operators

| Operator | Comparison Description |
|---|---|
| `EQUALS` | Exact equality (`===`) |
| `NOT_EQUALS` | Inequality (`!==`) |
| `GREATER_THAN` | Numeric `>` |
| `GREATER_THAN_OR_EQUAL` | Numeric `>=` |
| `LESS_THAN` | Numeric `<` |
| `LESS_THAN_OR_EQUAL` | Numeric `<=` |
| `IN` | Value is member of array |
| `NOT_IN` | Value is not member of array |
| `EXISTS` | Field path is defined and non-null |
| `NOT_EXISTS` | Field path is undefined or null |
| `IS_TRUE` | Boolean `=== true` |
| `IS_FALSE` | Boolean `=== false` |
| `CONTAINS` | Array field contains value |
| `DOES_NOT_CONTAIN` | Array field does not contain value |
| `BETWEEN_INCLUSIVE` | Numeric `value >= lo && value <= hi` |
| `MATCHES_ENUM` | Enum string equality |
