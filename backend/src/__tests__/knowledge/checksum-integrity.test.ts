import { ChecksumService } from '../../features/knowledge/services/checksum.service';
import { BaseKnowledgeRecordPayload } from '../../features/knowledge/types/knowledge.types';

describe('Checksum Service - SHA-256 Tamper Detection & Deterministic Hashing', () => {
  const sampleRecord: Partial<BaseKnowledgeRecordPayload> = {
    knowledgeId: 'RULE_MIRATH_FATHER_SHARE_001',
    recordType: 'RULE',
    module: 'MIRATH',
    topic: 'FIXED_SHARES',
    subtopic: 'FATHER',
    madhhabScope: ['HANAFI', 'MALIKI'],
    languageScope: ['en'],
    version: '1.0.0',
    sourceProvenance: {
      sourceType: 'FIQH_BOOK',
      bookTitle: 'Al-Mughni',
      author: 'Ibn Qudamah',
      extractionMethod: 'MANUAL',
      verifiedAgainstPhysicalCopy: true,
    },
    evidenceIds: ['EV_QURAN_NISA_11'],
    relatedRuleIds: [],
    relatedExplanationIds: ['EXP_FATHER_SHARE_EN'],
    contentData: { shareFraction: '1/6' },
    schemaVersion: '1.0.0',
  };

  test('Generates reproducible SHA-256 checksums for identical payloads', () => {
    const hash1 = ChecksumService.generateRecordChecksum(sampleRecord);
    const hash2 = ChecksumService.generateRecordChecksum(sampleRecord);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  test('Detects unauthorized modifications to record payload', () => {
    const originalHash = ChecksumService.generateRecordChecksum(sampleRecord);

    const tamperedRecord = {
      ...sampleRecord,
      contentData: { shareFraction: '1/3' }, // Unauthorized edit
    };

    const tamperedHash = ChecksumService.generateRecordChecksum(tamperedRecord);
    expect(tamperedHash).not.toBe(originalHash);
  });
});
