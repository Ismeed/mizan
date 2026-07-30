"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fraction_utils_1 = require("../utils/fraction.utils");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Assertion failed: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
    }
}
console.log('--- Running Fraction Math Tests ---');
// Test gcd
assertEqual((0, fraction_utils_1.gcd)(12, 18), 6, 'gcd of 12 and 18 is 6');
assertEqual((0, fraction_utils_1.gcd)(5, 7), 1, 'gcd of 5 and 7 is 1');
console.log('gcd tests passed!');
// Test lcm
assertEqual((0, fraction_utils_1.lcm)(4, 6), 12, 'lcm of 4 and 6 is 12');
assertEqual((0, fraction_utils_1.lcm)(5, 7), 35, 'lcm of 5 and 7 is 35');
console.log('lcm tests passed!');
// Test reduceFrac
assertEqual((0, fraction_utils_1.reduceFrac)({ n: 4, d: 8 }), { n: 1, d: 2 }, '4/8 reduces to 1/2');
assertEqual((0, fraction_utils_1.reduceFrac)({ n: 0, d: 5 }), { n: 0, d: 1 }, '0/5 reduces to 0/1');
console.log('reduceFrac tests passed!');
// Test addFrac
assertEqual((0, fraction_utils_1.addFrac)({ n: 1, d: 2 }, { n: 1, d: 3 }), { n: 5, d: 6 }, '1/2 + 1/3 = 5/6');
assertEqual((0, fraction_utils_1.addFrac)({ n: 1, d: 4 }, { n: 3, d: 4 }), { n: 1, d: 1 }, '1/4 + 3/4 = 1/1');
console.log('addFrac tests passed!');
// Test scaleFrac
assertEqual((0, fraction_utils_1.scaleFrac)({ n: 1, d: 4 }, 2), { n: 1, d: 2 }, '1/4 scaled by 2 is 1/2');
console.log('scaleFrac tests passed!');
// Test compareFrac
assertEqual((0, fraction_utils_1.compareFrac)({ n: 1, d: 2 }, { n: 1, d: 3 }), 1, '1/2 > 1/3');
assertEqual((0, fraction_utils_1.compareFrac)({ n: 1, d: 4 }, { n: 1, d: 2 }), -1, '1/4 < 1/2');
assertEqual((0, fraction_utils_1.compareFrac)({ n: 2, d: 4 }, { n: 1, d: 2 }), 0, '2/4 == 1/2');
console.log('compareFrac tests passed!');
// Test fracToDecimal
assertEqual((0, fraction_utils_1.fracToDecimal)({ n: 1, d: 2 }), 0.5, '1/2 is 0.5');
assertEqual((0, fraction_utils_1.fracToDecimal)({ n: 1, d: 4 }), 0.25, '1/4 is 0.25');
console.log('fracToDecimal tests passed!');
// Test fracToLabel
assertEqual((0, fraction_utils_1.fracToLabel)({ n: 1, d: 2 }), '½', '1/2 label is ½');
assertEqual((0, fraction_utils_1.fracToLabel)({ n: 1, d: 5 }), '1/5', '1/5 label is 1/5');
console.log('fracToLabel tests passed!');
console.log('All fraction.utils tests passed!\n');
