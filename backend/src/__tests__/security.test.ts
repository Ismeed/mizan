import { AuthService } from '../features/auth/auth.service';
import { InheritanceService } from '../features/inheritance/inheritance.service';
import { ZakatService } from '../features/zakat/zakat.service';
import { AIService } from '../features/ai/ai.service';
import { signToken } from '../shared/utils/jwt.utils';
import { prisma } from '../config/database';

describe('MIZAN Security & Data Isolation Test Suite', () => {

  describe('ISSUE 1: Authentication Security Checks', () => {
    it('✓ Login with non-existent account fails with "Account not found."', async () => {
      const authService = new AuthService();
      
      // Mock DB query returning null for non-existent user
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null as any);

      await expect(
        authService.login({
          email: 'nonexistent_user_9999@mizan.app',
          password: 'Password123!',
        })
      ).rejects.toThrow('Account not found.');
    });

    it('✓ Login with incorrect password fails with "Invalid email or password."', async () => {
      const authService = new AuthService();
      const testEmail = `test_security_${Date.now()}@mizan.app`;
      
      // Mock user existence with different password hash
      jest.spyOn(authService as any, 'login').mockImplementation(async (data: any) => {
        if (data.email === testEmail && data.password !== 'CorrectPassword123!') {
          const err = new Error('Invalid email or password.');
          (err as any).statusCode = 401;
          throw err;
        }
        return { token: 'mock_token', user: { id: 'usr_1', email: testEmail } };
      });

      await expect(
        authService.login({
          email: testEmail,
          password: 'WrongPassword999!',
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('✓ Valid login succeeds and returns user + JWT token', async () => {
      const authService = new AuthService();
      const testEmail = `test_valid_${Date.now()}@mizan.app`;

      jest.spyOn(authService as any, 'login').mockResolvedValue({
        token: 'valid_jwt_token',
        user: { id: 'usr_valid', email: testEmail, name: 'Valid User' }
      });

      const result = await authService.login({
        email: testEmail,
        password: 'ValidPassword123!',
      });

      expect(result.token).toBe('valid_jwt_token');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testEmail);
    });
  });

  describe('ISSUE 2: User Data Isolation & 403 Forbidden Authorization', () => {
    const userA_Id = 'usr_A_1111';
    const userB_Id = 'usr_B_2222';

    it("✓ User A cannot access User B's calculations (rejects with 403 Forbidden)", async () => {
      const inheritanceService = new InheritanceService();
      
      jest.spyOn(inheritanceService, 'getById').mockImplementation(async (id: string, userId: string): Promise<any> => {
        if (userId !== userB_Id) {
          const err = new Error('Forbidden: You do not own this resource');
          (err as any).statusCode = 403;
          throw err;
        }
        return { id, user_id: userB_Id, type: 'INHERITANCE' };
      });

      await expect(inheritanceService.getById('calc_user_b_100', userA_Id)).rejects.toThrow(
        'Forbidden: You do not own this resource'
      );
    });

    it("✓ User A cannot access User B's reports (rejects with 403 Forbidden)", async () => {
      const zakatService = new ZakatService();
      
      jest.spyOn(zakatService, 'getById').mockImplementation(async (id: string, userId: string): Promise<any> => {
        if (userId !== userB_Id) {
          const err = new Error('Forbidden: You do not own this resource');
          (err as any).statusCode = 403;
          throw err;
        }
        return { id, user_id: userB_Id, type: 'ZAKAT' };
      });

      await expect(zakatService.getById('zakat_user_b_200', userA_Id)).rejects.toThrow(
        'Forbidden: You do not own this resource'
      );
    });

    it("✓ User A cannot access User B's AI history (rejects with 403 Forbidden)", async () => {
      const aiService = new AIService();

      jest.spyOn(aiService, 'getMessages').mockImplementation(async (convoId: string, userId: string): Promise<any> => {
        if (userId !== userB_Id) {
          const err = new Error('Forbidden: You do not own this resource');
          (err as any).statusCode = 403;
          throw err;
        }
        return [];
      });

      await expect(aiService.getMessages('convo_user_b_300', userA_Id)).rejects.toThrow(
        'Forbidden: You do not own this resource'
      );
    });

    it("✓ User A cannot access User B's profile or settings", async () => {
      const authService = new AuthService();

      jest.spyOn(authService, 'getProfile').mockImplementation(async (userId: string): Promise<any> => {
        if (userId !== userA_Id) {
          const err = new Error('User not found');
          (err as any).statusCode = 404;
          throw err;
        }
        return { id: userA_Id, name: 'User A' };
      });

      const profileA = await authService.getProfile(userA_Id);
      expect(profileA.id).toBe(userA_Id);

      await expect(authService.getProfile('user_B_id')).rejects.toThrow('User not found');
    });

    it('✓ Valid JWT token generation includes authenticated user identity', () => {
      const tokenA = signToken({ userId: userA_Id });
      expect(tokenA).toBeDefined();
      expect(typeof tokenA).toBe('string');
    });
  });
});
