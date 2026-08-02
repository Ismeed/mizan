import {
  subFrac,
  mulFrac,
  divFrac,
  fracToPercent,
  rationalEquals,
  rationalToMonetaryAmount,
} from '@mizan/shared';

describe('Exact Rational Arithmetic Extension Tests', () => {
  it('subFrac subtracts fractions correctly: 1/2 - 1/6 = 1/3', () => {
    const res = subFrac({ n: 1, d: 2 }, { n: 1, d: 6 });
    expect(res).toEqual({ n: 1, d: 3 });
  });

  it('mulFrac multiplies fractions correctly: 1/3 * 1/2 = 1/6', () => {
    const res = mulFrac({ n: 1, d: 3 }, { n: 1, d: 2 });
    expect(res).toEqual({ n: 1, d: 6 });
  });

  it('divFrac divides fractions correctly: (1/2) / (1/4) = 2/1', () => {
    const res = divFrac({ n: 1, d: 2 }, { n: 1, d: 4 });
    expect(res).toEqual({ n: 2, d: 1 });
  });

  it('divFrac throws error on division by zero fraction', () => {
    expect(() => divFrac({ n: 1, d: 2 }, { n: 0, d: 1 })).toThrow(/Division by zero/);
  });

  it('fracToPercent formats display percentages accurately', () => {
    expect(fracToPercent({ n: 1, d: 4 })).toBe('25.00%');
    expect(fracToPercent({ n: 1, d: 40 })).toBe('2.50%');
    expect(fracToPercent({ n: 1, d: 3 })).toBe('33.33%');
  });

  it('rationalEquals compares fractions regardless of unreduced terms', () => {
    expect(rationalEquals({ n: 1, d: 4 }, { n: 2, d: 8 })).toBe(true);
    expect(rationalEquals({ n: 1, d: 4 }, { n: 1, d: 3 })).toBe(false);
  });

  it('rationalToMonetaryAmount converts rational share of estate accurately', () => {
    const estate = 1200000;
    const share = { n: 1, d: 4 }; // 1/4 of 1.2m = 300k
    const amount = rationalToMonetaryAmount(share, estate);
    expect(amount.toNumber()).toBe(300000);
  });
});
