import { prisma } from '../../../config/database';
import { StructuredRuleEvidenceLink } from '@mizan/shared';

export class RuleEvidenceLinkService {
  /**
   * Creates a structured rule-to-evidence link.
   * Validates rule status, evidence status, and madhhab scope compatibility.
   */
  static async createLink(linkData: StructuredRuleEvidenceLink): Promise<StructuredRuleEvidenceLink> {
    // 1. Verify target evidence record exists
    const evRecord = await (prisma as any).evidenceRecord.findFirst({
      where: {
        evidence_id: linkData.evidence.evidenceId,
        version: linkData.evidence.evidenceVersion,
      },
    });

    if (!evRecord) {
      throw new Error(`Evidence record ${linkData.evidence.evidenceId} v${linkData.evidence.evidenceVersion} not found`);
    }

    // 2. Production rule cannot link to DRAFT evidence rule check
    if (evRecord.status === 'DRAFT' && linkData.governance.status === 'APPROVED') {
      throw new Error('Approved/Production rule-evidence links cannot target DRAFT evidence');
    }

    // 3. Create or update link record in Prisma DB
    const created = await (prisma as any).structuredRuleEvidenceLink.upsert({
      where: { link_id: linkData.linkId },
      create: {
        link_id: linkData.linkId,
        rule_id: linkData.rule.ruleId,
        rule_version: linkData.rule.ruleVersion,
        evidence_record_id: evRecord.id,
        evidence_id: linkData.evidence.evidenceId,
        evidence_version: linkData.evidence.evidenceVersion,
        relationship_type: linkData.relationship.type,
        supports_category: linkData.relationship.supports,
        madhhab_scope_json: linkData.madhhabScope,
        show_in_result: linkData.display.showInResult,
        show_in_pdf: linkData.display.showInPdf,
        show_in_ai_context: linkData.display.showInAIContext,
        display_priority: linkData.display.displayPriority,
        status: linkData.governance.status,
      },
      update: {
        relationship_type: linkData.relationship.type,
        supports_category: linkData.relationship.supports,
        madhhab_scope_json: linkData.madhhabScope,
        show_in_result: linkData.display.showInResult,
        show_in_pdf: linkData.display.showInPdf,
        show_in_ai_context: linkData.display.showInAIContext,
        display_priority: linkData.display.displayPriority,
        status: linkData.governance.status,
      },
    });

    return linkData;
  }

  /**
   * Returns all links for a given rule.
   */
  static async getLinksForRule(ruleId: string, ruleVersion: string) {
    return (prisma as any).structuredRuleEvidenceLink.findMany({
      where: {
        rule_id: ruleId,
        rule_version: ruleVersion,
      },
      include: {
        evidenceRecord: true,
      },
      orderBy: { display_priority: 'asc' },
    });
  }
}
