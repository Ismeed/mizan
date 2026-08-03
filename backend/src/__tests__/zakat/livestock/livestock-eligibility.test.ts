/**
 * MIZAN — Livestock Eligibility Service Tests (Phase 9)
 */

import { LivestockEligibilityService } from '../../../features/zakat/livestock/services/livestock-eligibility.service';
import type { CanonicalLivestockFacts } from '@mizan/shared';

describe('Livestock Eligibility Service', () => {
  const service = new LivestockEligibilityService();

  const createFacts = (overrides: Partial<CanonicalLivestockFacts> = {}): CanonicalLivestockFacts => ({
    assetInstanceId: 'INST-001',
    categoryId: 'LIVESTOCK_CATTLE',
    animalTypeId: 'CATTLE',
    herd: { totalCount: 35 },
    ownership: { hawlMet: true },
    feedingAndGrazing: { method: 'GRAZING' },
    purpose: { classification: 'BREEDING' },
    jointOwnership: { isJointlyOwned: false },
    ...overrides,
  });

  test('Valid grazing herd with Hawl met is ELIGIBLE_FOR_LIVESTOCK_SCHEDULE', () => {
    const facts = createFacts();
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('ELIGIBLE_FOR_LIVESTOCK_SCHEDULE');
    expect(result.isEligible).toBe(true);
  });

  test('Work animals return WORK_ANIMALS_EXEMPT', () => {
    const facts = createFacts({ purpose: { classification: 'WORK' } });
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('WORK_ANIMALS_EXEMPT');
    expect(result.isEligible).toBe(false);
  });

  test('Trade animals return COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE', () => {
    const facts = createFacts({ purpose: { classification: 'TRADE' } });
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('COMMERCIAL_CLASSIFICATION_REQUIRES_DIFFERENT_RULE');
    expect(result.isEligible).toBe(false);
  });

  test('Fodder-fed animals in Hanafi madhhab return FEEDING_OR_GRAZING_CONDITION_NOT_MET', () => {
    const facts = createFacts({ feedingAndGrazing: { method: 'FODDER_FED' } });
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('FEEDING_OR_GRAZING_CONDITION_NOT_MET');
    expect(result.isEligible).toBe(false);
  });

  test('Fodder-fed animals in Maliki madhhab remain ELIGIBLE', () => {
    const facts = createFacts({ feedingAndGrazing: { method: 'FODDER_FED' } });
    const result = service.evaluateEligibility(facts, 'MALIKI');
    expect(result.status).toBe('ELIGIBLE_FOR_LIVESTOCK_SCHEDULE');
    expect(result.isEligible).toBe(true);
  });

  test('Incomplete Hawl returns HOLDING_PERIOD_INCOMPLETE', () => {
    const facts = createFacts({ ownership: { hawlMet: false } });
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('HOLDING_PERIOD_INCOMPLETE');
    expect(result.isEligible).toBe(false);
  });

  test('Jointly owned herd requires scholar review', () => {
    const facts = createFacts({ jointOwnership: { isJointlyOwned: true } });
    const result = service.evaluateEligibility(facts, 'HANAFI');
    expect(result.status).toBe('JOINT_OWNERSHIP_REVIEW_REQUIRED');
    expect(result.requiresScholarReview).toBe(true);
  });
});
