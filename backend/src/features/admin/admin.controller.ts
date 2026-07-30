import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

const adminService = new AdminService();

export class AdminController {
  async getDashboardStats(_req: Request, res: Response) {
    try {
      const stats = await adminService.getDashboardStats();
      return sendSuccess(res, stats);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch dashboard stats', 500);
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await adminService.getUsers(page, limit, search);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch users', 500);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(id);
      return sendSuccess(res, user);
    } catch (error: any) {
      return sendError(res, error.message || 'User not found', 404);
    }
  }

  async toggleUserPremium(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await adminService.toggleUserPremium(id);
      return sendSuccess(res, user);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to toggle premium status', 500);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      return sendSuccess(res, { message: 'User deleted successfully' });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete user', 500);
    }
  }

  async getCalculationTrends(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const trends = await adminService.getCalculationTrends(days);
      return sendSuccess(res, trends);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch trends', 500);
    }
  }

  async broadcastNotification(req: Request, res: Response) {
    try {
      const { title, body } = req.body;
      if (!title || !body) {
        return sendError(res, 'Title and body are required', 400);
      }
      const result = await adminService.broadcastNotification(title, body);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to broadcast notification', 500);
    }
  }

  async notifyUser(req: Request, res: Response) {
    try {
      const { userId, title, body } = req.body;
      if (!userId || !title || !body) {
        return sendError(res, 'userId, title, and body are required', 400);
      }
      const result = await adminService.notifyUser(userId, title, body);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to notify user', 500);
    }
  }

  async getReportedProblems(_req: Request, res: Response) {
    try {
      const problems = await adminService.getReportedProblems();
      return sendSuccess(res, problems);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch reported problems', 500);
    }
  }

  async getFAQs(_req: Request, res: Response) {
    try {
      const faqs = await adminService.getFAQs();
      return sendSuccess(res, faqs);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch FAQs', 500);
    }
  }

  async createFAQ(req: Request, res: Response) {
    try {
      const { question, answer, category } = req.body;
      if (!question || !answer) {
        return sendError(res, 'Question and answer are required', 400);
      }
      const faq = await adminService.createFAQ(question, answer, category);
      return sendSuccess(res, faq, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create FAQ', 500);
    }
  }

  async deleteFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await adminService.deleteFAQ(id);
      return sendSuccess(res, { message: 'FAQ deleted successfully' });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete FAQ', 500);
    }
  }
}
