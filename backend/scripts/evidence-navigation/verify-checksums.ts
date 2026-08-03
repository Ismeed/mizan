import { EvidenceNavigationBuilderService } from '../../src/features/evidence-navigation/services/evidence-navigation-builder.service';
import { EvidenceNavigationSigningService } from '../../src/features/evidence-navigation/services/evidence-navigation-signing.service';

function main() {
  console.log('====================================================');
  console.log('MIZAN Evidence Navigation — Checksum Integrity CLI');
  console.log('====================================================\n');

  const payload = EvidenceNavigationBuilderService.buildStandalonePayload({
    evidenceId: 'TEST-HADITH-BUKHARI-001',
    evidenceVersion: '1.0.0',
    evidenceType: 'HADITH',
    selectedMadhhab: 'HANAFI',
    languageTag: 'en',
  });

  const calculatedChecksum = EvidenceNavigationSigningService.generatePayloadChecksum(payload);
  if (payload.security.payloadChecksum !== calculatedChecksum) {
    console.error('[FAIL] Payload checksum mismatch!');
    process.exit(1);
  }
  console.log(`[PASS] Checksum generated & verified: ${calculatedChecksum.slice(0, 16)}...`);

  // Verify signature
  const isValidSig = EvidenceNavigationSigningService.verifySignature(
    payload.security.payloadChecksum,
    payload.navigationId,
    payload.security.signature!
  );

  if (!isValidSig) {
    console.error('[FAIL] Signature verification failed!');
    process.exit(1);
  }
  console.log('[PASS] Digital Signature HMAC-SHA256: VERIFIED');

  console.log('\n✅ Deterministic payload checksum & signature verification passed!');
}

main();
