# Hadith Numbering Guide (Phase 4)

## Multi-Edition Numbering Policy

Because Hadith numbering varies across publishers and digital reference datasets (e.g. Darussalam vs. In-Book vs. USC-MSA), MIZAN enforces explicit edition numbering objects:

```json
{
  "canonicalHadithNumber": "1454",
  "editionSpecificNumbers": [
    {
      "sourceEditionId": "DARUSSALAM_EN",
      "editionName": "Darussalam English Edition",
      "number": "1454",
      "book": "24",
      "chapter": "1"
    }
  ]
}
```

Numbering conflicts are never resolved by AI or silent merging.
