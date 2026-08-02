/**
 * MIZAN — Heir Registry Service (Phase 7)
 *
 * Authoritative registry service for loading, querying, and managing
 * canonical heir entity records.
 * Falls back to in-code BASELINE_CANONICAL_HEIRS when DB records are not present.
 */

import { prisma } from '../../../config/database';
import {
  BASELINE_CANONICAL_HEIRS,
  CanonicalHeirId,
  HeirEntityRecord,
  MadhhabCode,
} from '@mizan/shared';

export class HeirRegistryService {
  /**
   * Loads a canonical heir entity record by its permanent ID.
   */
  static async getHeirById(
    heirId: CanonicalHeirId | string,
    version?: string
  ): Promise<HeirEntityRecord | null> {
    try {
      const dbEntity = await (prisma as any).heirEntity.findUnique({
        where: { heir_id: heirId },
        include: {
          madhhab_support: true,
          localizations: true,
          lineage_paths: true,
        },
      });

      if (dbEntity) {
        return HeirRegistryService.mapDbToRecord(dbEntity);
      }
    } catch {
      // Fallback to baseline
    }

    const baseline = BASELINE_CANONICAL_HEIRS.find((h) => h.heirId === heirId);
    return baseline ?? null;
  }

  /**
   * Returns all canonical heir entities, optionally filtered by madhhab support status.
   */
  static async listHeirs(madhhab?: MadhhabCode): Promise<HeirEntityRecord[]> {
    try {
      const dbEntities = await (prisma as any).heirEntity.findMany({
        include: {
          madhhab_support: true,
          localizations: true,
          lineage_paths: true,
        },
      });

      if (dbEntities && dbEntities.length > 0) {
        let mapped = dbEntities.map(HeirRegistryService.mapDbToRecord);
        if (madhhab) {
          mapped = mapped.filter(
            (h: HeirEntityRecord) => h.madhhabMetadata[madhhab]?.inputSupportStatus === 'SUPPORTED'
          );
        }
        return mapped;
      }
    } catch {
      // Fallback to baseline
    }

    if (madhhab) {
      return BASELINE_CANONICAL_HEIRS.filter(
        (h: HeirEntityRecord) => h.madhhabMetadata[madhhab]?.inputSupportStatus === 'SUPPORTED'
      );
    }
    return BASELINE_CANONICAL_HEIRS;
  }

  /**
   * Maps a Prisma HeirEntity DB model to the standard HeirEntityRecord interface.
   */
  private static mapDbToRecord(db: any): HeirEntityRecord {
    const madhhabMetadata: any = {
      HANAFI: { inputSupportStatus: 'SUPPORTED' },
      MALIKI: { inputSupportStatus: 'SUPPORTED' },
      SHAFII: { inputSupportStatus: 'SUPPORTED' },
      HANBALI: { inputSupportStatus: 'SUPPORTED' },
      JAFARI: { inputSupportStatus: 'SUPPORTED' },
    };

    if (db.madhhab_support) {
      for (const s of db.madhhab_support) {
        madhhabMetadata[s.madhhab] = {
          inputSupportStatus: s.input_support_status,
          notes: s.notes,
        };
      }
    }

    return {
      heirId: db.heir_id as CanonicalHeirId,
      version: db.current_version,
      schemaVersion: db.schema_version,
      classification: {
        relationshipCategory: db.relationship_category,
        lineageSide: db.lineage_side,
        sexClassification: db.sex_classification,
        generationDirection: db.generation_direction,
        generationDistance: db.generation_distance,
      },
      relationship: {
        canonicalName: db.canonical_name ?? db.heir_id,
        lineagePath: db.lineage_paths?.[0]?.path_json ?? [],
        parentHeirId: db.parent_heir_id,
      },
      localization: {
        labelKey: `heir.${db.heir_id.toLowerCase()}.label`,
        descriptionKey: `heir.${db.heir_id.toLowerCase()}.description`,
        singularLabelKey: `heir.${db.heir_id.toLowerCase()}.singular`,
        pluralLabelKey: `heir.${db.heir_id.toLowerCase()}.plural`,
      },
      madhhabMetadata,
      groupMemberships: [],
      inputMetadata: {
        allowCount: db.allow_count,
        minimumCount: db.minimum_count,
        maximumCount: db.maximum_count,
        allowIndividualNames: false,
      },
      governance: {
        status: db.governance_status,
        effectiveFrom: db.effective_from ? new Date(db.effective_from).toISOString() : null,
      },
      integrity: {
        contentChecksum: db.content_checksum,
        createdAt: new Date(db.created_at).toISOString(),
        createdBy: db.created_by,
        updatedAt: new Date(db.updated_at).toISOString(),
        updatedBy: db.updated_by,
      },
    };
  }
}
