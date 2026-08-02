import { prisma } from '../../src/config/database';
import { PublicationService } from '../../src/features/knowledge/services/publication.service';

async function main() {
  const targetId = process.argv[2];

  try {
    if (targetId) {
      console.log(`🚀 Publishing record '${targetId}' to Production...\n`);
      const res = await PublicationService.publishToProduction(targetId, 'cli_pub_admin', 'PUBLICATION_ADMIN');
      console.log(`✅ Successfully published '${targetId}' (v${res.record.version}) to PRODUCTION.`);
    } else {
      console.log('🚀 Executing batch production publication gate pipeline...\n');

      const indexedRecords = await prisma.knowledgeRecord.findMany({
        where: { status: 'INDEXED' },
      });

      console.log(`Found ${indexedRecords.length} INDEXED records candidate for production release.`);

      let successCount = 0;
      for (const record of indexedRecords) {
        try {
          await PublicationService.publishToProduction(record.knowledge_id, 'cli_pub_admin', 'PUBLICATION_ADMIN');
          console.log(` ✅ Published '${record.knowledge_id}' (v${record.version})`);
          successCount++;
        } catch (err: any) {
          console.error(` ❌ Publication Gate Failed for '${record.knowledge_id}': ${err.message}`);
        }
      }

      console.log(`\nBatch publication finished. ${successCount}/${indexedRecords.length} records published.`);
    }
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to execute live production releases.');
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
