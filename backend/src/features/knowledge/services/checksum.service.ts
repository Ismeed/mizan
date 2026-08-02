import crypto from 'crypto';
import { BaseKnowledgeRecordPayload, KnowledgeManifestPayload } from '../types/knowledge.types';

function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  const sortedKeys = Object.keys(obj).sort();
  const result: any = {};
  for (const key of sortedKeys) {
    result[key] = sortObjectKeys(obj[key]);
  }
  return result;
}

export class ChecksumService {
  /**
   * Generates a deterministic SHA-256 checksum for a knowledge record payload.
   * Strips out dynamic execution fields (like contentChecksum itself) to guarantee idempotency.
   */
  static generateRecordChecksum(recordPayload: Partial<BaseKnowledgeRecordPayload>): string {
    const canonicalObj = {
      knowledgeId: recordPayload.knowledgeId,
      recordType: recordPayload.recordType,
      module: recordPayload.module,
      topic: recordPayload.topic,
      subtopic: recordPayload.subtopic,
      madhhabScope: [...(recordPayload.madhhabScope || [])].sort(),
      languageScope: [...(recordPayload.languageScope || [])].sort(),
      version: recordPayload.version,
      sourceProvenance: recordPayload.sourceProvenance,
      evidenceIds: [...(recordPayload.evidenceIds || [])].sort(),
      relatedRuleIds: [...(recordPayload.relatedRuleIds || [])].sort(),
      relatedExplanationIds: [...(recordPayload.relatedExplanationIds || [])].sort(),
      contentData: recordPayload.contentData || {},
      schemaVersion: recordPayload.schemaVersion || '1.0.0',
    };

    const sortedObj = sortObjectKeys(canonicalObj);
    const jsonString = JSON.stringify(sortedObj);
    return crypto.createHash('sha256').update(jsonString, 'utf8').digest('hex');
  }

  /**
   * Generates a deterministic SHA-256 checksum for a manifest payload.
   */
  static generateManifestChecksum(manifest: Partial<KnowledgeManifestPayload>): string {
    const canonicalObj = {
      manifestName: manifest.manifestName,
      module: manifest.module,
      version: manifest.version,
      schemaVersion: manifest.schemaVersion,
      releaseVersion: manifest.releaseVersion,
      recordCount: manifest.recordCount,
      records: (manifest.records || []).map(r => ({
        knowledgeId: r.knowledgeId,
        version: r.version,
        contentChecksum: r.contentChecksum,
        status: r.status,
      })).sort((a, b) => a.knowledgeId.localeCompare(b.knowledgeId)),
    };

    const sortedObj = sortObjectKeys(canonicalObj);
    const jsonString = JSON.stringify(sortedObj);
    return crypto.createHash('sha256').update(jsonString, 'utf8').digest('hex');
  }

  /**
   * Verifies if a given payload matches an expected checksum.
   */
  static verifyRecordChecksum(recordPayload: Partial<BaseKnowledgeRecordPayload>, expectedChecksum: string): boolean {
    const actualChecksum = this.generateRecordChecksum(recordPayload);
    return actualChecksum === expectedChecksum;
  }
}
