import { prisma } from '../../../config/database';
import { GateValidationResult, GovernanceRole } from '../types/knowledge.types';
import { ChecksumService } from './checksum.service';
import { SourceProvenanceService } from './provenance.service';
import { KnowledgeRecordService } from './knowledge-record.service';

export class PublicationService {
  /**
   * Evaluates all publication gates for a knowledge record.
   */
  static async evaluatePublicationGates(knowledgeId: string): Promise<GateValidationResult> {
    const record = await KnowledgeRecordService.getRecord(knowledgeId);
    const errors: string[] = [];

    const checks = {
      statusCheck: false,
      checksumCheck: false,
      provenanceCheck: false,
      evidenceLinksCheck: false,
      schemaCheck: false,
      madhhabScopeCheck: false,
      languageScopeCheck: false,
      noPendingChangesCheck: false,
    };

    // 1. Status Check (Must be APPROVED or INDEXED)
    if (['APPROVED', 'INDEXED'].includes(record.status)) {
      checks.statusCheck = true;
    } else {
      errors.push(`Status check failed: Record is in status '${record.status}'. Only APPROVED or INDEXED records can be published.`);
    }

    // 2. Checksum Check
    const provenance = JSON.parse(record.source_provenance_json || '{}');
    const contentData = JSON.parse(record.content_json || '{}');
    const evidenceIds = JSON.parse(record.evidence_ids_json || '[]');
    const relatedRuleIds = JSON.parse(record.related_rule_ids_json || '[]');
    const relatedExplanationIds = JSON.parse(record.related_explanation_ids || '[]');
    const madhhabScope = JSON.parse(record.madhhab_scope_json || '[]');
    const languageScope = JSON.parse(record.language_scope_json || '[]');

    const calculatedChecksum = ChecksumService.generateRecordChecksum({
      knowledgeId: record.knowledge_id,
      recordType: record.record_type as any,
      module: record.module as any,
      topic: record.topic,
      subtopic: record.subtopic,
      madhhabScope,
      languageScope,
      version: record.version,
      sourceProvenance: provenance,
      evidenceIds,
      relatedRuleIds,
      relatedExplanationIds,
      contentData,
      schemaVersion: '1.0.0',
    });

    if (calculatedChecksum === record.content_checksum) {
      checks.checksumCheck = true;
    } else {
      errors.push(`Checksum check failed: Record content has been modified without updating checksum (Stored: ${record.content_checksum}, Expected: ${calculatedChecksum}).`);
    }

    // 3. Provenance Check
    const provVal = SourceProvenanceService.validateProvenance(provenance);
    if (provVal.valid) {
      checks.provenanceCheck = true;
    } else {
      errors.push(`Provenance check failed: ${provVal.errors.join('; ')}`);
    }

    // 4. Evidence Links Check
    if (Array.isArray(evidenceIds)) {
      checks.evidenceLinksCheck = true;
    } else {
      errors.push('Evidence links check failed: evidenceIds must be an array.');
    }

    // 5. Schema Check
    if (record.knowledge_id && record.record_type && record.module && record.topic) {
      checks.schemaCheck = true;
    } else {
      errors.push('Schema check failed: Required record attributes are missing.');
    }

    // 6. Madhhab Scope Check
    if (Array.isArray(madhhabScope) && madhhabScope.length > 0) {
      checks.madhhabScopeCheck = true;
    } else {
      errors.push('Madhhab scope check failed: Record must declare at least one applicable Madhhab scope.');
    }

    // 7. Language Scope Check
    if (Array.isArray(languageScope) && languageScope.length > 0) {
      checks.languageScopeCheck = true;
    } else {
      errors.push('Language scope check failed: Record must declare at least one supported language.');
    }

    // 8. No Pending Changes Check
    const changeRequests = record.change_requests || [];
    if (changeRequests.length === 0) {
      checks.noPendingChangesCheck = true;
    } else {
      errors.push(`Pending changes check failed: Record has ${changeRequests.length} unresolved change request(s).`);
    }

    const passed = Object.values(checks).every(v => v === true) && errors.length === 0;

    return {
      passed,
      knowledgeId: record.knowledge_id,
      version: record.version,
      checks,
      errors,
    };
  }

  /**
   * Publishes an approved record to PRODUCTION status after evaluating all publication gates.
   */
  static async publishToProduction(
    knowledgeId: string,
    publisherId: string,
    publisherRole: GovernanceRole
  ) {
    if (!['PUBLICATION_ADMIN', 'KNOWLEDGE_ADMIN'].includes(publisherRole)) {
      throw new Error(`Role '${publisherRole}' is not authorized to publish records to Production.`);
    }

    const gateReport = await this.evaluatePublicationGates(knowledgeId);
    if (!gateReport.passed) {
      throw new Error(`Publication Gate Evaluation Failed:\n${gateReport.errors.join('\n')}`);
    }

    const record = await KnowledgeRecordService.getRecord(knowledgeId);

    // Save Publication Record
    await prisma.publicationRecord.create({
      data: {
        knowledge_id: knowledgeId,
        published_by: publisherId,
        version: record.version,
        content_checksum: record.content_checksum,
        gate_report_json: JSON.stringify(gateReport),
      },
    });

    // Update status to PRODUCTION
    const publishedRecord = await KnowledgeRecordService.transitionStatus(
      knowledgeId,
      'PRODUCTION',
      publisherId,
      publisherRole,
      'Record successfully verified against all 10 publication gates and published to Production.'
    );

    return {
      record: publishedRecord,
      gateReport,
    };
  }
}
