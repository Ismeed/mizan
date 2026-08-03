import { prisma } from '../../../config/database';

export interface AuthorizationParams {
  userId?: string | null;
  role?: string | null;
  calculationId?: string | null;
  reportId?: string | null;
}

export interface AuthorizationResult {
  isAuthorized: boolean;
  denialReason?: string;
  visibilityLevel: 'PUBLIC_USER' | 'SCHOLAR_REVIEWER' | 'TECHNICAL_AUDITOR';
}

export class EvidenceNavigationAuthorizationService {
  /**
   * Authorizes user access for calculation / report navigation.
   */
  static async authorize(params: AuthorizationParams): Promise<AuthorizationResult> {
    const { userId, role = 'USER', calculationId, reportId } = params;

    // Determine visibility level
    let visibilityLevel: 'PUBLIC_USER' | 'SCHOLAR_REVIEWER' | 'TECHNICAL_AUDITOR' = 'PUBLIC_USER';
    if (role === 'ADMIN' || role === 'TECHNICAL_AUDITOR') {
      visibilityLevel = 'TECHNICAL_AUDITOR';
    } else if (role === 'SCHOLAR_REVIEWER' || role === 'SCHOLAR') {
      visibilityLevel = 'SCHOLAR_REVIEWER';
    }

    // 1. If calculationId specified, check ownership
    if (calculationId) {
      if (!userId) {
        return {
          isAuthorized: false,
          denialReason: 'Authentication required for private calculation evidence navigation',
          visibilityLevel,
        };
      }

      const calc = await prisma.calculation.findUnique({
        where: { id: calculationId },
        select: { user_id: true },
      });

      if (!calc) {
        return {
          isAuthorized: false,
          denialReason: `Calculation record '${calculationId}' not found`,
          visibilityLevel,
        };
      }

      if (calc.user_id !== userId && role !== 'ADMIN') {
        return {
          isAuthorized: false,
          denialReason: 'Forbidden: You do not own this calculation context (Cross-user access blocked)',
          visibilityLevel,
        };
      }
    }

    // 2. If reportId specified, check report access
    if (reportId) {
      if (!userId) {
        return {
          isAuthorized: false,
          denialReason: 'Authentication required for private report evidence navigation',
          visibilityLevel,
        };
      }

      const report = await prisma.report.findUnique({
        where: { id: reportId },
        select: { user_id: true },
      });

      if (!report && role !== 'ADMIN') {
        // If report db entry is not present, fallback check calculation authorization
        if (calculationId) {
          const calcAuth = await this.authorize({ userId, role, calculationId });
          if (!calcAuth.isAuthorized) return calcAuth;
        }
      } else if (report && report.user_id !== userId && role !== 'ADMIN') {
        return {
          isAuthorized: false,
          denialReason: 'Forbidden: You do not own this report context (Cross-user access blocked)',
          visibilityLevel,
        };
      }
    }

    return {
      isAuthorized: true,
      visibilityLevel,
    };
  }
}
