// Shared package exports — types
export * from './types/inheritance.types';
export * from './types/auth.types';
export type { UserSettings, User, Currency, Language } from './types/user.types';
export * from './types/api.types';
export * from './types/subscription.types';
export * from './types/zakat.types';
export * from './types/profile.types';

// Utility functions
export * from './utils/fraction.utils';
export * from './utils/currency.utils';

// Constants
export * from './constants/heir-types';
export * from './constants/madhhabs';
export * from './constants/asset-types';
export * from './constants/countries';

// Calculation engines
export * from './engines/mirath.engine';
export * from './engines/madhhab-rules';
export { calculateZakat } from './engines/zakat.engine';

// ─── Phase 3: Canonical Rule Standard ────────────────────────────────────────
export * from './types/rule-identifier.types';
export * from './types/rule-types.registry';
export * from './types/rule-condition.types';
export * from './types/rule-decision.types';
export * from './types/canonical-rule.types';
export * from './types/canonical-facts.types';
export * from './types/condition-path.registry';
export * from './engines/condition-evaluator';
export * from './schemas/zod/canonical-rule.schema';

// ─── Phase 4: Canonical Evidence Standard ─────────────────────────────────────
export * from './types/evidence/evidence-identifier.types';
export * from './types/evidence/evidence-type.registry';
export * from './types/evidence/evidence-provenance.types';
export * from './types/evidence/evidence-licensing.types';
export * from './types/evidence/multilingual-content.types';
export * from './types/evidence/quran-translation.types';
export * from './types/evidence/base-evidence.types';
export * from './types/evidence/quran-evidence.types';
export * from './types/evidence/hadith-numbering.types';
export * from './types/evidence/hadith-grading.types';
export * from './types/evidence/hadith-evidence.types';
export * from './types/evidence/fiqh-reference.types';
export * from './types/evidence/scholarly-reference.types';
export * from './types/evidence/institutional-decision.types';
export * from './types/evidence/explanatory-note.types';
export * from './types/evidence/evidence-relationship.types';
export * from './types/evidence/rule-evidence-link.types';
export * from './types/evidence/evidence-citation.types';
export * from './types/evidence/evidence-display.types';
export * from './types/evidence/ai-evidence-context.types';
export * from './types/evidence/evidence-clickable-ref.types';
export * from './schemas/zod/evidence/canonical-evidence.schema';

// ─── Phase 5: Madhhab-Specific Rule Resolution System ──────────────────────
export * from './types/madhhab-resolution.types';

// ─── Phase 6: Inheritance Blocking and Hijab Rule System ───────────────────
export * from './types/hijab-rule.types';
export * from './schemas/zod/hijab-rule.schema';
