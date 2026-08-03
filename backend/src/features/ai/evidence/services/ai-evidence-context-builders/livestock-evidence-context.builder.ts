import { VerifiedAIEvidenceContextEnvelope, EvidenceNavigationPayload } from '../../../../../../../packages/shared/src';
import { VerifiedAIEvidenceContextService } from '../verified-ai-evidence-context.service';

export class LivestockEvidenceContextBuilder {
  static async build(payload: EvidenceNavigationPayload, userId: string = 'system') {
    const res = await VerifiedAIEvidenceContextService.buildVerifiedEvidenceContext({
      userContext: { userId },
      navigationPayload: payload,
    });
    if (res.context) {
      res.context.contextType = 'LIVESTOCK_EVIDENCE_CONTEXT';
    }
    return res;
  }
}
