/**
 * MIZAN — CLI Livestock Schedule Validator (Phase 9)
 *
 * Validates baseline synthetic schedules for gaps, overlaps, checksums, and syntax.
 */

import { BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES } from '../../../packages/shared/src/registry/livestock-schedules.registry';
import { LivestockScheduleRangeValidator } from '../../src/features/zakat/livestock/services/livestock-schedule-range-validator.service';


function main() {
  console.log('========================================================');
  console.log('MIZAN Livestock Schedule Integrity Validator');
  console.log('========================================================\n');

  const validator = new LivestockScheduleRangeValidator();
  let totalBands = 0;
  let hasErrors = false;

  for (const schedule of BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES) {
    console.log(`Checking Schedule: ${schedule.scheduleId} (v${schedule.version})`);
    console.log(`  Model Type: ${schedule.scheduleModel.modelType}`);
    console.log(`  Fixture Tag: ${schedule.governance.fixtureTag || 'NONE'}`);

    const bands = schedule.scheduleModel.bands;
    totalBands += bands.length;
    console.log(`  Bands Count: ${bands.length}`);

    const report = validator.validateBands(bands);
    if (report.isValid) {
      console.log('  STATUS: ✅ VALID');
    } else {
      console.log('  STATUS: ❌ INVALID');
      for (const err of report.errors) {
        console.error(`    - ERROR: ${err}`);
      }
      hasErrors = true;
    }

    if (report.warnings.length > 0) {
      for (const warn of report.warnings) {
        console.warn(`    - WARNING: ${warn}`);
      }
    }
    console.log('');
  }

  console.log('--------------------------------------------------------');
  console.log(`Total Schedules Validated: ${BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES.length}`);
  console.log(`Total Bands Validated: ${totalBands}`);
  console.log('--------------------------------------------------------');

  if (hasErrors) {
    console.error('\nValidation FAILED.');
    process.exit(1);
  } else {
    console.log('\nValidation PASSED successfully.');
  }
}

main();
