import { HistoricalProfileMigrationService } from '../src/features/profile/services/historical-profile-migration.service';

async function main() {
  console.log('🔄 Executing MIZAN Historical Calculation Profile Migration...\n');

  try {
    const report = await HistoricalProfileMigrationService.migrateExistingCalculations();

    console.log(`✅ Migration Completed Successfully.`);
    console.log(` - Migrated Fully:               ${report.migratedCount}`);
    console.log(` - Marked Incomplete (Zakat/etc): ${report.incompleteCount}`);
    console.log(` - Errors Encountered:            ${report.errors.length}\n`);

    if (report.errors.length > 0) {
      console.error('Migration Errors:');
      report.errors.forEach(e => console.error(` - ${e}`));
    }
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to execute historical calculation migrations.');
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
