import { prisma } from '../../../config/database';

export class EvidenceExportService {
  /**
   * Exports evidence records as a canonical JSON package.
   */
  static async exportJson(status: string = 'PRODUCTION'): Promise<string> {
    const records = await (prisma as any).evidenceRecord.findMany({
      where: { status },
      orderBy: { evidence_id: 'asc' },
    });

    const exportData = records.map((r: any) => ({
      evidenceId: r.evidence_id,
      version: r.version,
      schemaVersion: r.schema_version,
      evidenceType: r.evidence_type,
      identity: {
        moduleScope: r.module_scope_json,
        topics: r.topics_json,
        subtopics: r.subtopics_json,
        canonicalReference: r.canonical_reference,
        shortReference: r.short_reference,
      },
      madhhabScope: r.madhhab_scope_json,
      content: r.content_json,
      translations: r.translations_json,
      citation: r.citation_json,
      sourceProvenance: r.source_provenance_json,
      relationships: r.relationships_json,
      licensing: r.licensing_json,
      governance: r.governance_json,
      integrity: {
        contentChecksum: r.content_checksum,
        sourceChecksum: r.source_checksum,
        createdAt: r.created_at.toISOString(),
        createdBy: r.created_by,
        updatedAt: r.updated_at.toISOString(),
        updatedBy: r.updated_by,
      },
    }));

    return JSON.stringify(exportData, null, 2);
  }
}
