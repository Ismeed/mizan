# MIZAN Rule Authoring Guide

## Overview

This guide details how academic researchers and data editors author new rule records for the MIZAN platform.

---

## Authoring Checklist

1. **Permanent Rule ID**: Ensure the ID conforms to `<MODULE>-<RULE_TYPE>-<SUBJECT>-<CONTEXT>-<SEQUENCE>`.
2. **Schema Compliance**: Validate JSON against `canonical-rule.schema.json` or run `RuleValidatorService.validate()`.
3. **Declarative Conditions**: Use registered fact paths (`MIRATH_CONDITION_PATHS` or `ZAKAT_CONDITION_PATHS`). Do not write custom JS expressions.
4. **Exact Fractions**: Express all fractions as `{ "n": integer, "d": positive_integer }`.
5. **Evidence References**: Attach at least one primary evidence reference (`QURAN`, `HADITH`, `FIQH_BOOK`).
6. **Initial Status**: Save record as `DRAFT`.
7. **Test Fixtures**: If creating synthetic test data, set `isTestFixture: true` and `fixtureTag: "TEST_ONLY_FIXTURE"`.
