import { calculateMirath } from '../engines/mirath.engine';
import { calculateZakat } from '../engines/zakat.engine';
import { MirathInput, HeirsInput } from '../types/inheritance.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertClose(actual: number, expected: number, message: string) {
  if (Math.abs(actual - expected) > 0.01) {
    throw new Error(`Assertion failed: ${message}\nExpected close to: ${expected}\nActual: ${actual}`);
  }
}

function getShare(shares: any[], key: string) {
  return shares.find(s => s.key === key);
}

const emptyHeirs: HeirsInput = {
  husband: 0, wives: 0, sons: 0, daughters: 0, father: 0, mother: 0,
  paternalGrandfathers: 0, paternalGrandmothers: 0, maternalGrandmothers: 0,
  fullBrothers: 0, fullSisters: 0, paternalHalfBrothers: 0, paternalHalfSisters: 0,
  maternalHalfSiblings: 0, sonsOfFullBrothers: 0, sonsOfPatHalfBrothers: 0,
  paternalUncles: 0, sonsOfPatUncles: 0,
};

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (error: any) {
    console.error(`FAIL: ${name}`);
    throw error;
  }
}

console.log('--- Mirath Engine Tests ---');

runTest('Test Case 1: Simple Spouse + Children', () => {
  const input: MirathInput = {
    netEstate: 1_000_000,
    heirs: { ...emptyHeirs, husband: 1, sons: 2, daughters: 1 },
    madhhab: 'HANAFI'
  };
  const result = calculateMirath(input);

  const husband = getShare(result.shares, 'husband');
  assertClose(husband.totalAmount, 250_000, 'Husband should get 250,000');

  const sons = getShare(result.shares, 'sons');
  assertClose(sons.totalAmount, 600_000, 'Sons should get 600,000 in total');
  assertClose(sons.perPersonAmount, 300_000, 'Each son gets 300,000');

  const daughters = getShare(result.shares, 'daughters');
  assertClose(daughters.totalAmount, 150_000, 'Daughter should get 150,000');
  
  assertClose(result.totalAllocated, 1_000_000, 'Total allocated must match estate');
});

runTest('Test Case 2: Daughters Only (Fard)', () => {
  const input: MirathInput = {
    netEstate: 1_200_000,
    heirs: { ...emptyHeirs, daughters: 2, mother: 1, father: 1 }
  };
  const result = calculateMirath(input);

  const daughters = getShare(result.shares, 'daughters');
  assertClose(daughters.totalAmount, 800_000, 'Daughters should get 800,000 in total');

  const mother = getShare(result.shares, 'mother');
  assertClose(mother.totalAmount, 200_000, 'Mother should get 200,000');

  const father = getShare(result.shares, 'father');
  assertClose(father.totalAmount, 200_000, 'Father should get 200,000');

  assertClose(result.totalAllocated, 1_200_000, 'Total allocated must match estate');
});

runTest('Test Case 3: Wife + Sons', () => {
  const input: MirathInput = {
    netEstate: 2_000_000,
    heirs: { ...emptyHeirs, wives: 1, sons: 3 }
  };
  const result = calculateMirath(input);

  const wives = getShare(result.shares, 'wives');
  assertClose(wives.totalAmount, 250_000, 'Wife should get 250,000');

  const sons = getShare(result.shares, 'sons');
  assertClose(sons.perPersonAmount, 583333.33, 'Each son should get 583333.33');
});

runTest('Test Case 4: Awl (Proportional Reduction)', () => {
  const input: MirathInput = {
    netEstate: 1_000_000,
    heirs: { ...emptyHeirs, husband: 1, mother: 1, fullSisters: 2 },
    madhhab: 'HANAFI'
  };
  const result = calculateMirath(input);
  
  assert(result.calculationMethod === 'AWL', 'Method should be AWL');

  const husband = getShare(result.shares, 'husband');
  assertClose(husband.totalAmount, 375_000, 'Husband should get 375,000');

  const sisters = getShare(result.shares, 'fullSisters');
  assertClose(sisters.totalAmount, 500_000, 'Sisters should get 500,000');

  const mother = getShare(result.shares, 'mother');
  assertClose(mother.totalAmount, 125_000, 'Mother should get 125,000');

  assertClose(result.totalAllocated, 1_000_000, 'Total allocated must match estate');
});

runTest('Test Case 5: Radd (Surplus Return to Fard heirs)', () => {
  const input: MirathInput = {
    netEstate: 1_000_000,
    heirs: { ...emptyHeirs, mother: 1, daughters: 1 },
    madhhab: 'HANAFI'
  };
  const result = calculateMirath(input);
  
  assert(result.calculationMethod === 'RADD', 'Method should be RADD');

  const mother = getShare(result.shares, 'mother');
  assertClose(mother.totalAmount, 250_000, 'Mother should get 250,000');

  const daughter = getShare(result.shares, 'daughters');
  assertClose(daughter.totalAmount, 750_000, 'Daughter should get 750,000');

  assertClose(result.totalAllocated, 1_000_000, 'Total allocated must match estate');
});

