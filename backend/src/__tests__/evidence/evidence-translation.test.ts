import { EvidenceChecksumService } from '../../features/evidence/services/evidence-checksum.service';

describe('Evidence Translation Governance & Checksum Tests (Phase 4)', () => {
  it('generates SHA-256 checksum for translation text deterministically', () => {
    const text = 'Allah instructs you concerning your children...';
    const c1 = EvidenceChecksumService.generateTranslationChecksum(text, 'en');
    const c2 = EvidenceChecksumService.generateTranslationChecksum(text, 'en');

    expect(c1).toBe(c2);
    expect(c1.length).toBe(64);
  });

  it('generates different checksum for different language tags or text', () => {
    const text = 'Allah instructs you concerning your children...';
    const cEn = EvidenceChecksumService.generateTranslationChecksum(text, 'en');
    const cHa = EvidenceChecksumService.generateTranslationChecksum(text, 'ha');

    expect(cEn).not.toBe(cHa);
  });
});
