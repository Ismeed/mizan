# MIZAN Standard Calculation Result Contract (Phase 13)

## Architectural Principle
**EVERY RULE ENGINE RESULT MUST FOLLOW ONE CONSISTENT, VERSIONED, MACHINE-READABLE, AUDITABLE RESPONSE FORMAT.**

---

## 1. Six Contract Levels
1. **Condition Evaluation Result**: Evaluation of a single declarative condition (`SingleConditionEvaluationResult`).
2. **Rule Match Result**: Match trace of a resolved rule against canonical facts.
3. **Rule Execution Result**: Authoritative decision produced by an executed rule (`RuleExecutionResult`).
4. **Result Item**: User-meaningful decision outcome (`ResultItem` discriminated union).
5. **Module Result**: Structured module payload (`MirathModuleResult` or `ZakatModuleResult`).
6. **Calculation Result Envelope**: Top-level canonical envelope (`CalculationResultEnvelope`).

---

## 2. Standard Status Precedence
1. `INTEGRITY_FAILURE`
2. `CONFLICT`
3. `INVALID_INPUT`
4. `FAILED`
5. `REVIEW_REQUIRED`
6. `UNSUPPORTED`
7. `PARTIALLY_COMPLETED`
8. `COMPLETED_WITH_WARNINGS`
9. `COMPLETED`

---

## 3. Strict Non-Negotiable Directives
- **Separation of Presentation**: Changing language or currency produces a `RenderedCalculationResult`, never mutating `CalculationResultEnvelope`.
- **Exact Values**: Exact fractions (`{ numerator, denominator }`) and exact rates (`{ numerator: 1, denominator: 40 }`) are preserved in `exactValues`.
- **No Invented Rulings**: Synthetic test fixtures are explicitly tagged. Zero invented Islamic rulings in production.
- **AI Restrictions**: AI Assistant consumes `AIResultContextPackage` with 10 strict restrictions, blocking recalculation or alteration.
