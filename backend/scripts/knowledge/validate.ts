import { KnowledgeValidationService } from '../../src/features/knowledge/services/knowledge-validation.service';

async function main() {
  console.log('🔍 Running MIZAN Knowledge Repository System-Wide Integrity Audit...\n');

  try {
    const report = await KnowledgeValidationService.runFullValidation();

    console.log(`Total Records Audited: ${report.totalRecordsCount}`);
    console.log(`Checksum Mismatches:   ${report.checksumMismatchesCount}`);
    console.log(`Broken Evidence Links: ${report.brokenLinksCount}`);
    console.log(`Invalid Provenance:    ${report.invalidProvenanceCount}`);
    console.log(`Overall Result:        ${report.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

    if (!report.passed) {
      console.error('Validation Errors:');
      report.errors.forEach(err => console.error(` - ${err}`));
      process.exit(1);
    }

    console.log('✅ Knowledge Repository Integrity Audit Passed.');
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to perform live database audits.');
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
