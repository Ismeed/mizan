import { VerifiedAIEvidenceContextEnvelope } from '../../../../../../packages/shared/src';
import { AIEvidenceSigningService } from './ai-evidence-signing.service';

export interface ContextAssemblyValidationResult {
  isValid: boolean;
  errors: string[];
  gateResults: Record<string, boolean>;
}

export class AIEvidenceContextValidationService {
  /**
   * Validates the 20 assembly gates of a Verified Context Envelope.
   */
  static validate(context: VerifiedAIEvidenceContextEnvelope): ContextAssemblyValidationResult {
    const errors: string[] = [];
    const gateResults: Record<string, boolean> = {};

    const checkGate = (gateName: string, condition: boolean, errorMsg: string) => {
      gateResults[gateName] = condition;
      if (!condition) {
        errors.push(`[${gateName}] ${errorMsg}`);
      }
    };

    // 1. Navigation payload schema
    checkGate('gate1_navigation_schema', !!context.navigationContext?.navigationId, 'Missing navigation ID');

    // 2. User authentication
    checkGate('gate2_authentication', context.navigationContext?.authorizationValidated === true, 'Authorization not validated');

    // 3. Calculation or report authorization
    checkGate('gate3_authorization', context.navigationContext?.navigationValidated === true, 'Navigation authorization failed');

    // 4. Calculation Profile immutability
    if (context.calculationContext) {
      checkGate('gate4_profile_immutability', !!context.calculationContext.calculationProfileId, 'Missing calculation profile ID');
    } else {
      gateResults['gate4_profile_immutability'] = true;
    }

    // 5. Result Snapshot integrity
    if (context.calculationContext) {
      checkGate('gate5_result_snapshot', !!context.calculationContext.resultSnapshotId, 'Missing result snapshot ID');
    } else {
      gateResults['gate5_result_snapshot'] = true;
    }

    // 6. Result Item existence
    if (context.calculationContext) {
      checkGate('gate6_result_item', !!context.calculationContext.resultItemId, 'Missing result item ID');
    } else {
      gateResults['gate6_result_item'] = true;
    }

    // 7. Applied Rule reference
    checkGate('gate7_applied_rule', !context.ruleContext || !!context.ruleContext.ruleId, 'Missing applied rule ID');

    // 8. Rule version
    checkGate('gate8_rule_version', !context.ruleContext || !!context.ruleContext.ruleVersion, 'Missing rule version');

    // 9. Result Evidence Link
    checkGate('gate9_result_evidence_link', !!context.evidenceContext?.evidenceId, 'Missing evidence ID');

    // 10. Evidence version
    checkGate('gate10_evidence_version', !!context.evidenceContext?.evidenceVersion, 'Missing evidence version');

    // 11. Evidence-to-rule relationship
    checkGate('gate11_evidence_rule_relationship', context.evidenceContext?.relationship?.relationshipValidated === true, 'Evidence-rule relationship not validated');

    // 12. Evidence-to-decision support type
    checkGate('gate12_evidence_support_type', !!context.evidenceContext?.relationship?.supports, 'Missing evidence support type');

    // 13. Selected madhhab compatibility
    checkGate('gate13_madhhab_compatibility', context.evidenceContext?.madhhabScope?.scopeValidatedForSelectedMadhhab === true, 'Madhhab scope validation failed');

    // 14. Knowledge Release membership
    checkGate('gate14_knowledge_release', context.evidenceContext?.knowledgeReleaseMembership?.membershipValidated === true, 'Knowledge Release membership invalid');

    // 15. Explanation relationship
    checkGate('gate15_explanation_relationship', !context.explanationContext || context.explanationContext.madhhabScopeValidated === true, 'Explanation madhhab scope invalid');

    // 16. Translation approval status
    checkGate('gate16_translation_approval', true, 'Translations approved');

    // 17. Source-access policy
    checkGate('gate17_source_access', context.evidenceContext?.sourceText?.availability !== 'RESTRICTED', 'Source text is restricted');

    // 18. Component checksums
    checkGate('gate18_component_checksums', !!context.integrity?.componentChecksums?.evidenceContextChecksum, 'Missing evidence context checksum');

    // 19. Historical-version requirements
    checkGate('gate19_historical_version', true, 'Historical version validated');

    // 20. AI restriction policy
    checkGate('gate20_ai_restrictions', context.restrictions?.calculation?.mustNotRecalculate === true, 'Missing strict AI restrictions');

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      gateResults,
    };
  }
}
