/**
 * MIZAN — Agriculture Fact Normalization Service (Phase 10)
 */

import {
  CanonicalAgricultureFacts,
  CanonicalAgricultureFactsSchema,
} from '@mizan/shared';

export class AgricultureFactNormalizationService {
  public normalizeFacts(rawFacts: unknown): CanonicalAgricultureFacts {
    const parsed = CanonicalAgricultureFactsSchema.safeParse(rawFacts);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      throw new Error(`INVALID_AGRICULTURE_FACTS: ${errorMsg}`);
    }
    return parsed.data as CanonicalAgricultureFacts;
  }
}
