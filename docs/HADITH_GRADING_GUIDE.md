# Hadith Grading Guide (Phase 4)

## Attributed Scholar Grading

Every Hadith grade must be stored with an explicit attribution:

- `grade`: `SAHIH`, `HASAN`, `DAIF`, `MAWDU`, `MUTAWATIR`, `AHAD`, `SCHOLAR_DISAGREEMENT`
- `grader`: Scholar name (e.g. `Imam al-Bukhari`, `Al-Albani`)
- `gradingSourceId`: Source reference document ID
- `reviewStatus`: `APPROVED`

Single un-attributed grade strings are strictly rejected by the Evidence Validator.
