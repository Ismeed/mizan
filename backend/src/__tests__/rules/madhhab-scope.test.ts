import {
  FIXTURE_MIRATH_SPOUSE_BASE,
  FIXTURE_MALIKI_RADD_OVERRIDE,
} from './fixtures/synthetic-rule-fixtures';

describe('Madhhab Rule Scope Tests', () => {
  describe('Madhhab Scope Evaluation', () => {
    it('rule with ALL_SCHOOLS scope matches any madhhab', () => {
      const scope = FIXTURE_MIRATH_SPOUSE_BASE.scope.madhhabScope;
      expect(scope.includes('ALL_SCHOOLS')).toBe(true);
    });

    it('Maliki-specific rule only matches MALIKI query', () => {
      const scope = FIXTURE_MALIKI_RADD_OVERRIDE.scope.madhhabScope;
      expect(scope).toEqual(['MALIKI']);
      expect(scope.includes('MALIKI')).toBe(true);
      expect(scope.includes('HANAFI' as any)).toBe(false);
      expect(scope.includes('SHAFII' as any)).toBe(false);
      expect(scope.includes('HANBALI' as any)).toBe(false);
    });
  });
});
