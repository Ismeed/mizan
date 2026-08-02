import { RuleExecutorService } from '../../features/rules/services/rule-executor.service';
import {
  FIXTURE_MIRATH_SPOUSE_BASE,
  FIXTURE_ZAKAT_RATE_STANDARD,
} from './fixtures/synthetic-rule-fixtures';

describe('Rule Execution & Traceability Tests', () => {
  it('executes assigned fixed fraction decision and produces full trace', () => {
    const facts = { heirs: { husband: { count: 1 } } };
    const { context, trace } = RuleExecutorService.executeRules(
      [FIXTURE_MIRATH_SPOUSE_BASE],
      facts,
      'CALC-TEST-001',
      'MIRATH',
      'HANAFI',
      '1.0.0',
    );

    expect(trace.calculationId).toBe('CALC-TEST-001');
    expect(trace.totalRulesApplied).toBe(1);
    expect(trace.appliedRules[0].ruleId).toBe('MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001');
    expect(trace.appliedRules[0].evidenceRefs[0].referenceLabel).toBe('Quran 4:12 (Test Reference)');
    expect(context.moduleOutput.fraction_husband).toEqual({ n: 1, d: 2 });
  });

  it('executes Zakat rate decision and produces rate as rational', () => {
    const facts = {};
    const { context, trace } = RuleExecutorService.executeRules(
      [FIXTURE_ZAKAT_RATE_STANDARD],
      facts,
      'CALC-ZAKAT-001',
      'ZAKAT',
      'HANAFI',
      '1.0.0',
    );

    expect(trace.appliedRules[0].ruleId).toBe('ZAKAT-RATE-STANDARD-ALL-001');
    expect(context.moduleOutput.zakatRate).toEqual({ n: 1, d: 40 });
    expect(context.moduleOutput.zakatRateLabel).toBe('2.5%');
  });
});
