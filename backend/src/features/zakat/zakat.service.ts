import { prisma } from '../../config/database';
import { MadhhabCode, CalculationProfile } from '@mizan/shared';
import { CalculationProfileResolverService } from '../profile/services/calculation-profile-resolver.service';
import { CalculationProfileSnapshotService } from '../profile/services/calculation-profile-snapshot.service';

const SILVER_NISAB_GRAMS = 595;
const GOLD_NISAB_GRAMS = 85;
const FALLBACK_SILVER_USD_PER_GRAM = 0.75;
const FALLBACK_GOLD_USD_PER_GRAM   = 60;

export interface ZakatCalculateInput {
  userId: string;
  assets: any;
  liabilities: number;
  currency?: string;
  madhhab?: string;
  hawlMet: boolean;
  nisabOverride?: number;
  profileOverrides?: {
    madhhab?: MadhhabCode;
    currency?: string;
    language?: string;
  };
}

export class ZakatService {
  private async getNisabThreshold(currency: string): Promise<number> {
    const [goldRate, silverRate] = await Promise.all([
      prisma.nisabRate.findUnique({ where: { type: 'GOLD' } }),
      prisma.nisabRate.findUnique({ where: { type: 'SILVER' } }),
    ]);

    const goldNisabUSD   = GOLD_NISAB_GRAMS   * (goldRate?.price_per_gram_usd   ?? FALLBACK_GOLD_USD_PER_GRAM);
    const silverNisabUSD = SILVER_NISAB_GRAMS * (silverRate?.price_per_gram_usd ?? FALLBACK_SILVER_USD_PER_GRAM);

    return Math.min(goldNisabUSD, silverNisabUSD);
  }

  async calculate(input: ZakatCalculateInput): Promise<{ calculationId: string; result: any; profile: CalculationProfile }> {
    const { userId, assets, liabilities, currency, madhhab, hawlMet, nisabOverride, profileOverrides } = input;

    // Resolve authoritative Calculation Profile
    const requestedMadhhab = (profileOverrides?.madhhab || madhhab) as MadhhabCode | undefined;
    const requestedCurrency = profileOverrides?.currency || currency;

    const { profile } = await CalculationProfileResolverService.resolveProfile({
      userId,
      module: 'ZAKAT',
      calculationOverrides: {
        madhhab: requestedMadhhab,
        currency: requestedCurrency,
        language: profileOverrides?.language,
      },
    });

    const resolvedCurrency = profile.preferences.currency.code;

    const nisabThreshold = nisabOverride ?? (await this.getNisabThreshold(resolvedCurrency));

    const cashVal = assets?.cash || 0;
    const goldVal = assets?.goldValue || 0;
    const silverVal = assets?.silverValue || 0;
    const invVal = assets?.businessInventory || 0;
    const investVal = assets?.investments || 0;
    const recVal = assets?.receivables || 0;

    const totalWealth = cashVal + goldVal + silverVal + invVal + investVal + recVal;
    const netWealth = Math.max(0, totalWealth - liabilities);
    const isEligible = hawlMet && netWealth >= nisabThreshold;
    const zakatDue = isEligible ? netWealth * 0.025 : 0;

    const result = {
      totalAssets: totalWealth,
      totalZakatableWealth: totalWealth,
      netAssets: netWealth,
      netZakatableWealth: netWealth,
      totalLiabilities: liabilities,
      nisabThreshold,
      isEligible,
      zakatRate: 0.025,
      zakatDue,
      zakatPayable: zakatDue,
      currency: resolvedCurrency,
    };

    const calculationId = await prisma.$transaction(async (tx) => {
      const calculation = await tx.calculation.create({
        data: {
          user_id: userId,
          type: 'ZAKAT',
          title: `Zakat – ${new Date().toLocaleDateString('en-GB')}`,
        },
      });

      await tx.zakatCalculation.create({
        data: {
          calculation_id:  calculation.id,
          total_wealth:    totalWealth,
          total_debts:     liabilities,
          exempt_amount:   0,
          net_wealth:      netWealth,
          nisab_threshold: nisabThreshold,
          zakat_rate:      0.025,
          zakat_due:       zakatDue,
          zakat_type:      'ZAKAT_AL_MAL',
          currency:        resolvedCurrency,
          hawl_start_date: null,
        },
      });

      const assetRows = [
        { type: 'CASH',               value: cashVal,   desc: 'Cash & Bank' },
        { type: 'GOLD',               value: goldVal,   desc: 'Gold' },
        { type: 'SILVER',             value: silverVal, desc: 'Silver' },
        { type: 'BUSINESS_INVENTORY', value: invVal,    desc: 'Business Inventory' },
        { type: 'INVESTMENTS',        value: investVal, desc: 'Investments' },
        { type: 'RECEIVABLES',        value: recVal,    desc: 'Receivables' },
      ].filter(a => a.value > 0);

      if (assetRows.length > 0) {
        const zakatCalc = await tx.zakatCalculation.findUnique({ where: { calculation_id: calculation.id } });
        await tx.zakatAsset.createMany({
          data: assetRows.map(a => ({
            zakat_calculation_id: zakatCalc!.id,
            asset_type:  a.type,
            description: a.desc,
            value:       a.value,
          })),
        });
      }

      // Freeze and attach profile snapshot
      await CalculationProfileSnapshotService.createFrozenSnapshot(profile, calculation.id);

      return calculation.id;
    });

    return { calculationId, result, profile };
  }

  async getHistory(userId: string) {
    return prisma.calculation.findMany({
      where: { user_id: userId, type: 'ZAKAT' },
      include: {
        zakat: { include: { assets: true } },
        profile_snapshot: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  /**
   * Get a single Zakat calculation by ID.
   */
  async getById(id: string, userId: string) {
    const calc = await prisma.calculation.findUnique({
      where: { id },
      include: {
        zakat: { include: { assets: true } },
        profile_snapshot: true,
      },
    });

    if (!calc) {
      const err = new Error('Calculation not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (calc.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    return calc;
  }

  async getNisabRates() {
    return prisma.nisabRate.findMany();
  }
}
