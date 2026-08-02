import { prisma } from '../../config/database';
import { calculateMirath, MadhhabCode, CalculationProfile } from '@mizan/shared';
import { HeirsInput, MirathResult } from '@mizan/shared';
import { CalculationProfileResolverService } from '../profile/services/calculation-profile-resolver.service';
import { CalculationProfileSnapshotService } from '../profile/services/calculation-profile-snapshot.service';

export interface InheritanceCalculateInput {
  userId: string;
  totalEstate: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number;
  currency?: string;
  madhhab?: string;
  notes?: string;
  heirs: HeirsInput;
  profileOverrides?: {
    madhhab?: MadhhabCode;
    currency?: string;
    language?: string;
  };
}

export class InheritanceService {
  async calculate(input: InheritanceCalculateInput): Promise<{ calculationId: string; result: MirathResult; profile: CalculationProfile }> {
    const { userId, totalEstate, debts, funeralExpenses, wasiyyah, currency, madhhab, notes, heirs, profileOverrides } = input;

    // Resolve authoritative Calculation Profile
    const requestedMadhhab = (profileOverrides?.madhhab || madhhab) as MadhhabCode | undefined;
    const requestedCurrency = profileOverrides?.currency || currency;

    const { profile } = await CalculationProfileResolverService.resolveProfile({
      userId,
      module: 'MIRATH',
      calculationOverrides: {
        madhhab: requestedMadhhab,
        currency: requestedCurrency,
        language: profileOverrides?.language,
      },
    });

    const resolvedMadhhab = profile.preferences.madhhab.resolved;
    const resolvedCurrency = profile.preferences.currency.code;

    const netEstate = Math.max(0, totalEstate - debts - funeralExpenses - wasiyyah);

    // Execute rule engine with resolved madhhab
    const result = calculateMirath({
      netEstate,
      heirs,
      madhhab: resolvedMadhhab as any,
    });

    const saved = await prisma.$transaction(async (tx) => {
      const calculation = await tx.calculation.create({
        data: {
          user_id: userId,
          type: 'INHERITANCE',
          title: `Inheritance – ${new Date().toLocaleDateString('en-GB')}`,
        },
      });

      const iCalc = await tx.inheritanceCalculation.create({
        data: {
          calculation_id: calculation.id,
          total_estate: totalEstate,
          debts,
          funeral_expenses: funeralExpenses,
          wasiyyah,
          net_estate: netEstate,
          currency: resolvedCurrency,
          madhhab: resolvedMadhhab,
          notes: notes ?? null,
        },
      });

      const heirInserts = result.shares
        .filter(s => s.count > 0)
        .map(s => ({
          inheritance_calculation_id: iCalc.id,
          heir_type: s.key.toUpperCase(),
          count: s.count,
          share_fraction_num: s.fractionNumerator,
          share_fraction_den: s.fractionDenominator,
          share_amount: s.totalAmount,
          is_blocked: s.isBlocked,
          blocking_reason: s.blockingReason ?? null,
          quran_reference: s.reference ?? null,
        }));

      if (heirInserts.length > 0) {
        await tx.inheritanceHeir.createMany({ data: heirInserts });
      }

      // Freeze and attach profile snapshot
      await CalculationProfileSnapshotService.createFrozenSnapshot(profile, calculation.id);

      return calculation.id;
    });

    return { calculationId: saved, result, profile };
  }

  async getHistory(userId: string) {
    return prisma.calculation.findMany({
      where: { user_id: userId, type: 'INHERITANCE' },
      include: {
        inheritance: {
          include: { heirs: true },
        },
        profile_snapshot: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  /**
   * Get a single inheritance calculation by ID (enforces strict ownership check).
   */
  async getById(id: string, userId: string) {
    const calculation = await prisma.calculation.findUnique({
      where: { id },
      include: {
        inheritance: {
          include: { heirs: true },
        },
        profile_snapshot: true,
      },
    });

    if (!calculation) {
      const err = new Error('Calculation not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (calculation.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    return calculation;
  }

  /**
   * Delete a calculation.
   */
  async delete(id: string, userId: string) {
    const calculation = await prisma.calculation.findUnique({
      where: { id },
    });

    if (!calculation) {
      const err = new Error('Calculation not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (calculation.user_id !== userId) {
      const err = new Error('Forbidden: You do not own this resource');
      (err as any).statusCode = 403;
      throw err;
    }

    return prisma.calculation.delete({ where: { id } });
  }
}
