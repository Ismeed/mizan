/**
 * Result Integrity Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { ResultIntegrityService } from '../../features/results/services/result-integrity.service';

describe('Result Integrity Tests', () => {
  it('should generate a deterministic checksum and verify matching data', () => {
    const data = { a: 1, b: 'test', c: [1, 2, 3] };
    const dataSameKeyOrder = { c: [1, 2, 3], b: 'test', a: 1 };

    const checksum1 = ResultIntegrityService.generateChecksum(data);
    const checksum2 = ResultIntegrityService.generateChecksum(dataSameKeyOrder);

    expect(checksum1).toBe(checksum2);
    expect(ResultIntegrityService.verifyChecksum(data, checksum1)).toBe(true);
  });
});
