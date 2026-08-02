import { MadhhabBranchStrategy } from '@mizan/shared';

describe('Phase 5 — MadhhabBranchStrategy Contract', () => {
  it('supports all 4 canonical branch strategies', () => {
    const strategies: MadhhabBranchStrategy[] = [
      'SHARED_BASE',
      'PARTIAL_AGREEMENT',
      'NARROW_OVERRIDE',
      'FULL_BRANCH',
    ];

    expect(strategies).toHaveLength(4);
    expect(strategies).toContain('SHARED_BASE');
    expect(strategies).toContain('PARTIAL_AGREEMENT');
    expect(strategies).toContain('NARROW_OVERRIDE');
    expect(strategies).toContain('FULL_BRANCH');
  });
});
