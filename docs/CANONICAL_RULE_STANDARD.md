# MIZAN Canonical Structured Rule Standard

## Executive Summary

The **MIZAN Canonical Structured Rule Standard** (Phase 3) establishes the authoritative contract, validation engine, matching pipeline, resolution system, execution model, and governance lifecycle for all Islamic financial rules (Mirath & Zakat) within the MIZAN platform.

> [!IMPORTANT]
> **No Islamic rulings are authored or generated during Phase 3.** This phase delivers the machine-readable schema, validation system, database models, resolution engine, and governance gates required for future scholar-approved rules.

---

## Key Principles

1. **Permanent Rule Identifiers**: Every rule is identified by an immutable 5-segment identifier matching `<MODULE>-<RULE_TYPE>-<SUBJECT>-<CONTEXT>-<SEQUENCE>` (e.g. `MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001`).
2. **Declarative Condition Trees**: Rule conditions are strictly declarative JSON logic. Executable code inside conditions or decisions is strictly prohibited.
3. **Exact Rational Arithmetic**: Authoritative share fractions use `{ n: number, d: number }` integer rational pairs. Floating-point arithmetic is prohibited for authoritative values.
4. **Specificity-First Resolution**: Within a rule family, the rule with the highest condition count wins. Conflict ties stop and require governance review — random resolution is prohibited.
5. **Full Evidence Traceability**: Every execution trace links back to verified primary sources (`QURAN`, `HADITH`, `FIQH_BOOK`).
6. **Isolated Test Fixtures**: Synthetic test fixtures are tagged `TEST_ONLY_FIXTURE` and `isTestFixture: true`. They can never take `PRODUCTION` status or participate in live user calculations.

---

## Core System Architecture

```
                    ┌─────────────────────────┐
                    │    RuleRegistryService  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    RuleMatcherService   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  RuleResolutionService  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   RuleExecutorService   │
                    └─────────────────────────┘
```

---

## Detailed Documentation Directory

- [Rule Identifier Guide](./RULE_IDENTIFIER_GUIDE.md)
- [Rule Condition Language](./RULE_CONDITION_LANGUAGE.md)
- [Rule Decision Types](./RULE_DECISION_TYPES.md)
- [Madhhab Rule Scope](./MADHHAB_RULE_SCOPE.md)
- [Rule Families & Overrides](./RULE_FAMILIES_AND_OVERRIDES.md)
- [Rule Conflict Resolution](./RULE_CONFLICT_RESOLUTION.md)
- [Rule Versioning Guide](./RULE_VERSIONING_GUIDE.md)
- [Rule Authoring Guide](./RULE_AUTHORING_GUIDE.md)
- [Rule Review Guide](./RULE_REVIEW_GUIDE.md)
- [Rule Testing Guide](./RULE_TESTING_GUIDE.md)
- [Rule Engine Integration](./RULE_ENGINE_INTEGRATION.md)
