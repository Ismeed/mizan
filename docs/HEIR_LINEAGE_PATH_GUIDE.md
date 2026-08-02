# MIZAN — Lineage Path Guide

## Purpose

Lineage paths provide a machine-readable representation of how an heir is related to the deceased.

---

## Lineage Path Format

```json
{
  "heirId": "PATERNAL_GRANDFATHER",
  "lineagePath": ["FATHER", "FATHER"]
}
```

```json
{
  "heirId": "FULL_BROTHER",
  "lineagePath": [{ "sharedParent": "BOTH" }]
}
```

---

## Constraints

- Lineage paths DO NOT infer Islamic inheritance eligibility.
- Eligibility comes strictly from scholar-approved Rule Engine rules.
- Circular self-references are prohibited.
