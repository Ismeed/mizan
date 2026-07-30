import { prisma } from '../../config/database';
import { PushNotificationService } from '../notifications/push.service';
import { SupportService } from '../support/support.service';

const pushService = new PushNotificationService();

export class AdminService {
  async getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      totalCalculations,
      inheritanceCount,
      zakatCount,
      aiConversations,
      premiumUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
      prisma.calculation.count(),
      prisma.inheritanceCalculation.count(),
      prisma.zakatCalculation.count(),
      prisma.aiConversation.count(),
      prisma.user.count(),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalCalculations,
      inheritanceCount,
      zakatCount,
      aiConversations,
      premiumUsers,
    };
  }

  async getUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    
    const whereCondition = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          email_verified: true,
          created_at: true,
        }
      }),
      prisma.user.count({ where: whereCondition })
    ]);

    return { users, total };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        calculations: {
          orderBy: { created_at: 'desc' },
          take: 5,
        },
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1,
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async toggleUserPremium(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_premium: true,
    };
  }

  async deleteUser(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
  }

  async getCalculationTrends(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const calculations = await prisma.calculation.findMany({
      where: { created_at: { gte: startDate } },
      select: { created_at: true, type: true }
    });

    const trendsMap = new Map<string, { inheritance: number; zakat: number }>();

    for (const calc of calculations) {
      const dateStr = calc.created_at.toISOString().split('T')[0];
      if (!trendsMap.has(dateStr)) {
        trendsMap.set(dateStr, { inheritance: 0, zakat: 0 });
      }
      
      const dayData = trendsMap.get(dateStr)!;
      if (calc.type === 'INHERITANCE') {
        dayData.inheritance++;
      } else if (calc.type === 'ZAKAT') {
        dayData.zakat++;
      }
    }

    return Array.from(trendsMap.entries()).map(([date, counts]) => ({
      date,
      ...counts
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async broadcastNotification(title: string, body: string) {
    const result = await pushService.broadcast({ title, body });
    return { sent: result.sent, failed: result.failed };
  }

  async notifyUser(userId: string, title: string, body: string) {
    await pushService.sendToUser(userId, { title, body });
    return { success: true, userId, title, body };
  }

  async getReportedProblems() {
    const reports = SupportService.getFeedbacks();
    return {
      total: reports.length,
      reports,
    };
  }

  async getFAQs() {
    return prisma.faq.findMany({
      orderBy: { order: 'asc' }
    });
  }

  async createFAQ(question: string, answer: string, category: string = 'General') {
    return prisma.faq.create({
      data: {
        question,
        answer,
        category,
      }
    });
  }

  async deleteFAQ(id: string) {
    await prisma.faq.delete({ where: { id } });
  }
}
