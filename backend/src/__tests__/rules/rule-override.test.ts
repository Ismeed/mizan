import { RuleResolutionService } from '../../features/rules/services/rule-resolution.service';
import {
  FIXTURE_MIRATH_SPOUSE_BASE,
  FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN,
} from './fixtures/synthetic-rule-fixtures';

describe('Rule Family & Override Resolution Tests', () => {
  it('resolves the more specific rule when children exist', async () => {
    const matchedResults = [
      {
        rule: FIXTURE_MIRATH_SPOUSE_BASE, // 2 conditions (husband present, no children)
        matched: true,
        evaluationTrace: { matched: true, trace: [] },
        conditionCount: 2,
      },
      {
        rule: FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN, // 2 conditions + higher priority (200)
        matched: true,
        evaluationTrace: { matched: true, trace: [] },
        conditionCount: 2,
      },
    ];

    const result = await RuleResolutionService.resolveRules(matchedResults, 'HANAFI');

    expect(result.status).toBe('RESOLVED');
    expect(result.resolvedRules).toHaveLength(1);
    expect(result.resolvedRules[0].identity.ruleId).toBe('MIRATH-FIXED_SHARE-SPOUSE-WITH_CHILDREN-002');
  });

  it('stops and logs when equal specificity and priority conflict', async () => {
    const conflictingRuleA = { ...FIXTURE_MIRATH_SPOUSE_BASE, scope: { ...FIXTURE_MIRATH_SPOUSE_BASE.scope, priority: 100 } };
    const conflictingRuleB = { ...FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN, identity: { ...FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN.identity, ruleId: 'MIRATH-FIXED_SHARE-SPOUSE-CONFLICT-003' }, scope: { ...FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN.scope, priority: 100 } };

    const matchedResults = [
      { rule: conflictingRuleA, matched: true, evaluationTrace: { matched: true, trace: [] }, conditionCount: 2 },
      { rule: conflictingRuleB, matched: true, evaluationTrace: { matched: true, trace: [] }, conditionCount: 2 },
    ];

    const result = await RuleResolutionService.resolveRules(matchedResults, 'HANAFI');

    expect(result.status).toBe('RULE_CONFLICT_DETECTED');
    expect(result.conflictReport?.conflictsFound).toBe(true);
  });
});
