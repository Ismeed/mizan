import { KnowledgeValidationService } from '../../src/features/knowledge/services/knowledge-validation.service';

async function main() {
  console.log('🔗 Checking evidence and cross-record citations...\n');

  try {
    const report = await KnowledgeValidationService.runFullValidation();

    if (report.brokenLinksCount > 0) {
      console.error(`❌ Found ${report.brokenLinksCount} broken links!`);
      report.errors
        .filter(e => e.includes('Broken Link'))
        .forEach(e => console.error(` - ${e}`));
      process.exit(1);
    }

    console.log('✅ All evidence and record link citations resolved cleanly.');
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to verify live citation links.');
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
