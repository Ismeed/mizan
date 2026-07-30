import { prisma } from '../../config/database';
import { calculateMirath } from '@mizan/shared';
import { HeirsInput, MirathResult } from '@mizan/shared';

export interface InheritanceCalculateInput {
  userId: string;
  totalEstate: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number;
  currency: string;
  madhhab: string;
  notes?: string;
  heirs: HeirsInput;
}

export class InheritanceService {
  async calculate(input: InheritanceCalculateInput): Promise<{ calculationId: string; result: MirathResult }> {
    const { userId, totalEstate, debts, funeralExpenses, wasiyyah, currency, madhhab, notes, heirs } = input;

    const netEstate = Math.max(0, totalEstate - debts - funeralExpenses - wasiyyah);

    const result = calculateMirath({
      netEstate,
      heirs,
      madhhab: madhhab as any,
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
          currency,
          madhhab,
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

      return calculation.id;
    });

    return { calculationId: saved, result };
  }

  async getHistory(userId: string) {
    return prisma.calculation.findMany({
      where: { user_id: userId, type: 'INHERITANCE' },
      include: {
        inheritance: {
          include: { heirs: true },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  /**
   * Get a single inheritance calculation by ID (enforces strict ownership check).
   * Throws 404 if calculation does not exist.
   * Throws 403 Forbidden if calculation belongs to another user.
   */
  async getById(id: string, userId: string) {
    const calculation = await prisma.calculation.findUnique({
      where: { id },
      include: {
        inheritance: {
          include: { heirs: true },
        },
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
   * Delete a calculation (enforces strict ownership check).
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
