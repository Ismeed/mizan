import { EvidenceNavigationPayload } from '../../../../../packages/shared/src';

export class EvidenceNavigationPayloadMigrationService {
  /**
   * Migrates legacy or versioned navigation payloads to current 1.0.0 standard.
   */
  static migratePayload(payload: any): EvidenceNavigationPayload {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid navigation payload for migration');
    }

    const version = payload.payloadVersion || '1.0.0';

    if (version === '1.0.0') {
      return payload as EvidenceNavigationPayload;
    }

    // Example migration path for pre-Phase 15 legacy navigation payloads
    if (payload.action === 'OPEN_AI_EVIDENCE' && payload.params) {
      const legacyParams = payload.params;
      return {
        navigationId: `NAV-MIGRATED-${Date.now()}`,
        payloadVersion: '1.0.0',
        action: 'OPEN_AI_EVIDENCE',
        origin: {
          originType: 'EVIDENCE_LIBRARY',
          screenId: 'EVIDENCE_LIBRARY',
        },
        evidence: {
          evidenceId: legacyParams.evidenceId,
          evidenceVersion: legacyParams.evidenceVersion || '1.0.0',
          evidenceType: 'QURAN',
        },
        profile: {
          selectedMadhhab: (legacyParams.madhhab || 'HANAFI').toUpperCase(),
          languageTag: legacyParams.languageTag || 'en',
          locale: `${legacyParams.languageTag || 'en'}-NG`,
        },
        versions: {
          knowledgeReleaseVersion: legacyParams.knowledgeReleaseVersion || '1.0.0',
        },
        security: {
          issuedAt: new Date().toISOString(),
          payloadChecksum: '',
        },
      } as any;
    }

    return payload as EvidenceNavigationPayload;
  }
}
