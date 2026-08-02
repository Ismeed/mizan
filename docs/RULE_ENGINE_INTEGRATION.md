# MIZAN Rule Engine Integration Guide

## Integration Architecture

Phase 3 wraps existing procedural calculation engines (`mirath.engine.ts` and `zakat.engine.ts`) with the new rule standard resolution pipeline.

---

## Output Contract Extension

Every calculation result (`MirathResult` and `ZakatResult`) is extended with an `appliedRules` property:

```typescript
export interface AppliedRule {
  ruleId: string;
  ruleVersion: string;
  ruleType: AnyRuleTypeString;
  titleEn: string;
  madhhabScope: RuleMadhhabScope[];
  evidenceRefs: RuleEvidenceRef[];
  decisionsApplied: RuleDecision['decisionType'][];
}
```

## Traceability Flow

```
User Calculation Request
        │
        ▼
Resolve Profile & Madhhab
        │
        ▼
Load Production Rules (RuleRegistryService)
        │
        ▼
Evaluate Conditions (RuleMatcherService)
        │
        ▼
Resolve Overrides (RuleResolutionService)
        │
        ▼
Execute & Trace (RuleExecutorService + Engine Adapter)
        │
        ▼
MirathResult / ZakatResult + appliedRules Array
```
