import { AIEvidenceSigningService } from '../../src/features/ai/evidence/services/ai-evidence-signing.service';

console.log('====================================================');
console.log('MIZAN AI Evidence — Checksum Integrity CLI');
console.log('====================================================');

const testPackage = { id: 'TEST-CTX-100', version: '1.0.0', madhhab: 'MALIKI' };
const checksum = AIEvidenceSigningService.generateChecksum(testPackage);
const isValid = AIEvidenceSigningService.verifyChecksum(testPackage, checksum);

if (isValid) {
  console.log(`[PASS] Context checksum generated & verified: ${checksum.substring(0, 16)}...`);
  console.log('✅ AI Evidence Context Checksum Integrity passed successfully!');
  process.exit(0);
} else {
  console.error('❌ Checksum verification failed!');
  process.exit(1);
}
