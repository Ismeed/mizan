import { prisma } from '../../config/database';

export interface FeedbackData {
  category: string;
  subject: string;
  description: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export interface StoredFeedback extends FeedbackData {
  id: string;
  created_at: Date;
  status: 'OPEN' | 'RESOLVED';
}

const inMemoryFeedbackStore: StoredFeedback[] = [
  {
    id: 'fb_sample_1',
    category: 'BUG',
    subject: 'PDF report alignment issue on landscape',
    description: 'When generating PDF report for large estates, columns wrap tightly.',
    userId: 'sample_user_1',
    userEmail: 'user@example.com',
    userName: 'Ahmad Ibrahim',
    status: 'OPEN',
    created_at: new Date(Date.now() - 3600000 * 2),
  }
];

export class SupportService {
  async submitFeedback(data: FeedbackData): Promise<StoredFeedback> {
    const feedbackItem: StoredFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: data.category || 'FEEDBACK',
      subject: data.subject,
      description: data.description,
      userId: data.userId || 'guest',
      userEmail: data.userEmail || 'user@example.com',
      userName: data.userName || 'User',
      status: 'OPEN',
      created_at: new Date(),
    };

    inMemoryFeedbackStore.unshift(feedbackItem);

    // Audit log persistence
    await prisma.auditLog.create({
      data: {
        user_id: data.userId || null,
        action: 'SUBMIT_PROBLEM_REPORT',
        resource: 'SUPPORT_FEEDBACK',
        resource_id: feedbackItem.id,
        metadata: JSON.stringify(feedbackItem),
      }
    }).catch(() => {});

    return feedbackItem;
  }

  static getFeedbacks(): StoredFeedback[] {
    return inMemoryFeedbackStore;
  }
}
