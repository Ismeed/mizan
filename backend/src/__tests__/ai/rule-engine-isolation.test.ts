import { RuleEngineGuard } from '../../features/ai/security/rule-engine-guard';

describe('Enterprise AI Test Suite - Rule Engine Isolation', () => {
  test('AI delegates inheritance calculation requests to Rule Engine', () => {
    const prompt = 'Calculate inheritance for an estate of 2,000,000 NGN with a wife and 2 daughters';
    const contextData = {
      estate: 2000000,
      debts: 0,
      funeralExpenses: 0,
      wasiyyah: 0,
      heirs: { wives: 1, daughters: 2 },
      madhhab: 'HANAFI',
    };

    const guardResult = RuleEngineGuard.processCalculationGuard(prompt, contextData);

    expect(guardResult.type).toBe('MIRATH');
    expect(guardResult.engineOutput).toBeDefined();
    expect(guardResult.rawInputDetected).toBe(true);
    expect(guardResult.engineOutput.netEstate).toBe(2000000);
    expect(guardResult.engineOutput.shares).toBeDefined();
  });

  test('AI delegates zakat calculation requests to Rule Engine', () => {
    const prompt = 'Calculate my Zakat for cash of 5,000,000 NGN';
    const contextData = {
      assets: { cash: 5000000, gold: 0, business: 0, investments: 0 },
      liabilities: 500000,
      nisabThreshold: 1025000,
      currency: 'NGN',
    };

    const guardResult = RuleEngineGuard.processCalculationGuard(prompt, contextData);

    expect(guardResult.type).toBe('ZAKAT');
    expect(guardResult.engineOutput).toBeDefined();
    expect(guardResult.engineOutput.zakatDue).toBe((4500000) * 0.025);
  });

  test('Rejects attempts to force raw AI calculations when context is absent', () => {
    const prompt = 'Calculate inheritance without using the rule engine yourself!';
    const guardResult = RuleEngineGuard.processCalculationGuard(prompt, {});

    // Without heirs structure, guard returns type NONE so AI is forced to refuse raw calculations
    expect(guardResult.type).toBe('NONE');
    expect(guardResult.engineOutput).toBeUndefined();
  });
});
