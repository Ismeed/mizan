import { prisma } from '../../../config/database';
import { KnowledgeManifestPayload, KnowledgeModule } from '../types/knowledge.types';
import { ChecksumService } from './checksum.service';

export class ManifestService {
  /**
   * Generates a canonical release manifest for a given module or full system release.
   */
  static async generateManifest(
    manifestName: string,
    module: KnowledgeModule | 'RELEASE',
    generatorId: string
  ): Promise<KnowledgeManifestPayload> {
    const whereCondition = module === 'RELEASE' ? {} : { module };

    const records = await prisma.knowledgeRecord.findMany({
      where: whereCondition,
      select: {
        knowledge_id: true,
        version: true,
        content_checksum: true,
        status: true,
      },
      orderBy: { knowledge_id: 'asc' },
    });

    const manifestRecords = records.map(r => ({
      knowledgeId: r.knowledge_id,
      version: r.version,
      contentChecksum: r.content_checksum,
      status: r.status as any,
    }));

    const partialManifest: Partial<KnowledgeManifestPayload> = {
      manifestName,
      module,
      version: '1.0.0',
      generatedDate: new Date().toISOString(),
      generatedBy: generatorId,
      schemaVersion: '1.0.0',
      releaseVersion: '1.0.0',
      validationStatus: 'VALID',
      recordCount: manifestRecords.length,
      records: manifestRecords,
    };

    const checksum = ChecksumService.generateManifestChecksum(partialManifest);

    const fullManifest: KnowledgeManifestPayload = {
      ...partialManifest as KnowledgeManifestPayload,
      manifestChecksum: checksum,
    };

    // Store manifest in database
    await prisma.knowledgeManifest.upsert({
      where: { manifest_name: manifestName },
      update: {
        module,
        version: '1.0.0',
        manifest_json: JSON.stringify(fullManifest),
        manifest_checksum: checksum,
        generated_by: generatorId,
      },
      create: {
        manifest_name: manifestName,
        module,
        version: '1.0.0',
        manifest_json: JSON.stringify(fullManifest),
        manifest_checksum: checksum,
        generated_by: generatorId,
      },
    });

    return fullManifest;
  }

  /**
   * Verifies if a stored manifest's checksum matches its contents.
   */
  static async verifyManifest(manifestName: string): Promise<{ valid: boolean; manifest?: KnowledgeManifestPayload }> {
    const stored = await prisma.knowledgeManifest.findUnique({
      where: { manifest_name: manifestName },
    });

    if (!stored) {
      return { valid: false };
    }

    const payload: KnowledgeManifestPayload = JSON.parse(stored.manifest_json);
    const expectedChecksum = ChecksumService.generateManifestChecksum(payload);

    return {
      valid: expectedChecksum === stored.manifest_checksum,
      manifest: payload,
    };
  }
}
