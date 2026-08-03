import { AIEvidenceResponseGroundingService } from '../../src/features/ai/evidence/services/ai-evidence-response-grounding.service';
import { getStrictAIEvidenceRestrictions } from '../../../packages/shared/src';

console.log('====================================================');
console.log('MIZAN AI Evidence — Response Grounding CLI');
console.log('====================================================');

const dummyContext: any = {
  aiEvidenceContextId: 'CTX-TEST-001',
  calculationContext: { selectedMadhhab: 'HANAFI' },
  evidenceContext: { evidenceId: 'TEST-QURAN-004-011' },
  decisionContext: { exactValues: { fractions: ['1/6'], rates: [0.025] } },
  restrictions: getStrictAIEvidenceRestrictions(),
};

const dummyResponse: any = {
  content: {
    aiClarification: 'The mother receives 1/6 under Hanafi madhhab according to Quran 4:11.',
    whatTheEvidenceSupports: 'Supports 1/6 fraction',
    approvedExplanationSummary: 'Mother share is 1/6 when children are present.',
  },
  sourceUsage: { evidenceIdsUsed: ['TEST-QURAN-004-011'] },
};

const groundingRes = AIEvidenceResponseGroundingService.validate(dummyResponse, dummyContext);

if (groundingRes.isGrounded) {
  console.log(`[PASS] Grounding Score: ${groundingRes.groundingScore}`);
  console.log('✅ Response Grounding Validation passed successfully!');
  process.exit(0);
} else {
  console.error(`[FAIL] Violations: ${groundingRes.violations.join(', ')}`);
  process.exit(1);
}