runTest('Test Case 6: Hajb — Son blocks Grandfather', () => {
  const input: MirathInput = {
    netEstate: 500_000,
    heirs: { ...emptyHeirs, sons: 1, paternalGrandfathers: 1 }
  };
  const result = calculateMirath(input);

  const son = getShare(result.shares, 'sons');
  assertClose(son.totalAmount, 500_000, 'Son should inherit ALL');

  const grandfather = getShare(result.shares, 'paternalGrandfathers');
  assertClose(grandfather.totalAmount, 0, 'Grandfather should be BLOCKED');
  assert(grandfather.isBlocked, 'Grandfather should be marked as isBlocked');
});

runTest('Test Case 7: Al-Umariyyatan', () => {
  const input: MirathInput = {
    netEstate: 1_200_000,
    heirs: { ...emptyHeirs, husband: 1, father: 1, mother: 1 }
  };
  const result = calculateMirath(input);

  const husband = getShare(result.shares, 'husband');
  assertClose(husband.totalAmount, 600_000, 'Husband should get 600,000');

  const mother = getShare(result.shares, 'mother');
  assertClose(mother.totalAmount, 200_000, 'Mother should get 200,000');

  const father = getShare(result.shares, 'father');
  assertClose(father.totalAmount, 400_000, 'Father should get 400,000');

  assertClose(result.totalAllocated, 1_200_000, 'Total allocated must match estate');
});

runTest('Test Case 8: Wives (multiple)', () => {
  const input: MirathInput = {
    netEstate: 800_000,
    heirs: { ...emptyHeirs, wives: 2, sons: 2 }
  };
  const result = calculateMirath(input);

  const wives = getShare(result.shares, 'wives');
  assertClose(wives.totalAmount, 100_000, 'Wives should share 100,000');
  assertClose(wives.perPersonAmount, 50_000, 'Each wife gets 50,000');

  const sons = getShare(result.shares, 'sons');
  assertClose(sons.totalAmount, 700_000, 'Sons should share 700,000');
  assertClose(sons.perPersonAmount, 350_000, 'Each son gets 350,000');
});

runTest('Test Case 9: No Heirs (edge case)', () => {
  const input: MirathInput = {
    netEstate: 1_000_000,
    heirs: { ...emptyHeirs }
  };
  const result = calculateMirath(input);

  assertClose(result.totalAllocated, 0, 'Total allocated should be 0');
  assertClose(result.unallocated, 1_000_000, 'Unallocated should be 1,000,000');
});

console.log('\n--- Zakat Engine Tests ---');

runTest('Test: wealth below Nisab', () => {
  const result = calculateZakat({
    assets: { cash: 100, goldValue: 0, silverValue: 0, businessInventory: 0, investments: 0, receivables: 0 },
    liabilities: 0,
    nisabThresholdInCurrency: 500,
    hawlMet: true
  });
  
  assert(!result.isDue, 'Zakat should not be due');
  assertClose(result.zakatDue, 0, 'Zakat amount should be 0');
});

runTest('Test: wealth above Nisab, hawlMet = true', () => {
  const result = calculateZakat({
    assets: { cash: 1000, goldValue: 0, silverValue: 0, businessInventory: 0, investments: 0, receivables: 0 },
    liabilities: 0,
    nisabThresholdInCurrency: 500,
    hawlMet: true
  });
  
  assert(result.isDue, 'Zakat should be due');
  assertClose(result.zakatDue, 25, 'Zakat amount should be 2.5% of 1000 = 25');
});

runTest('Test: hawlMet = false', () => {
  const result = calculateZakat({
    assets: { cash: 1000, goldValue: 0, silverValue: 0, businessInventory: 0, investments: 0, receivables: 0 },
    liabilities: 0,
    nisabThresholdInCurrency: 500,
    hawlMet: false
  });
  
  assert(!result.isDue, 'Zakat should not be due if hawl is not met');
});

runTest('Test: debts reduce net wealth', () => {
  const result = calculateZakat({
    assets: { cash: 1000, goldValue: 0, silverValue: 0, businessInventory: 0, investments: 0, receivables: 0 },
    liabilities: 600,
    nisabThresholdInCurrency: 500,
    hawlMet: true
  });
  
  assertClose(result.netZakatableWealth, 400, 'Net wealth should be 400');
  assert(!result.isDue, 'Zakat should not be due because net wealth < nisab');
});

console.log('\nAll Mirath and Zakat tests passed successfully!\n');
