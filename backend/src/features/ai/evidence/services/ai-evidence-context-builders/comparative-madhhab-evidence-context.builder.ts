import { VerifiedAIEvidenceContextEnvelope, EvidenceNavigationPayload } from '../../../../../../../packages/shared/src';
import { VerifiedAIEvidenceContextService } from '../verified-ai-evidence-context.service';

export class ComparativeMadhhabEvidenceContextBuilder {
  static async build(payload: EvidenceNavigationPayload, userId: string = 'system') {
    const res = await VerifiedAIEvidenceContextService.buildVerifiedEvidenceContext({
      userContext: { userId },
      navigationPayload: payload,
    });
    if (res.context) {
      res.context.contextType = 'COMPARATIVE_MADHHAB_EVIDENCE_CONTEXT';
      res.context.binding = 'COMPARATIVE_CONTEXT';
    }
    return res;
  }
}
