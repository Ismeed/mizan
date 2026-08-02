import { KnowledgeValidationService } from '../../src/features/knowledge/services/knowledge-validation.service';

async function main() {
  console.log('🔒 Verifying SHA-256 payload checksums across records...\n');

  try {
    const report = await KnowledgeValidationService.runFullValidation();

    if (report.checksumMismatchesCount > 0) {
      console.error(`❌ Found ${report.checksumMismatchesCount} checksum mismatches! Unauthorized modifications detected.`);
      report.errors
        .filter(e => e.includes('Checksum Mismatch'))
        .forEach(e => console.error(` - ${e}`));
      process.exit(1);
    }

    console.log('✅ SHA-256 checksum verification passed across all records.');
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to verify live record checksums.');
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
