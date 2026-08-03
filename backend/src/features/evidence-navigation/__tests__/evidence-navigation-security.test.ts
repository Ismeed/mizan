import {
  getMandatoryAIRestrictions,
  EvidenceNavigationBuilderService,
  EvidenceNavigationValidationService,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationSigningService } from '../services/evidence-navigation-signing.service';

describe('Evidence Navigation Security & AI Safety (Phase 15)', () => {
  it('should enforce all 12 mandatory AI safety restrictions', () => {
    const restrictions = getMandatoryAIRestrictions();
    expect(restrictions.mustNotRecalculate).toBe(true);
    expect(restrictions.mustNotChangeDecision).toBe(true);
    expect(restrictions.mustNotChangeMadhhab).toBe(true);
    expect(restrictions.mustNotInventEvidence).toBe(true);
    expect(restrictions.mustNotInventSourceText).toBe(true);
    expect(restrictions.mustNotInventTranslation).toBe(true);
    expect(restrictions.mustNotInventRule).toBe(true);
    expect(restrictions.mustNotInventException).toBe(true);
    expect(restrictions.mustNotPresentCommentaryAsEvidence).toBe(true);
    expect(restrictions.mustNotUseUnapprovedComparativeContext).toBe(true);
    expect(restrictions.mustUseProvidedVerifiedContext).toBe(true);
    expect(restrictions.mustDiscloseInsufficientContext).toBe(true);
  });

  it('should detect checksum tampering on payload modification', () => {
    const payload = EvidenceNavigationBuilderService.buildStandalonePayload({
      evidenceId: 'TEST-QURAN-004-011',
      evidenceVersion: '1.0.0',
      evidenceType: 'QURAN',
      selectedMadhhab: 'MALIKI',
      languageTag: 'en',
    });

    // Tamper with payload content
    payload.evidence.evidenceId = 'FORGED-EVIDENCE-ID';

    const val = EvidenceNavigationValidationService.validatePayload(payload);
    expect(val.isValid).toBe(false);
    expect(val.errorCode).toBe('PAYLOAD_CHECKSUM_MISMATCH');
  });

  it('should generate valid HMAC-SHA256 signature and verify it', () => {
    const navId = 'NAV-SEC-001';
    const checksum = 'a1b2c3d4e5f67890123456789abcdef0';
    const signature = EvidenceNavigationSigningService.generateSignature(checksum, navId);

    const isValid = EvidenceNavigationSigningService.verifySignature(checksum, navId, signature);
    expect(isValid).toBe(true);
  });
});
