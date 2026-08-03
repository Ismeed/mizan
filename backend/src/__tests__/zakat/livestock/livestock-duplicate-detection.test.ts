/**
 * MIZAN — Livestock Duplicate Detection Tests (Phase 9)
 */

import { LivestockDuplicateDetectionService } from '../../../features/zakat/livestock/services/livestock-duplicate-detection.service';
import type { CanonicalLivestockFacts } from '@mizan/shared';

describe('Livestock Duplicate Detection Service', () => {
  const service = new LivestockDuplicateDetectionService();

  const createFacts = (id: string, animalType: any): CanonicalLivestockFacts => ({
    assetInstanceId: id,
    categoryId: 'LIVESTOCK_CATTLE',
    animalTypeId: animalType,
    herd: { totalCount: 30 },
    ownership: { hawlMet: true },
    feedingAndGrazing: { method: 'GRAZING' },
    purpose: { classification: 'BREEDING' },
    jointOwnership: { isJointlyOwned: false },
  });

  test('Single animal type entry returns no duplicate warnings', () => {
    const assets = [createFacts('INST-1', 'CATTLE')];
    const result = service.checkForDuplicates(assets);
    expect(result.hasWarnings).toBe(false);
    expect(result.warnings.length).toBe(0);
  });

  test('Duplicate animal type entries trigger POSSIBLE_DUPLICATE_HERD warning', () => {
    const assets = [
      createFacts('INST-1', 'CATTLE'),
      createFacts('INST-2', 'CATTLE'),
    ];
    const result = service.checkForDuplicates(assets);
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings[0].warningCode).toBe('POSSIBLE_DUPLICATE_HERD');
    expect(result.warnings[0].affectedInstanceIds).toEqual(['INST-1', 'INST-2']);
  });

  test('Sheep entered separately and as combined herd triggers SHEEP_GOAT_COMPOSITION_OVERLAP warning', () => {
    const assets = [
      createFacts('INST-1', 'SHEEP'),
      createFacts('INST-2', 'SHEEP_OR_GOAT'),
    ];
    const result = service.checkForDuplicates(assets);
    expect(result.hasWarnings).toBe(true);
    expect(result.warnings[0].warningCode).toBe('SHEEP_GOAT_COMPOSITION_OVERLAP');
  });
});
