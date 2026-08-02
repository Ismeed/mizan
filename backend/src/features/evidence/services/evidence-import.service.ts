import { prisma } from '../../../config/database';
import { BaseEvidence } from '@mizan/shared';
import { EvidenceValidatorService } from './evidence-validator.service';
import { EvidenceChecksumService } from './evidence-checksum.service';

export interface ImportOptions {
  importedBy: string;
  sourceLabel: string;
  isTestFixture?: boolean;
}

export interface ImportResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  importedEvidenceIds: string[];
  errors: Array<{ evidenceId: string; errors: any[] }>;
}

export class EvidenceImportService {
  /**
   * Safe evidence import pipeline.
   * Imports evidence array into DRAFT status only after validation.
   */
  static async importEvidenceArray(records: BaseEvidence[], options: ImportOptions): Promise<ImportResult> {
    let successCount = 0;
    let failureCount = 0;
    const importedIds: string[] = [];
    const importErrors: Array<{ evidenceId: string; errors: any[] }> = [];

    for (const record of records) {
      // 1. Force DRAFT status on import
      record.governance = record.governance || { status: 'DRAFT', reviewMetadata: {} };
      record.governance.status = 'DRAFT';

      if (options.isTestFixture) {
        record.isTestFixture = true;
        record.fixtureTag = 'TEST_ONLY_FIXTURE';
      }

      // 2. Recalculate Checksums
      record.integrity = record.integrity || ({} as any);
      record.integrity.contentChecksum = EvidenceChecksumService.generateContentChecksum(record.content);
      record.integrity.sourceChecksum = EvidenceChecksumService.generateRecordChecksum(record);

      // 3. Validate Schema & Constraints
      const val = EvidenceValidatorService.validate(record);
      if (!val.isValid) {
        failureCount++;
        importErrors.push({ evidenceId: record.evidenceId, errors: val.errors });
        continue;
      }

      // 4. Save to Database as DRAFT
      try {
        await (prisma as any).evidenceRecord.upsert({
          where: {
            evidence_id_version: {
              evidence_id: record.evidenceId,
              version: record.version,
            },
          },
          create: {
            evidence_id: record.evidenceId,
            version: record.version,
            schema_version: record.schemaVersion || '1.0.0',
            evidence_type: record.evidenceType,
            module_scope_json: record.identity.moduleScope,
            topics_json: record.identity.topics,
            subtopics_json: record.identity.subtopics,
            canonical_reference: record.identity.canonicalReference,
            short_reference: record.identity.shortReference,
            madhhab_scope_json: record.madhhabScope,
            content_json: record.content,
            translations_json: record.translations,
            citation_json: record.citation,
            source_provenance_json: record.sourceProvenance,
            relationships_json: record.relationships,
            licensing_json: record.licensing,
            governance_json: record.governance,
            content_checksum: record.integrity.contentChecksum,
            source_checksum: record.integrity.sourceChecksum,
            status: 'DRAFT',
            is_test_fixture: record.isTestFixture || false,
            fixture_tag: record.fixtureTag ?? null,
            created_by: options.importedBy,
            updated_by: options.importedBy,
          },
          update: {
            content_json: record.content,
            translations_json: record.translations,
            citation_json: record.citation,
            source_provenance_json: record.sourceProvenance,
            licensing_json: record.licensing,
            content_checksum: record.integrity.contentChecksum,
            source_checksum: record.integrity.sourceChecksum,
            updated_by: options.importedBy,
          },
        });

        successCount++;
        importedIds.push(record.evidenceId);
      } catch (err: any) {
        failureCount++;
        importErrors.push({
          evidenceId: record.evidenceId,
          errors: [{ code: 'DATABASE_ERROR', field: '', message: err.message, severity: 'ERROR' }],
        });
      }
    }

    return {
      totalProcessed: records.length,
      successCount,
      failureCount,
      importedEvidenceIds: importedIds,
      errors: importErrors,
    };
  }
}
