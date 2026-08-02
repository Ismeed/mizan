# MIZAN — Heir Identifier Standard

## Identifier Rules

Every canonical heir identifier MUST conform to the following strict rules:

- **Case**: Uppercase ASCII only (`FULL_BROTHER`)
- **Separator**: Underscore (`_`)
- **Language**: English technical terminology
- **Permanence**: Never changes once published to PRODUCTION

---

## Forbidden Content in Identifiers

Identifiers MUST NOT contain:
- Madhhab names (`MALIKI_FULL_BROTHER` ❌)
- Translation strings (`Dan_Uwa` ❌, `الأخ_الشقيق` ❌)
- Share fractions or rulings (`FULL_BROTHER_RESIDUE` ❌)
- Database row IDs (`heir_12345` ❌)
- Version suffix (`FULL_BROTHER_V2` ❌)

---

## 37 Baseline Identifiers

### Spouses (2)
`HUSBAND`, `WIFE`

### Ascendants (10)
`FATHER`, `MOTHER`, `PATERNAL_GRANDFATHER`, `MATERNAL_GRANDFATHER`, `PATERNAL_GRANDMOTHER`, `MATERNAL_GRANDMOTHER`, `PATERNAL_GREAT_GRANDFATHER`, `MATERNAL_GREAT_GRANDFATHER`, `PATERNAL_GREAT_GRANDMOTHER`, `MATERNAL_GREAT_GRANDMOTHER`

### Descendants (8)
`SON`, `DAUGHTER`, `SONS_SON`, `SONS_DAUGHTER`, `SONS_SONS_SON`, `SONS_SONS_DAUGHTER`, `DAUGHTERS_SON`, `DAUGHTERS_DAUGHTER`

### Siblings (7)
`FULL_BROTHER`, `FULL_SISTER`, `PATERNAL_BROTHER`, `PATERNAL_SISTER`, `MATERNAL_BROTHER`, `MATERNAL_SISTER`, `MATERNAL_HALF_SIBLING`

### Siblings' Descendants (4)
`FULL_BROTHERS_SON`, `FULL_BROTHERS_SONS_SON`, `PATERNAL_BROTHERS_SON`, `PATERNAL_BROTHERS_SONS_SON`

### Uncles & Descendants (6)
`FATHERS_FULL_BROTHER`, `FATHERS_FULL_BROTHERS_SON`, `FATHERS_FULL_BROTHERS_SONS_SON`, `FATHERS_PATERNAL_BROTHER`, `FATHERS_PATERNAL_BROTHERS_SON`, `FATHERS_PATERNAL_BROTHERS_SONS_SON`
