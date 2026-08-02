# MIZAN Rule Testing Guide

## Test Suite Organization

Phase 3 introduces 7 dedicated test suites in `backend/src/__tests__/rules/`:

1. `rule-identifier.test.ts`: Validates 5-segment ID regex, parsing, building.
2. `rule-schema.test.ts`: Validates Zod schema, validator service, checksum service.
3. `condition-evaluator.test.ts`: Validates all 16 condition operators and group logic.
4. `madhhab-scope.test.ts`: Validates madhhab filtering and cross-madhhab isolation.
5. `rule-override.test.ts`: Validates specificity-first resolution and conflict tie-breaks.
6. `rule-arithmetic.test.ts`: Validates rational arithmetic extensions (`subFrac`, `mulFrac`, `divFrac`, etc.).
7. `rule-traceability.test.ts`: Validates executor, decision handlers, trace output.

---

## Running Rule Tests

```bash
cd backend
npx jest src/__tests__/rules/
```
