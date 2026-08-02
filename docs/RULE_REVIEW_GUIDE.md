# MIZAN Rule Governance & Review Guide

## Governance Lifecycle Gates

Every rule record must pass four mandatory review gates before reaching `PRODUCTION`:

```
┌────────┐     ┌─────────────────┐     ┌───────────────┐     ┌──────────────────────┐     ┌──────────┐     ┌────────────┐
│ DRAFT  │ ──► │ ACADEMIC_REVIEW │ ──► │ SHARIA_REVIEW │ ──► │ TECHNICAL_VALIDATION │ ──► │ APPROVED │ ──► │ PRODUCTION │
└────────┘     └─────────────────┘     └───────────────┘     └──────────────────────┘     └──────────┘     └────────────┘
```

---

## Review Responsibilities

| Role | Gate | Primary Audit Criteria |
|---|---|---|
| `ACADEMIC_REVIEWER` | Academic Review | Source provenance, translation accuracy, book edition verification |
| `SHARIA_REVIEWER` | Sharia Review | Legal reasoning, madhhab attribution correctness, evidence strength |
| `TECHNICAL_REVIEWER` | Technical Validation | Condition path validity, fraction reduced terms, checksum integrity |
| `PUBLICATION_ADMIN` | Production Release | Release membership check, conflict detector scan, manifest seal |
