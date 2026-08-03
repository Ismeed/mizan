import { Request, Response } from 'express';
import { EvidenceNavigationBuilderService } from './services/evidence-navigation-builder.service';
import { EvidenceNavigationValidationService } from './services/evidence-navigation-validation.service';
import { EvidenceNavigationHydrationService } from './services/evidence-navigation-hydration.service';
import { EvidencePreviewService } from './services/evidence-preview.service';
import { EvidenceReaderService } from './services/evidence-reader.service';
import { AIEvidenceContextV2Service } from './services/ai-evidence-context-v2.service';
import { AIEvidenceContextSnapshotService } from './services/ai-evidence-context-snapshot.service';
import { AIEvidenceConversationService } from './services/ai-evidence-conversation.service';
import { EvidenceNavigationTokenService } from './services/evidence-navigation-token.service';
import { EvidenceNavigationAuditService } from './services/evidence-navigation-audit.service';
import { prisma } from '../../config/database';

export class EvidenceNavigationController {
  // POST /api/evidence-navigation/build
  static async buildPayload(req: Request, res: Response) {
    try {
      const { type, data } = req.body;
      let payload: any;

      if (type === 'RESULT_ITEM') {
        payload = EvidenceNavigationBuilderService.buildResultItemPayload(data);
      } else if (type === 'HIJAB') {
        payload = EvidenceNavigationBuilderService.buildHijabPayload(data);
      } else {
        payload = EvidenceNavigationBuilderService.buildStandalonePayload(data);
      }

      return res.json({ success: true, data: payload });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/validate
  static async validatePayload(req: Request, res: Response) {
    try {
      const payload = req.body;
      const result = EvidenceNavigationValidationService.validatePayload(payload);
      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          error: EvidenceNavigationValidationService.formatErrorResponse(
            'INVALID',
            result.errorCode || 'INVALID_NAVIGATION_PAYLOAD',
            result.message || 'Payload validation failed',
            result.fieldPath
          ),
        });
      }
      return res.json({ success: true, data: { isValid: true } });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/hydrate
  static async hydratePayload(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const payload = req.body;

      const hydrated = await EvidenceNavigationHydrationService.hydrateEvidenceNavigation({
        userId: user?.id,
        role: user?.role,
        navigationPayload: payload,
      });

      // Audit event
      EvidenceNavigationAuditService.logEvent({
        navigationId: payload.navigationId || 'UNKNOWN',
        userId: user?.id,
        calculationId: payload.calculation?.calculationId,
        resultId: payload.calculation?.resultId,
        resultItemId: payload.calculation?.resultItemId,
        reportId: payload.report?.reportId,
        evidenceId: payload.evidence?.evidenceId || 'UNKNOWN',
        evidenceVersion: payload.evidence?.evidenceVersion || '1.0.0',
        ruleId: payload.rule?.ruleId,
        selectedMadhhab: payload.profile?.selectedMadhhab || 'HANAFI',
        action: payload.action || 'OPEN_AI_EVIDENCE',
        originType: payload.origin?.originType || 'EVIDENCE_LIBRARY',
        validationStatus: hydrated.status,
      });

      if (hydrated.status !== 'VERIFIED' && hydrated.status !== 'HISTORICAL_VERIFIED') {
        return res.status(400).json({
          success: false,
          error: EvidenceNavigationValidationService.formatErrorResponse(
            hydrated.status as any,
            'AI_CONTEXT_INTEGRITY_FAILURE',
            'Context hydration failed or access denied'
          ),
        });
      }

      return res.json({ success: true, data: hydrated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/preview
  static async getPreview(req: Request, res: Response) {
    try {
      const { evidenceId, version, madhhab, languageTag, navigationId, supportsCategory, relatedDecisionSummary } = req.body;

      const preview = await EvidencePreviewService.getPreview({
        evidenceId,
        version,
        madhhab: madhhab || 'HANAFI',
        languageTag: languageTag || 'en',
        navigationId,
        supportsCategory,
        relatedDecisionSummary,
      });

      if (!preview) {
        return res.status(404).json({ success: false, error: 'Evidence record not found for preview' });
      }

      return res.json({ success: true, data: preview });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/open-ai
  static async openAIEvidenceConversation(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const payload = req.body;

      // 1. Hydrate server-side
      const hydrated = await EvidenceNavigationHydrationService.hydrateEvidenceNavigation({
        userId: user?.id,
        role: user?.role,
        navigationPayload: payload,
      });

      if (hydrated.status !== 'VERIFIED' && hydrated.status !== 'HISTORICAL_VERIFIED') {
        return res.status(400).json({
          success: false,
          error: EvidenceNavigationValidationService.formatErrorResponse(
            hydrated.status as any,
            'AI_CONTEXT_INTEGRITY_FAILURE',
            'Failed to build verified AI context'
          ),
        });
      }

      // 2. Build verified AI context
      const aiContext = AIEvidenceContextV2Service.buildVerifiedAIContext(hydrated);

      // 3. Start AI Conversation
      const result = await AIEvidenceConversationService.startConversation({
        userId: user.id,
        contextPayload: aiContext,
      });

      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/evidence-navigation/reader/:evidenceId
  static async openEvidenceReader(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { evidenceId } = req.params;
      const { version, madhhab, languageTag } = req.query;

      const readerData = await EvidenceReaderService.openReaderSession({
        evidenceId,
        version: version as string,
        madhhab: (madhhab as string) || 'HANAFI',
        languageTag: (languageTag as string) || 'en',
        userId: user?.id,
      });

      if (!readerData) {
        return res.status(404).json({ success: false, error: 'Evidence record not found' });
      }

      return res.json({ success: true, data: readerData });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/tokens
  static async createToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { navigationId, calculationId, reportId, expiresInSeconds, singleUse, payloadChecksum } = req.body;

      const tokenData = await EvidenceNavigationTokenService.createToken({
        navigationId,
        userScope: user.id,
        calculationId,
        reportId,
        expiresInSeconds,
        singleUse,
        payloadChecksum: payloadChecksum || 'CHECKSUM',
      });

      return res.json({ success: true, data: tokenData });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/evidence-navigation/token/:token
  static async resolveToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const result = await EvidenceNavigationTokenService.resolveToken(token);

      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          error: EvidenceNavigationValidationService.formatErrorResponse(
            'INVALID',
            (result.error as any) || 'NAVIGATION_TOKEN_EXPIRED',
            'Token is invalid, expired, or revoked'
          ),
        });
      }

      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST /api/evidence-navigation/tokens/:tokenId/revoke
  static async revokeToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { tokenId } = req.params;
      const { reason } = req.body;

      const success = await EvidenceNavigationTokenService.revokeToken(tokenId, user.id, reason || 'User requested revocation');
      return res.json({ success });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/ai/evidence-context/:contextSnapshotId
  static async getContextSnapshot(req: Request, res: Response) {
    try {
      const { contextSnapshotId } = req.params;
      const snapshot = await AIEvidenceContextSnapshotService.getSnapshot(contextSnapshotId);

      if (!snapshot) {
        return res.status(404).json({ success: false, error: 'Context snapshot not found' });
      }

      return res.json({ success: true, data: snapshot });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/admin/evidence-navigation/audit
  static async getAuditEvents(req: Request, res: Response) {
    try {
      const events = await (prisma as any).evidenceNavigationAuditEventDb.findMany({
        orderBy: { created_at: 'desc' },
        take: 50,
      });

      return res.json({ success: true, data: events });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
