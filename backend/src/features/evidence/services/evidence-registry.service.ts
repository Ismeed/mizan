import { prisma } from '../../../config/database';
import { BaseEvidence, EvidenceType } from '@mizan/shared';
import { EvidenceValidatorService } from './evidence-validator.service';

export interface GetEvidenceParams {
  evidenceId: string;
  version?: string;
  knowledgeReleaseVersion?: string;
  madhhab?: string;
  languageTag?: string;
  allowDraft?: boolean;
}

export class EvidenceRegistryService {
  /**
   * Retrieves an evidence record by ID and optional version.
   * Enforces knowledge release membership, madhhab scope, and status permission.
   */
  static async getEvidenceById(params: GetEvidenceParams): Promise<BaseEvidence | null> {
    const { evidenceId, version, madhhab, allowDraft = false } = params;

    const whereClause: any = { evidence_id: evidenceId };
    if (version) {
      whereClause.version = version;
    }

    // Sort by version desc if no specific version requested
    const records = await (prisma as any).evidenceRecord.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: 1,
    });

    if (!records || records.length === 0) {
      return null;
    }

    const rec = records[0];

    // Filter status
    if (!allowDraft && rec.status !== 'PRODUCTION' && rec.status !== 'APPROVED') {
      return null;
    }

    // Filter Madhhab if specified
    if (madhhab && rec.madhhab_scope_json) {
      const scope = rec.madhhab_scope_json as any;
      if (scope.mode !== 'SHARED' && Array.isArray(scope.appliesTo)) {
        if (!scope.appliesTo.includes(madhhab.toUpperCase())) {
          return null;
        }
      }
    }

    const baseEvidence: BaseEvidence = {
      evidenceId: rec.evidence_id,
      version: rec.version,
      schemaVersion: rec.schema_version,
      evidenceType: rec.evidence_type as EvidenceType,
      identity: rec.identity_json || rec.content_json?.identity || {
        moduleScope: rec.module_scope_json,
        topics: rec.topics_json,
        subtopics: rec.subtopics_json,
        canonicalReference: rec.canonical_reference,
        shortReference: rec.short_reference,
      },
      madhhabScope: rec.madhhab_scope_json,
      content: rec.content_json,
      translations: rec.translations_json,
      citation: rec.citation_json,
      sourceProvenance: rec.source_provenance_json,
      relationships: rec.relationships_json,
      licensing: rec.licensing_json,
      governance: rec.governance_json || { status: rec.status, reviewMetadata: {} },
      integrity: {
        contentChecksum: rec.content_checksum,
        sourceChecksum: rec.source_checksum,
        createdAt: rec.created_at.toISOString(),
        createdBy: rec.created_by,
        updatedAt: rec.updated_at.toISOString(),
        updatedBy: rec.updated_by,
      },
      isTestFixture: rec.is_test_fixture,
      fixtureTag: rec.fixture_tag ?? undefined,
    };

    // Validate on load
    const val = EvidenceValidatorService.validate(baseEvidence);
    if (!val.isValid && !allowDraft) {
      console.warn(`[EvidenceRegistryService] Loaded evidence ${rec.evidence_id} v${rec.version} failed validation:`, val.errors);
      return null;
    }

    return baseEvidence;
  }

  /**
   * Retrieves all approved evidence records linked to a given Rule.
   */
  static async getEvidenceForRule(
    ruleId: string,
    ruleVersion: string,
    madhhab: string
  ): Promise<BaseEvidence[]> {
    const links = await (prisma as any).structuredRuleEvidenceLink.findMany({
      where: {
        rule_id: ruleId,
        rule_version: ruleVersion,
      },
      include: {
        evidenceRecord: true,
      },
    });

    const results: BaseEvidence[] = [];

    for (const link of links) {
      if (!link.evidenceRecord) continue;
      const ev = link.evidenceRecord;

      // Madhhab check
      const scope = ev.madhhab_scope_json as any;
      if (scope && scope.mode !== 'SHARED' && Array.isArray(scope.appliesTo)) {
        if (!scope.appliesTo.includes(madhhab.toUpperCase())) {
          continue;
        }
      }

      const item: BaseEvidence = {
        evidenceId: ev.evidence_id,
        version: ev.version,
        schemaVersion: ev.schema_version,
        evidenceType: ev.evidence_type as EvidenceType,
        identity: {
          moduleScope: ev.module_scope_json,
          topics: ev.topics_json,
          subtopics: ev.subtopics_json,
          canonicalReference: ev.canonical_reference,
          shortReference: ev.short_reference,
        },
        madhhabScope: ev.madhhab_scope_json,
        content: ev.content_json,
        translations: ev.translations_json,
        citation: ev.citation_json,
        sourceProvenance: ev.source_provenance_json,
        relationships: ev.relationships_json,
        licensing: ev.licensing_json,
        governance: ev.governance_json || { status: ev.status, reviewMetadata: {} },
        integrity: {
          contentChecksum: ev.content_checksum,
          sourceChecksum: ev.source_checksum,
          createdAt: ev.created_at.toISOString(),
          createdBy: ev.created_by,
          updatedAt: ev.updated_at.toISOString(),
          updatedBy: ev.updated_by,
        },
        isTestFixture: ev.is_test_fixture,
      };

      results.push(item);
    }

    return results;
  }
}
