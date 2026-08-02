import { KnowledgeValidationService } from '../../src/features/knowledge/services/knowledge-validation.service';

async function main() {
  console.log('📖 Validating Source Provenance metadata (Quran, Hadith, Fiqh)...\n');
  const report = await KnowledgeValidationService.runFullValidation();
  
  if (report.invalidProvenanceCount > 0) {
    console.error(`❌ Found ${report.invalidProvenanceCount} invalid provenance records!`);
    report.errors
      .filter(e => e.includes('Invalid Provenance'))
      .forEach(e => console.error(` - ${e}`));
    process.exit(1);
  }

  console.log('✅ All record source provenance metadata valid.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
