import { Request, Response, NextFunction } from 'express';
import { VerifiedAIEvidenceContextService } from './services/verified-ai-evidence-context.service';
import { AIEvidenceContextValidationService } from './services/ai-evidence-context-validation.service';
import { AIEvidenceContextSnapshotService } from './services/ai-evidence-context-snapshot.service';
import { AIEvidencePromptGuardService } from './services/ai-evidence-prompt-guard.service';
import { AIEvidenceQuestionValidationService } from './services/ai-evidence-question-validation.service';
import { AIEvidenceRetrievalService } from './services/ai-evidence-retrieval.service';
import { AIEvidenceRequestService } from './services/ai-evidence-request.service';
import { GeminiEvidenceProviderAdapter } from '../providers/gemini-evidence-provider.adapter';
import { AIEvidenceResponseSchemaService } from './services/ai-evidence-response-schema.service';
import { AIEvidenceResponseGroundingService } from './services/ai-evidence-response-grounding.service';
import { AIEvidenceResponseSnapshotService } from './services/ai-evidence-response-snapshot.service';
import { AIEvidenceConversationService } from './services/ai-evidence-conversation.service';
import { AIEvidenceAuditService } from './services/ai-evidence-audit.service';
import { sendSuccess, sendError } from '../../../shared/utils/response.utils';
import { prisma } from '../../../config/database';

const geminiAdapter = new GeminiEvidenceProviderAdapter();

