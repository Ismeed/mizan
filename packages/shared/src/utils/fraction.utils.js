"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gcd = gcd;
exports.lcm = lcm;
exports.reduceFrac = reduceFrac;
exports.addFrac = addFrac;
exports.scaleFrac = scaleFrac;
exports.compareFrac = compareFrac;
exports.fracToDecimal = fracToDecimal;
exports.fracToLabel = fracToLabel;
exports.addFractions = addFractions;
exports.simplifyFraction = simplifyFraction;
exports.fractionToDecimal = fractionToDecimal;
const decimal_js_1 = __importDefault(require("decimal.js"));
/** Greatest common divisor (Euclidean algorithm) */
function gcd(a, b) {
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
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}
/** Reduce a fraction to lowest terms */
function reduceFrac(f) {
    if (f.n === 0)
        return { n: 0, d: 1 };
    const g = gcd(Math.abs(f.n), Math.abs(f.d));
    return { n: f.n / g, d: f.d / g };
}
/** Add two fractions, returning simplified result */
function addFrac(a, b) {
    const d = lcm(a.d, b.d);
    const n = a.n * (d / a.d) + b.n * (d / b.d);
    return reduceFrac({ n, d });
}
/** Multiply a fraction by an integer scalar */
function scaleFrac(f, scalar) {
    return reduceFrac({ n: f.n * scalar, d: f.d });
}
/** Compare two fractions: -1, 0, 1 */
function compareFrac(a, b) {
    const lhs = a.n * b.d;
    const rhs = b.n * a.d;
    return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
}
/** Convert a fraction to a decimal number */
function fracToDecimal(f) {
    return new decimal_js_1.default(f.n).dividedBy(f.d).toNumber();
}
/** Build a human-readable Unicode fraction string */
function fracToLabel(f) {
    const map = {
        '1/2': '½', '1/3': '⅓', '2/3': '⅔',
        '1/4': '¼', '3/4': '¾',
        '1/6': '⅙', '5/6': '⅚',
        '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞',
    };
    const key = `${f.n}/${f.d}`;
    return map[key] ?? key;
}
// ---- Legacy helpers (kept for backward compat) ----
function addFractions(f1, f2) {
    const [n1, d1] = f1.split('/').map(Number);
    const [n2, d2] = f2.split('/').map(Number);
    if (!d1 || !d2)
        return '0/1';
    const numerator = n1 * d2 + n2 * d1;
    const denominator = d1 * d2;
    return simplifyFraction(numerator, denominator);
}
function simplifyFraction(n, d) {
    const divisor = gcd(n, d);
    return `${n / divisor}/${d / divisor}`;
}
function fractionToDecimal(fraction) {
    const [n, d] = fraction.split('/').map(Number);
    if (!d)
        return 0;
    return new decimal_js_1.default(n).dividedBy(d).toNumber();
}
