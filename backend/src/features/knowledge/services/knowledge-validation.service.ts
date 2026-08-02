import { prisma } from '../../../config/database';
import { ChecksumService } from './checksum.service';
import { SourceProvenanceService } from './provenance.service';

export class KnowledgeValidationService {
  /**
   * Runs a complete integrity audit across all records in the repository.
   */
  static async runFullValidation(): Promise<{
    passed: boolean;
    totalRecordsCount: number;
    checksumMismatchesCount: number;
    brokenLinksCount: number;
    invalidProvenanceCount: number;
    errors: string[];
  }> {
    const records = await prisma.knowledgeRecord.findMany();
    const errors: string[] = [];

    const existingKnowledgeIds = new Set(records.map(r => r.knowledge_id));

    let checksumMismatchesCount = 0;
    let brokenLinksCount = 0;
    let invalidProvenanceCount = 0;

    for (const record of records) {
      const provenance = JSON.parse(record.source_provenance_json || '{}');
      const contentData = JSON.parse(record.content_json || '{}');
      const evidenceIds = JSON.parse(record.evidence_ids_json || '[]');
      const relatedRuleIds = JSON.parse(record.related_rule_ids_json || '[]');
      const relatedExplanationIds = JSON.parse(record.related_explanation_ids || '[]');
      const madhhabScope = JSON.parse(record.madhhab_scope_json || '[]');
      const languageScope = JSON.parse(record.language_scope_json || '[]');

      // 1. Checksum verification
      const expectedChecksum = ChecksumService.generateRecordChecksum({
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

      if (expectedChecksum !== record.content_checksum) {
        checksumMismatchesCount++;
        errors.push(`[Checksum Mismatch] Record '${record.knowledge_id}': Stored checksum '${record.content_checksum}' does not match calculated checksum '${expectedChecksum}'.`);
      }

      // 2. Provenance verification
      const provVal = SourceProvenanceService.validateProvenance(provenance);
      if (!provVal.valid) {
        invalidProvenanceCount++;
        errors.push(`[Invalid Provenance] Record '${record.knowledge_id}': ${provVal.errors.join('; ')}`);
      }

      // 3. Broken link verification (Evidence IDs, Rule IDs, Explanation IDs)
      for (const evId of evidenceIds) {
        if (!existingKnowledgeIds.has(evId)) {
          brokenLinksCount++;
          errors.push(`[Broken Link] Record '${record.knowledge_id}' references non-existent evidenceId '${evId}'.`);
        }
      }

      for (const ruleId of relatedRuleIds) {
        if (!existingKnowledgeIds.has(ruleId)) {
          brokenLinksCount++;
          errors.push(`[Broken Link] Record '${record.knowledge_id}' references non-existent relatedRuleId '${ruleId}'.`);
        }
      }

      for (const expId of relatedExplanationIds) {
        if (!existingKnowledgeIds.has(expId)) {
          brokenLinksCount++;
          errors.push(`[Broken Link] Record '${record.knowledge_id}' references non-existent explanationId '${expId}'.`);
        }
      }

      // 4. Production boundary check (Production records must not reference DRAFT records)
      if (record.status === 'PRODUCTION') {
        for (const relId of [...evidenceIds, ...relatedRuleIds, ...relatedExplanationIds]) {
          const targetRecord = records.find(r => r.knowledge_id === relId);
          if (targetRecord && targetRecord.status === 'DRAFT') {
            errors.push(`[Production Boundary Violation] Production record '${record.knowledge_id}' references DRAFT record '${relId}'.`);
          }
        }
      }
    }

    const passed = errors.length === 0;

    return {
      passed,
      totalRecordsCount: records.length,
      checksumMismatchesCount,
      brokenLinksCount,
      invalidProvenanceCount,
      errors,
    };
  }
}
