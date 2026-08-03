import {
  ALL_EVIDENCE_NAVIGATION_ACTIONS,
  ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES,
  EvidenceNavigationBuilderService,
  EvidenceNavigationValidationService,
  EvidenceSupportsCategory,
} from '../../../../../packages/shared/src';

describe('Evidence Navigation Payload Contracts (Phase 15)', () => {
  it('should verify all 14 permanent navigation actions are registered', () => {
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toHaveLength(14);
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_RESULT_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_AI_HIJAB_EVIDENCE');
    expect(ALL_EVIDENCE_NAVIGATION_ACTIONS).toContain('OPEN_COMPARATIVE_MADHHAB_EVIDENCE');
  });

  it('should verify origin types registry', () => {
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

  it('should reject open redirect URLs in returnRoute', () => {
    const payload: any = EvidenceNavigationBuilderService.buildStandalonePayload({
      evidenceId: 'TEST-QURAN-004-011',
      evidenceVersion: '1.0.0',
      evidenceType: 'QURAN',
      selectedMadhhab: 'MALIKI',
      languageTag: 'en',
    });

    payload.origin.returnRoute = 'https://malicious-external-site.com';
    const val = EvidenceNavigationValidationService.validatePayload(payload);

    expect(val.isValid).toBe(false);
    expect(val.message).toContain('Open Redirect');
  });
});
