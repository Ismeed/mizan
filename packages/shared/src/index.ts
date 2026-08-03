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

// ─── Phase 7: Canonical Heir Identifier and Entity Registry ────────────────
export * from './types/heir/canonical-heir.types';
export * from './types/heir/heir-lineage.types';
export * from './types/heir/heir-localization.types';
export * from './types/heir/heir-alias.types';
export * from './types/heir/heir-group.types';
export * from './types/heir/heir-instance.types';
export * from './types/heir/heir-availability.types';
export * from './schemas/zod/heir/canonical-heir.schema';
export * from './registry/canonical-heirs.registry';
export * from './registry/canonical-heir-groups.registry';
export * from './registry/heir-legacy-alias.registry';

// ─── Phase 8: Canonical Zakat Category Identifier and Asset Registry ────────
export * from './types/zakat/canonical-zakat-category.types';
export * from './types/zakat/zakat-nisab.types';
export * from './types/zakat/zakat-localization.types';
export * from './types/zakat/zakat-alias.types';
export * from './types/zakat/zakat-group.types';
export * from './types/zakat/zakat-asset-instance.types';
export * from './types/zakat/zakat-eligibility.types';
export * from './schemas/zod/zakat/canonical-zakat-category.schema';
export * from './registry/canonical-zakat-categories.registry';
export * from './registry/canonical-zakat-groups.registry';
export * from './registry/zakat-legacy-alias.registry';

// ─── Phase 9: Livestock Zakat Schedule and Obligation Rule Engine ───────────
export * from './types/zakat/livestock';
export * from './registry/livestock-animal-types.registry';
export * from './registry/livestock-animal-classes.registry';
export * from './registry/livestock-schedules.registry';
export * from './schemas/zod/zakat/livestock-schedule.schema';

// ─── Phase 10: Agriculture Zakat Rule and Harvest Calculation Engine ───────
export * from './types/zakat/agriculture';
export * from './registry/agriculture-produce-types.registry';
export * from './registry/agriculture-nisab.registry';
export * from './registry/agriculture-rates.registry';
export * from './registry/agriculture-aggregation-policies.registry';
export * from './registry/agriculture-measurement-units.registry';
export * from './schemas/zod/zakat/agriculture-rule.schema';

// ─── Phase 11: Multilingual Explanation and Localization System ────────────
export * from './types/explanation';
export * from './registry/languages.registry';
export * from './registry/terminology.registry';
export * from './registry/explanation-variable-definitions.registry';
export * from './registry/explanation-type-metadata.registry';
export * from './registry/language-fallback-policies.registry';
export * from './registry/fraction-formatting-policies.registry';
export * from './schemas/zod/explanation/explanation-record.schema';
export * from './schemas/zod/explanation/explanation-translation.schema';

// ─── Phase 12: Currency, Monetary Value and Exchange-Rate Architecture ─────
export * from './types/currency';
export * from './registry/currencies.registry';
export * from './registry/rounding-policies.registry';
export * from './registry/remainder-policies.registry';
export * from './registry/valuation-date-policies.registry';
export * from './schemas/zod/currency/currency-definition.schema';
export * from './schemas/zod/currency/money.schema';

// ─── Phase 13: Standard Calculation Result Contract ───────────────────────
export * from './types/result';

// ─── Phase 14: Standard Mirath and Zakat Report Architecture ──────────────
export * from './types/report';

// ─── Phase 15: Clickable Evidence and AI Assistant Navigation Standard ─────
export * from './types/navigation';

// ─── Phase 16: MIZAN Verified AI Evidence Context Contract ─────────────────
export * from './types/ai-evidence';

