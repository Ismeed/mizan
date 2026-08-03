import { VerifiedAIEvidenceContextEnvelope, EvidenceNavigationPayload } from '../../../../../../../packages/shared/src';
import { VerifiedAIEvidenceContextService } from '../verified-ai-evidence-context.service';

export class ReportEvidenceContextBuilder {
  static async build(payload: EvidenceNavigationPayload, userId: string = 'system') {
    const res = await VerifiedAIEvidenceContextService.buildVerifiedEvidenceContext({
      userContext: { userId },
      navigationPayload: payload,
    });
    if (res.context) {
      res.context.contextType = 'REPORT_EVIDENCE_CONTEXT';
      res.context.binding = 'REPORT_BOUND';
    }
    return res;
  }
}
