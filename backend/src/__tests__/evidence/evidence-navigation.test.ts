import {
  ALL_EVIDENCE_NAVIGATION_ACTIONS,
  ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES,
  EvidenceSupportsCategory,
  getMandatoryAIRestrictions,
} from '../../../../packages/shared/src';
import { EvidenceNavigationBuilderService } from '../../features/evidence-navigation/services/evidence-navigation-builder.service';
import { EvidenceNavigationValidationService } from '../../features/evidence-navigation/services/evidence-navigation-validation.service';
import { EvidenceNavigationSigningService } from '../../features/evidence-navigation/services/evidence-navigation-signing.service';

describe('Evidence Navigation Suite (Phase 15)', () => {
  it('should verify all 14 permanent navigation actions are registered', () => {
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toHaveLength(14);
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_RESULT_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_HIJAB_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_COMPARATIVE_MADHHAB_EVIDENCE');
  });

  it('should verify origin types registry contains required origins', () => {
    expect(ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES.length).toBeGreaterThanOrEqual(17);
    expect(ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES).toContain('RESULT_ITEM');
    expect(ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES).toContain('HIJAB_RESULT_CARD');
    expect(ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES).toContain('DIGITAL_REPORT');
  });

  it('should build and validate a Standalone Evidence Payload', () => {
    const payload = EvidenceNavigationBuilderService.buildStandalonePayload({
      evidenceId: 'TEST-QURAN-004-011',
      evidenceVersion: '1.0.0',
      evidenceType: 'QURAN',
      selectedMadhhab: 'MALIKI',
      languageTag: 'en',
    });

    expect(payload.navigationId).toBeDefined();
    expect(payload.payloadVersion).toBe('1.0.0');
    expect(payload.action).toBe('OPEN_AI_EVIDENCE');
    expect(payload.security.payloadChecksum).toBeDefined();

    const val = EvidenceNavigationValidationService.validatePayload(payload);
    expect(val.isValid).toBe(true);
  });

  it('should build and validate a Result Item Payload', () => {
    const payload = EvidenceNavigationBuilderService.buildResultItemPayload({
      calculationId: 'CALC-100',
      calculationProfileId: 'PROF-100',
      resultId: 'RES-100',
      resultSnapshotId: 'SNAP-100',
      resultItemId: 'ITEM-100',
      subjectType: 'HEIR',
      subjectId: 'MOTHER',
      ruleId: 'MIRATH-MOTHER-SHARE-1-6',
      ruleVersion: '1.0.0',
      evidenceId: 'TEST-QURAN-004-011',
      evidenceVersion: '1.0.0',
      resultEvidenceLinkId: 'LINK-100',
      supports: EvidenceSupportsCategory.FRACTION,
      selectedMadhhab: 'HANAFI',
      languageTag: 'en',
    });

    expect(payload.action).toBe('OPEN_AI_RESULT_EVIDENCE');
    expect(payload.calculation.calculationId).toBe('CALC-100');
    expect(payload.evidence.supports).toBe(EvidenceSupportsCategory.FRACTION);

    const val = EvidenceNavigationValidationService.validatePayload(payload);
    expect(val.isValid).toBe(true);
  });

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
