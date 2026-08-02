import Decimal from 'decimal.js';

/** Fraction represented as integer numerator / denominator */
export interface Frac { n: number; d: number }

/** Greatest common divisor (Euclidean algorithm) */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/** Least common multiple */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Reduce a fraction to lowest terms */
export function reduceFrac(f: Frac): Frac {
  if (f.n === 0) return { n: 0, d: 1 };
  const g = gcd(Math.abs(f.n), Math.abs(f.d));
  return { n: f.n / g, d: f.d / g };
}

/** Add two fractions, returning simplified result */
export function addFrac(a: Frac, b: Frac): Frac {
  const d = lcm(a.d, b.d);
  const n = a.n * (d / a.d) + b.n * (d / b.d);
  return reduceFrac({ n, d });
}

/** Multiply a fraction by an integer scalar */
export function scaleFrac(f: Frac, scalar: number): Frac {
  return reduceFrac({ n: f.n * scalar, d: f.d });
}

/** Compare two fractions: -1, 0, 1 */
export function compareFrac(a: Frac, b: Frac): number {
  const lhs = a.n * b.d;
  const rhs = b.n * a.d;
  return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
}

/** Convert a fraction to a decimal number */
export function fracToDecimal(f: Frac): number {
  return new Decimal(f.n).dividedBy(f.d).toNumber();
}

/** Build a human-readable Unicode fraction string */
export function fracToLabel(f: Frac): string {
  const map: Record<string, string> = {
    '1/2': '½', '1/3': '⅓', '2/3': '⅔',
    '1/4': '¼', '3/4': '¾',
    '1/6': '⅙', '5/6': '⅚',
    '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞',
  };
  const key = `${f.n}/${f.d}`;
  return map[key] ?? key;
}

// ---- Legacy helpers (kept for backward compat) ----

export function addFractions(f1: string, f2: string): string {
  const [n1, d1] = f1.split('/').map(Number);
  const [n2, d2] = f2.split('/').map(Number);
  if (!d1 || !d2) return '0/1';
  const numerator = n1 * d2 + n2 * d1;
  const denominator = d1 * d2;
  return simplifyFraction(numerator, denominator);
}

export function simplifyFraction(n: number, d: number): string {
  const divisor = gcd(n, d);
  return `${n / divisor}/${d / divisor}`;
}

export function fractionToDecimal(fraction: string): number {
  const [n, d] = fraction.split('/').map(Number);
  if (!d) return 0;
  return new Decimal(n).dividedBy(d).toNumber();
}

/** Subtract fractions: a - b */
export function subFrac(a: Frac, b: Frac): Frac {
  const d = lcm(a.d, b.d);
  const n = a.n * (d / a.d) - b.n * (d / b.d);
  return reduceFrac({ n, d });
}

/** Multiply two fractions */
export function mulFrac(a: Frac, b: Frac): Frac {
  return reduceFrac({ n: a.n * b.n, d: a.d * b.d });
}

/** Divide fraction a by fraction b */
export function divFrac(a: Frac, b: Frac): Frac {
  if (b.n === 0) throw new Error('RULE_ARITHMETIC_ERROR: Division by zero fraction');
  return reduceFrac({ n: a.n * b.d, d: a.d * b.n });
}

/** Convert a fraction to a display percentage string, e.g. "2.50%" */
export function fracToPercent(f: Frac): string {
  return new Decimal(f.n).dividedBy(f.d).mul(100).toFixed(2) + '%';
}

/** Compare two fractions for exact equality */
export function rationalEquals(a: Frac, b: Frac): boolean {
  const ra = reduceFrac(a);
  const rb = reduceFrac(b);
  return ra.n === rb.n && ra.d === rb.d;
}

/** Convert a fraction share of estate to a monetary amount using Decimal arithmetic */
export function rationalToMonetaryAmount(share: Frac, estateTotal: number): Decimal {
  return new Decimal(share.n).dividedBy(share.d).mul(new Decimal(estateTotal));
}
