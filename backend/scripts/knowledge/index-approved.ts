import { prisma } from '../../src/config/database';
import { KnowledgeRecordService } from '../../src/features/knowledge/services/knowledge-record.service';

async function main() {
  console.log('⚡ Indexing approved records into vector retrieval layer...\n');

  try {
    const approvedRecords = await prisma.knowledgeRecord.findMany({
      where: { status: 'APPROVED' },
    });

    console.log(`Found ${approvedRecords.length} APPROVED records eligible for indexing.`);

    for (const record of approvedRecords) {
      await prisma.indexingRecord.create({
        data: {
          knowledge_id: record.knowledge_id,
          indexed_by: 'cli_indexing_service',
          version: record.version,
          index_checksum: record.content_checksum,
          vector_namespace: `mizan_${record.module.toLowerCase()}`,
        },
      });

      await KnowledgeRecordService.transitionStatus(
        record.knowledge_id,
        'INDEXED',
        'cli_indexing_service',
        'INDEXING_SERVICE',
        'Record indexed into vector database namespace.'
      );

      console.log(` - Indexed record: ${record.knowledge_id} (v${record.version})`);
    }

    console.log('\n✅ Indexing complete.');
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to index live records.');
    } else {
      throw err;
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
