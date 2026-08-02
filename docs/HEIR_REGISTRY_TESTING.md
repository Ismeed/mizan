# MIZAN — Heir Registry Testing Guide

## Test Suite Coverage

- `canonical-heir-id.test.ts`: Validates identifier syntax, upper-case ASCII constraints, rejection of forbidden strings.
- `heir-normalization.test.ts`: Alias matching, exact Canonical Heir ID matching, ambiguity detection for `"Grandfather"`.
- `heir-group.test.ts`: Group definition loading, member resolution per madhhab.
- `heir-availability.test.ts`: Madhhab input support checks, `MATERNAL_GRANDFATHER` safeguards.
- `heir-validation.test.ts`: Structural contradiction checks, lineage self-reference rejection.
- `heir-integration.test.ts`: Q1 controlled one-way normalization adapter, Q3 `PATERNAL_BROTHER` alias rules.
