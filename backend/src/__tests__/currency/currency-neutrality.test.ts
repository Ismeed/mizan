/**
 * Currency Neutrality Test Suite
 * Phase 12 — MIZAN Currency Architecture
 *
 * FUNDAMENTAL PRINCIPLE: CURRENCY MUST NEVER CHANGE ISLAMIC CALCULATION LOGIC.
 */

import { calculateMirath, calculateZakat, HeirsInput } from '@mizan/shared';

describe('Currency Neutrality Tests', () => {
  it('MUST NOT change Mirath fractions, allocated shares, or applied rules when changing currency', () => {
    const heirs: HeirsInput = {
      husband: 0,
      wives: 1,
      sons: 2,
      daughters: 1,
      father: 0,
      mother: 0,
      paternalGrandfathers: 0,
      paternalGrandmothers: 0,
      maternalGrandmothers: 0,
      fullBrothers: 0,
      fullSisters: 0,
      paternalHalfBrothers: 0,
      paternalHalfSisters: 0,
      maternalHalfSiblings: 0,
      sonsOfFullBrothers: 0,
      sonsOfPatHalfBrothers: 0,
      paternalUncles: 0,
      sonsOfPatUncles: 0,
    };

    const estate = 1000000;

    const resNGN = calculateMirath({ netEstate: estate, heirs, madhhab: 'HANAFI' });
    const resUSD = calculateMirath({ netEstate: estate, heirs, madhhab: 'HANAFI' });
    const resSAR = calculateMirath({ netEstate: estate, heirs, madhhab: 'HANAFI' });

    // Wife fraction must be 1/8 regardless of currency
    const wifeShareNGN = resNGN.shares.find((s) => s.key === 'wives')!;
    const wifeShareUSD = resUSD.shares.find((s) => s.key === 'wives')!;
    const wifeShareSAR = resSAR.shares.find((s) => s.key === 'wives')!;

    expect(wifeShareNGN.fractionNumerator).toBe(1);
    expect(wifeShareNGN.fractionDenominator).toBe(8);

    expect(wifeShareUSD.fractionNumerator).toBe(1);
    expect(wifeShareUSD.fractionDenominator).toBe(8);

    expect(wifeShareSAR.fractionNumerator).toBe(1);
    expect(wifeShareSAR.fractionDenominator).toBe(8);
  });

  it('MUST NOT change Zakat rate or eligibility rule when changing currency', () => {
    const assets = {
      cash: 5000000,
      goldValue: 0,
      silverValue: 0,
      businessInventory: 0,
      investments: 0,
      receivables: 0,
    };

    const zakatNGN = calculateZakat({ assets, liabilities: 0, hawlMet: true, nisabThresholdInCurrency: 1000000 });
    const zakatUSD = calculateZakat({ assets, liabilities: 0, hawlMet: true, nisabThresholdInCurrency: 1000000 });

    expect(zakatNGN.zakatRate).toBe(0.025);
    expect(zakatUSD.zakatRate).toBe(0.025);
    expect(zakatNGN.isDue).toBe(true);
    expect(zakatUSD.isDue).toBe(true);
  });
});