export const aiEvidenceController = {
  /**
   * POST /api/ai/evidence/context/build
   */
  async buildContext(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user ? (req as any).user.userId : 'anonymous';
      const { navigationPayload } = req.body;

      if (!navigationPayload) {
        return sendError(res, 'navigationPayload is required', 400);
      }

      const result = await VerifiedAIEvidenceContextService.buildVerifiedEvidenceContext({
        userContext: { userId },
        navigationPayload,
      });

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/evidence/context/validate
   */
  async validateContext(req: Request, res: Response, next: NextFunction) {
    try {
      const { context } = req.body;
      if (!context) {
        return sendError(res, 'context is required', 400);
      }

      const validation = AIEvidenceContextValidationService.validate(context);
      sendSuccess(res, validation);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/evidence/context/:contextSnapshotId
   */
  async getContextSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const { contextSnapshotId } = req.params;
      const snapshot = await AIEvidenceContextSnapshotService.getSnapshot(contextSnapshotId);

      if (!snapshot) {
        return sendError(res, 'AI Context Snapshot not found', 404);
      }

      sendSuccess(res, snapshot);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/evidence/explain
   * Primary end-to-end evidence explanation endpoint.
   * Requires a verified context snapshot or navigation payload + question.
   */
  async explainEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user ? (req as any).user.userId : 'anonymous';
      const { navigationPayload, contextSnapshotId, userQuestion } = req.body;

      if (!userQuestion || typeof userQuestion !== 'string') {
        return sendError(res, 'userQuestion string is required', 400);
      }

      // 1. Prompt Guard Inspection
      const guardRes = AIEvidencePromptGuardService.inspectAndSanitize(userQuestion, userId);
      if (!guardRes.isSafe) {
        return sendError(res, `Prompt injection detected: ${guardRes.detectedPattern}`, 400, 'AI_CONTEXT_PROMPT_INJECTION_DETECTED');
      }

      // 2. Question Validation & Classification
      const qVal = AIEvidenceQuestionValidationService.validateQuestion(guardRes.sanitizedPrompt);
      if (qVal.requiresRecalculation) {
        return sendSuccess(res, {
          status: 'REQUIRES_DETERMINISTIC_RECALCULATION',
          action: 'OPEN_CALCULATION_FLOW',
          message: 'Questions requiring recalculation must be routed back to the deterministic calculation flow.',
        });
      }

      // 3. Resolve or Build Verified Context Envelope
      let verifiedContext = contextSnapshotId
        ? await AIEvidenceContextSnapshotService.getSnapshot(contextSnapshotId)
        : null;

      let snapshotId = contextSnapshotId;

      if (!verifiedContext) {
        if (!navigationPayload) {
          return sendError(res, 'DO NOT SEND ONLY THE EVIDENCE ID TO GEMINI. Either contextSnapshotId or navigationPayload is required.', 400, 'AI_CONTEXT_INSUFFICIENT_VERIFIED_DATA');
        }

        const buildRes = await VerifiedAIEvidenceContextService.buildVerifiedEvidenceContext({
          userContext: { userId },
          navigationPayload,
        });

        if (buildRes.status !== 'FULLY_VERIFIED' || !buildRes.context) {
          return sendError(res, `Context assembly failed: ${buildRes.validationErrors.join(', ')}`, 400, 'AI_CONTEXT_INSUFFICIENT_VERIFIED_DATA');
        }

        verifiedContext = buildRes.context;
        snapshotId = buildRes.snapshotId;
      }

      // 4. Build Provider-Neutral Request
      const aiRequest = AIEvidenceRequestService.buildRequest({
        contextSnapshotId: snapshotId!,
        context: verifiedContext,
        userQuestionText: guardRes.sanitizedPrompt,
      });

      // 5. Execute Gemini Provider Adapter
      const providerRes = await geminiAdapter.executeRequest(aiRequest, verifiedContext);

      if (!providerRes.success || !providerRes.responseObject) {
        return sendError(res, 'Gemini provider failure', 500, 'AI_REQUEST_PROVIDER_UNAVAILABLE');
      }

      const responseObj = providerRes.responseObject;

      // 6. Response Schema Validation
      const schemaVal = AIEvidenceResponseSchemaService.validateSchema(responseObj);
      if (!schemaVal.isValid) {
        return sendError(res, `Response schema invalid: ${schemaVal.errors.join(', ')}`, 500, 'AI_RESPONSE_SCHEMA_INVALID');
      }

      // 7. Grounding Validation (Exact Values, Citations, Quotations, Madhhab)
      const groundingVal = AIEvidenceResponseGroundingService.validate(responseObj, verifiedContext);
      if (!groundingVal.isGrounded) {
        // Log audit failure
        await AIEvidenceAuditService.recordRequestAudit({
          requestId: aiRequest.aiRequestId,
          contextSnapshotId: snapshotId!,
          userId,
          providerId: providerRes.providerId,
          modelIdentifier: providerRes.modelIdentifier,
          promptPolicyVer: '1.0.0',
          promptTemplateVer: '1.0.0',
          userQuestion: userQuestion,
          contextChecksum: verifiedContext.integrity.contextChecksum,
          requestChecksum: aiRequest.requestChecksum,
          responseChecksum: responseObj.integrity.responseChecksum,
          schemaValid: true,
          groundingValid: false,
          quotationValid: true,
          displayStatus: 'REJECTED_GROUNDING_FAILED',
          errorCode: 'AI_RESPONSE_GROUNDING_FAILED',
        });

        return sendError(res, `Response grounding failed: ${groundingVal.violations.join(', ')}`, 422, 'AI_RESPONSE_GROUNDING_FAILED');
      }

      // 8. Create Response Snapshot & Audit Log
      const responseSnapshotId = await AIEvidenceResponseSnapshotService.createSnapshot(
        responseObj,
        aiRequest.aiRequestId,
        snapshotId!,
        groundingVal
      );

      await AIEvidenceAuditService.recordRequestAudit({
        requestId: aiRequest.aiRequestId,
        contextSnapshotId: snapshotId!,
        userId,
        providerId: providerRes.providerId,
        modelIdentifier: providerRes.modelIdentifier,
        promptPolicyVer: '1.0.0',
        promptTemplateVer: '1.0.0',
        userQuestion: userQuestion,
        contextChecksum: verifiedContext.integrity.contextChecksum,
        requestChecksum: aiRequest.requestChecksum,
        providerResponseId: responseObj.aiResponseId,
        responseChecksum: responseObj.integrity.responseChecksum,
        schemaValid: true,
        groundingValid: true,
        quotationValid: true,
        displayStatus: 'DISPLAYED',
      });

      sendSuccess(res, {
        aiRequestId: aiRequest.aiRequestId,
        contextSnapshotId: snapshotId,
        responseSnapshotId,
        response: responseObj,
        grounding: groundingVal,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/evidence/conversations
   */
  async startConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user ? (req as any).user.userId : 'anonymous';
      const { contextSnapshotId, evidenceId, selectedMadhhab, title } = req.body;

      if (!contextSnapshotId || !evidenceId) {
        return sendError(res, 'contextSnapshotId and evidenceId are required', 400);
      }

      const convo = await AIEvidenceConversationService.startConversation({
        userId,
        contextSnapshotId,
        evidenceId,
        selectedMadhhab: selectedMadhhab || 'HANAFI',
        title,
      });

      sendSuccess(res, convo);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/evidence/conversations/:conversationId
   */
  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const convo = await prisma.aIEvidenceConversationDb.findUnique({
        where: { conversation_id: conversationId },
        include: {
          turns: { orderBy: { turn_number: 'asc' } },
        },
      });

      if (!convo) {
        return sendError(res, 'Conversation not found', 404);
      }

      sendSuccess(res, convo);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/evidence/conversations/:conversationId/messages
   */
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user ? (req as any).user.userId : 'anonymous';
      const { conversationId } = req.params;
      const { userQuestion } = req.body;

      const convo = await prisma.aIEvidenceConversationDb.findUnique({
        where: { conversation_id: conversationId },
      });

      if (!convo) {
        return sendError(res, 'Conversation not found', 404);
      }

      // Delegate to explainEvidence using conversation snapshot ID
      req.body.contextSnapshotId = convo.ai_context_snapshot_id;
      return aiEvidenceController.explainEvidence(req, res, next);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/evidence/responses/:responseId
   */
  async getResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const { responseId } = req.params;
      const dbResp = await prisma.aIEvidenceResponseDb.findUnique({
        where: { ai_response_id: responseId },
      });

      if (!dbResp) {
        return sendError(res, 'AI Response not found', 404);
      }

      sendSuccess(res, dbResp);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/evidence/responses/:responseId/validate
   */
  async validateResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const { response, context } = req.body;
      if (!response || !context) {
        return sendError(res, 'response and context are required', 400);
      }

      const schemaVal = AIEvidenceResponseSchemaService.validateSchema(response);
      const groundingVal = AIEvidenceResponseGroundingService.validate(response, context);

      sendSuccess(res, {
        schemaVal,
        groundingVal,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/ai/evidence/requests/:requestId/audit
   */
  async getRequestAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const audit = await prisma.aIEvidenceRequestAuditDb.findUnique({
        where: { ai_request_id: requestId },
      });

      if (!audit) {
        return sendError(res, 'Audit record not found', 404);
      }

      sendSuccess(res, audit);
    } catch (err) {
      next(err);
    }
  },

  // ADMIN ENDPOINTS

  /**
   * GET /api/admin/ai/evidence/audit
   */
  async getAdminAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await prisma.aIEvidenceRequestAuditDb.findMany({
        take: 50,
        orderBy: { created_at: 'desc' },
      });
      sendSuccess(res, records);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/ai/evidence/validation-failures
   */
  async getValidationFailures(req: Request, res: Response, next: NextFunction) {
    try {
      const failures = await prisma.aIEvidenceRequestAuditDb.findMany({
        where: { display_status: { not: 'DISPLAYED' } },
        take: 50,
        orderBy: { created_at: 'desc' },
      });
      sendSuccess(res, failures);
    } catch (err) {
      next(err);
    }
  },
};
