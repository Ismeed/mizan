/**
 * MIZAN Zakat Rule Engine — Orchestrator
 *
 * This is the ONLY source of truth for Zakat calculations.
 * The AI Assistant MUST NEVER perform Zakat calculations.
 * Every calculation is delegated to this deterministic engine.
 *
 * Architecture: Strategy Pattern
 * Each wealth category has its own isolated calculation strategy.
 * The engine orchestrates all strategies and produces a final result.
 */
import { ZakatInput, ZakatEngineResult, CategoryResult } from './types';
import { CashStrategy }        from './strategies/CashStrategy';
import { GoldSilverStrategy }  from './strategies/GoldSilverStrategy';
import { BusinessStrategy }    from './strategies/BusinessStrategy';
import { InvestmentsStrategy } from './strategies/InvestmentsStrategy';
import { AgricultureStrategy } from './strategies/AgricultureStrategy';
import { LivestockStrategy }   from './strategies/LivestockStrategy';
import { OtherStrategy }       from './strategies/OtherStrategy';
import { MadhhabProvider }     from '../../providers/madhhab.provider';

export class ZakatEngine {
  private readonly cash        = new CashStrategy();
  private readonly goldSilver  = new GoldSilverStrategy();
  private readonly business    = new BusinessStrategy();
  private readonly investments = new InvestmentsStrategy();
  private readonly agriculture = new AgricultureStrategy();
  private readonly livestock   = new LivestockStrategy();
  private readonly other       = new OtherStrategy();

  /**
   * Run the complete Zakat calculation across all selected wealth categories.
   *
   * @param input - Validated ZakatInput from the UI
   * @returns     - ZakatEngineResult with full breakdown and references
   */
  calculate(input: ZakatInput): ZakatEngineResult {
    // 1. Run all strategies — collect non-null results
    const livestockResults = this.livestock.calculateAll(input);

    const monetaryRaw: Array<CategoryResult | null> = [
      this.cash.calculate(input),
      this.goldSilver.calculateGold(input),
      this.goldSilver.calculateSilver(input),
      this.business.calculate(input),
      this.investments.calculate(input),
      this.agriculture.calculate(input),
      this.other.calculate(input),
    ];

    const monetaryCategories = monetaryRaw.filter((r): r is CategoryResult => r !== null);

    // Combine: monetary categories first, then each livestock type
    const allCategories = [...monetaryCategories, ...livestockResults];

    // 2. Compute monetary totals (livestock excluded — paid in kind)
    const totalDeclaredWealth = (
      input.cash +
      input.gold +
      input.silver +
      input.business +
      input.investments +
      input.agriculture +
      input.other
    );

    const totalDebts         = input.debts;
    const netZakatableWealth = Math.max(0, totalDeclaredWealth - totalDebts);

    // 3. Nisab check for monetary categories (excludes agriculture & livestock — own rules)
    const monetaryWealth = (
      input.cash + input.gold + input.silver +
      input.business + input.investments + input.other
    );
    const monetaryNetWealth  = Math.max(0, monetaryWealth - totalDebts);
    const meetsMonetaryNisab = monetaryNetWealth >= input.nisabThreshold;

    // 4. Apply Nisab gating to monetary categories
    const isLivestockCat   = (id: string) => id.startsWith('livestock_');
    const isAgricultureCat = (id: string) => id === 'agriculture';

    const finalCategories: CategoryResult[] = allCategories.map((cat) => {
      const isMonetary = !isLivestockCat(cat.id) && !isAgricultureCat(cat.id);
      if (isMonetary && !meetsMonetaryNisab) {
        return {
          ...cat,
          zakatDue:    0,
          isEligible:  false,
          explanation: `Although ${cat.name} has been declared, the total monetary wealth (${input.currency}${monetaryNetWealth.toLocaleString()}) does not reach the Nisab threshold of ${input.currency}${input.nisabThreshold.toLocaleString()}. Zakat is therefore not obligatory on this category at this time.`,
        };
      }
      return cat;
    });

    // 5. Compute total monetary Zakat due
    const totalZakatDue = finalCategories
      .filter(c => !isLivestockCat(c.id))
      .reduce((sum, c) => sum + (meetsMonetaryNisab || isAgricultureCat(c.id) ? c.zakatDue : 0), 0);

    // Zakat is due if monetary amount > 0 OR any livestock category is eligible
    const isDue = totalZakatDue > 0 || finalCategories.some(c => isLivestockCat(c.id) && c.isEligible);

    const activeMadhhabName = MadhhabProvider.getDisplayName(input.madhhab);

    return {
      isDue,
      totalDeclaredWealth,
      totalDebts,
      netZakatableWealth,
      nisabThreshold: input.nisabThreshold,
      totalZakatDue,
      categories:     finalCategories,
      madhhab:        activeMadhhabName,
      currency:       input.currency,
      calculatedAt:   new Date().toISOString(),
    };
  }
}

/** Singleton instance */
export const zakatEngine = new ZakatEngine();
