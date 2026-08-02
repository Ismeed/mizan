import { evaluateCondition, ConditionLeaf, ConditionGroup } from '@mizan/shared';

describe('Declarative Condition Evaluator Tests', () => {
  const sampleFacts: Record<string, unknown> = {
    heirs: {
      husband: { count: 1, isPresent: true },
      sons: { count: 2, isPresent: true },
      daughters: { count: 0, isPresent: false },
    },
    computed: {
      hasChildren: true,
      hasSpouse: true,
    },
    estate: {
      netDistributableAmount: 1000000,
      currency: 'NGN',
    },
    profile: {
      madhhab: 'HANAFI',
    },
  };

  describe('Atomic Leaf Operators', () => {
    it('evaluates EQUALS operator', () => {
      const leaf: ConditionLeaf = { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'EQUALS', value: 'HANAFI' };
      expect(evaluateCondition(leaf, sampleFacts).matched).toBe(true);

      const leafFalse: ConditionLeaf = { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'EQUALS', value: 'MALIKI' };
      expect(evaluateCondition(leafFalse, sampleFacts).matched).toBe(false);
    });

    it('evaluates NOT_EQUALS operator', () => {
      const leaf: ConditionLeaf = { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'NOT_EQUALS', value: 'MALIKI' };
      expect(evaluateCondition(leaf, sampleFacts).matched).toBe(true);
    });

    it('evaluates GREATER_THAN and GREATER_THAN_OR_EQUAL', () => {
      const gt: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.sons.count', operator: 'GREATER_THAN', value: 0 };
      expect(evaluateCondition(gt, sampleFacts).matched).toBe(true);

      const gte: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.sons.count', operator: 'GREATER_THAN_OR_EQUAL', value: 2 };
      expect(evaluateCondition(gte, sampleFacts).matched).toBe(true);
    });

    it('evaluates LESS_THAN and LESS_THAN_OR_EQUAL', () => {
      const lt: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.daughters.count', operator: 'LESS_THAN', value: 1 };
      expect(evaluateCondition(lt, sampleFacts).matched).toBe(true);

      const lte: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.husband.count', operator: 'LESS_THAN_OR_EQUAL', value: 1 };
      expect(evaluateCondition(lte, sampleFacts).matched).toBe(true);
    });

    it('evaluates IN and NOT_IN', () => {
      const inLeaf: ConditionLeaf = { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'IN', value: ['HANAFI', 'MALIKI'] };
      expect(evaluateCondition(inLeaf, sampleFacts).matched).toBe(true);

      const notInLeaf: ConditionLeaf = { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'NOT_IN', value: ['SHAFII', 'HANBALI'] };
      expect(evaluateCondition(notInLeaf, sampleFacts).matched).toBe(true);
    });

    it('evaluates IS_TRUE and IS_FALSE', () => {
      const isTrue: ConditionLeaf = { type: 'LEAF', factsPath: 'computed.hasChildren', operator: 'IS_TRUE' };
      expect(evaluateCondition(isTrue, sampleFacts).matched).toBe(true);

      const isFalse: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.daughters.isPresent', operator: 'IS_FALSE' };
      expect(evaluateCondition(isFalse, sampleFacts).matched).toBe(true);
    });

    it('evaluates EXISTS and NOT_EXISTS', () => {
      const exists: ConditionLeaf = { type: 'LEAF', factsPath: 'estate.netDistributableAmount', operator: 'EXISTS' };
      expect(evaluateCondition(exists, sampleFacts).matched).toBe(true);

      const notExists: ConditionLeaf = { type: 'LEAF', factsPath: 'nonexistent.field', operator: 'NOT_EXISTS' };
      expect(evaluateCondition(notExists, sampleFacts).matched).toBe(true);
    });

    it('evaluates BETWEEN_INCLUSIVE', () => {
      const leaf: ConditionLeaf = { type: 'LEAF', factsPath: 'estate.netDistributableAmount', operator: 'BETWEEN_INCLUSIVE', value: [500000, 2000000] };
      expect(evaluateCondition(leaf, sampleFacts).matched).toBe(true);
    });
  });

  describe('Logical Groups (ALL, ANY, NOT)', () => {
    it('evaluates ALL group (must all match)', () => {
      const group: ConditionGroup = {
        type: 'GROUP',
        operator: 'ALL',
        conditions: [
          { type: 'LEAF', factsPath: 'heirs.husband.count', operator: 'EQUALS', value: 1 },
          { type: 'LEAF', factsPath: 'computed.hasChildren', operator: 'IS_TRUE' },
        ],
      };
      expect(evaluateCondition(group, sampleFacts).matched).toBe(true);
    });

    it('fails ALL group if one child fails', () => {
      const group: ConditionGroup = {
        type: 'GROUP',
        operator: 'ALL',
        conditions: [
          { type: 'LEAF', factsPath: 'heirs.husband.count', operator: 'EQUALS', value: 1 },
          { type: 'LEAF', factsPath: 'heirs.daughters.count', operator: 'GREATER_THAN', value: 0 }, // false
        ],
      };
      expect(evaluateCondition(group, sampleFacts).matched).toBe(false);
    });

    it('evaluates ANY group (matches if at least one matches)', () => {
      const group: ConditionGroup = {
        type: 'GROUP',
        operator: 'ANY',
        conditions: [
          { type: 'LEAF', factsPath: 'heirs.daughters.count', operator: 'GREATER_THAN', value: 0 }, // false
          { type: 'LEAF', factsPath: 'heirs.sons.count', operator: 'GREATER_THAN', value: 0 },      // true
        ],
      };
      expect(evaluateCondition(group, sampleFacts).matched).toBe(true);
    });

    it('evaluates NOT group (inverts child condition)', () => {
      const group: ConditionGroup = {
        type: 'GROUP',
        operator: 'NOT',
        conditions: [
          { type: 'LEAF', factsPath: 'heirs.daughters.count', operator: 'GREATER_THAN', value: 0 }, // false
        ],
      };
      expect(evaluateCondition(group, sampleFacts).matched).toBe(true); // NOT false -> true
    });
  });

  describe('Evaluation Trace', () => {
    it('produces structured trace for auditability', () => {
      const leaf: ConditionLeaf = { type: 'LEAF', factsPath: 'heirs.sons.count', operator: 'GREATER_THAN', value: 0 };
      const res = evaluateCondition(leaf, sampleFacts);
      expect(res.trace).toHaveLength(1);
      expect(res.trace[0]).toEqual({
        conditionType: 'LEAF',
        factsPath: 'heirs.sons.count',
        operator: 'GREATER_THAN',
        expectedValue: 0,
        actualValue: 2,
        result: true,
        description: undefined,
      });
    });
  });
});
