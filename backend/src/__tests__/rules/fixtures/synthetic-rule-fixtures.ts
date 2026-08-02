/**
 * MIZAN — Synthetic Rule Test Fixtures
 *
 * CRITICAL GOVERNANCE WARNING:
 * These rule records are SYNTHETIC TEST FIXTURES for unit testing the rule engine standard.
 * THEY DO NOT CONSTITUTE AUTHORITATIVE ISLAMIC LEGAL RULINGS.
 * They are marked `isTestFixture: true` and `fixtureTag: "TEST_ONLY_FIXTURE"`.
 * THE RULE REGISTRY REGULATOR BLOCKS THEM FROM ENTERING PRODUCTION CALCULATIONS.
 */

import { CanonicalRule } from '@mizan/shared';
import { RuleChecksumService } from '../../../features/rules/services/rule-checksum.service';

const createFixture = (rule: Omit<CanonicalRule, 'versioning'> & { versioning?: Partial<CanonicalRule['versioning']> }): CanonicalRule => {
  const fullRule = {
    ...rule,
    governance: {
      ...rule.governance,
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE' as const,
    },
    versioning: {
      ...rule.versioning,
      contentChecksum: '',
    },
  };
  const checksum = RuleChecksumService.generateRuleChecksum(fullRule);
  fullRule.versioning.contentChecksum = checksum;
  return fullRule as CanonicalRule;
};

/** Fixture 1: Base Spouse Share Rule (No children -> 1/2) */
export const FIXTURE_MIRATH_SPOUSE_BASE: CanonicalRule = createFixture({
  identity: {
    ruleId: 'MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001',
    ruleVersion: '1.0.0',
    ruleFamilyId: 'FAMILY-SPOUSE-FIXED-SHARE',
  },
  titles: {
    titleEn: '[TEST ONLY] Husband Share Without Children (1/2)',
    descriptionEn: 'Synthetic test rule for husband fixed share of 1/2 when no children exist.',
  },
  scope: {
    module: 'MIRATH',
    ruleType: 'MIRATH_FIXED_SHARE',
    madhhabScope: ['ALL_SCHOOLS'],
    knowledgeReleaseVersion: '1.0.0',
    priority: 100,
  },
  applicability: {
    conditions: {
      type: 'GROUP',
      operator: 'ALL',
      conditions: [
        { type: 'LEAF', factsPath: 'heirs.husband.count', operator: 'GREATER_THAN', value: 0 },
        { type: 'LEAF', factsPath: 'computed.hasChildren', operator: 'IS_FALSE' },
      ],
    },
    conditionSummary: 'Husband present AND no children present',
  },
  decisions: [
    {
      decisionType: 'ASSIGN_FIXED_FRACTION',
      targetEntity: 'husband',
      fraction: { n: 1, d: 2 },
      distributionMethod: 'SINGLE_SHARE',
    },
  ],
  evidenceRefs: [
    {
      evidenceId: 'TEST-SOURCE-QURAN-4-12',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Quran 4:12 (Test Reference)',
      evidenceType: 'QURAN',
      evidenceStrength: 'DEFINITIVE',
      isMandatory: true,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '1.0.0',
    createdBy: 'TEST_SUITE_ENGINEER',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedBy: 'TEST_SUITE_ENGINEER',
    updatedAt: '2026-08-02T00:00:00.000Z',
  },
  versioning: {
    contentChecksum: '',
  },
});

/** Fixture 2: Reduced Spouse Share Rule (Children present -> 1/4) */
export const FIXTURE_MIRATH_SPOUSE_WITH_CHILDREN: CanonicalRule = createFixture({
  identity: {
    ruleId: 'MIRATH-FIXED_SHARE-SPOUSE-WITH_CHILDREN-002',
    ruleVersion: '1.0.0',
    ruleFamilyId: 'FAMILY-SPOUSE-FIXED-SHARE',
    overridesRuleId: 'MIRATH-FIXED_SHARE-SPOUSE-NO_CHILDREN-001',
  },
  titles: {
    titleEn: '[TEST ONLY] Husband Share With Children (1/4)',
    descriptionEn: 'Synthetic test rule for husband fixed share of 1/4 when children exist.',
  },
  scope: {
    module: 'MIRATH',
    ruleType: 'MIRATH_FIXED_SHARE',
    madhhabScope: ['ALL_SCHOOLS'],
    knowledgeReleaseVersion: '1.0.0',
    priority: 200,
  },
  applicability: {
    conditions: {
      type: 'GROUP',
      operator: 'ALL',
      conditions: [
        { type: 'LEAF', factsPath: 'heirs.husband.count', operator: 'GREATER_THAN', value: 0 },
        { type: 'LEAF', factsPath: 'computed.hasChildren', operator: 'IS_TRUE' },
      ],
    },
    conditionSummary: 'Husband present AND children present',
  },
  decisions: [
    {
      decisionType: 'ASSIGN_FIXED_FRACTION',
      targetEntity: 'husband',
      fraction: { n: 1, d: 4 },
      distributionMethod: 'SINGLE_SHARE',
    },
  ],
  evidenceRefs: [
    {
      evidenceId: 'TEST-SOURCE-QURAN-4-12',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Quran 4:12 (Test Reference)',
      evidenceType: 'QURAN',
      evidenceStrength: 'DEFINITIVE',
      isMandatory: true,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '1.0.0',
    createdBy: 'TEST_SUITE_ENGINEER',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedBy: 'TEST_SUITE_ENGINEER',
    updatedAt: '2026-08-02T00:00:00.000Z',
  },
  versioning: {
    contentChecksum: '',
  },
});

/** Fixture 3: Maliki Madhhab Specific Override Rule */
export const FIXTURE_MALIKI_RADD_OVERRIDE: CanonicalRule = createFixture({
  identity: {
    ruleId: 'MIRATH-ADJUSTMENT-RADD-MALIKI-001',
    ruleVersion: '1.0.0',
    ruleFamilyId: 'FAMILY-RADD-ADJUSTMENT',
  },
  titles: {
    titleEn: '[TEST ONLY] Maliki Radd Rule Including Spouse',
    descriptionEn: 'Synthetic test rule demonstrating Maliki madhhab override for Radd.',
  },
  scope: {
    module: 'MIRATH',
    ruleType: 'MIRATH_ADJUSTMENT',
    madhhabScope: ['MALIKI'],
    knowledgeReleaseVersion: '1.0.0',
    priority: 300,
  },
  applicability: {
    conditions: {
      type: 'GROUP',
      operator: 'ALL',
      conditions: [
        { type: 'LEAF', factsPath: 'profile.madhhab', operator: 'EQUALS', value: 'MALIKI' },
      ],
    },
    conditionSummary: 'Madhhab is Maliki',
  },
  decisions: [
    {
      decisionType: 'REDUCE_SHARE',
      targetEntity: 'radd_adjustment',
      reductionMethod: 'CUSTOM',
    },
  ],
  evidenceRefs: [
    {
      evidenceId: 'TEST-SOURCE-MALIKI-TEXT',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Mukhtasar Khalil (Test)',
      evidenceType: 'FIQH_BOOK',
      evidenceStrength: 'STRONG',
      isMandatory: false,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '1.0.0',
    createdBy: 'TEST_SUITE_ENGINEER',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedBy: 'TEST_SUITE_ENGINEER',
    updatedAt: '2026-08-02T00:00:00.000Z',
  },
  versioning: {
    contentChecksum: '',
  },
});

/** Fixture 4: Zakat Standard Rate Rule (2.5%) */
export const FIXTURE_ZAKAT_RATE_STANDARD: CanonicalRule = createFixture({
  identity: {
    ruleId: 'ZAKAT-RATE-STANDARD-ALL-001',
    ruleVersion: '1.0.0',
  },
  titles: {
    titleEn: '[TEST ONLY] Standard Zakat Rate (2.5%)',
    descriptionEn: 'Synthetic test rule for standard 2.5% Zakat rate.',
  },
  scope: {
    module: 'ZAKAT',
    ruleType: 'ZAKAT_RATE',
    madhhabScope: ['ALL_SCHOOLS'],
    knowledgeReleaseVersion: '1.0.0',
    priority: 100,
  },
  applicability: {
    conditions: {
      type: 'GROUP',
      operator: 'ALL',
      conditions: [
        { type: 'LEAF', factsPath: 'computed.meetsNisabLower', operator: 'IS_TRUE' },
        { type: 'LEAF', factsPath: 'nisab.hawlMet', operator: 'IS_TRUE' },
      ],
    },
    conditionSummary: 'Wealth meets Nisab AND Hawl requirement is met',
  },
  decisions: [
    {
      decisionType: 'SET_ZAKAT_RATE',
      rateBasisPoints: 250,
      rateAsRational: { n: 1, d: 40 },
      rateLabel: '2.5%',
    },
  ],
  evidenceRefs: [
    {
      evidenceId: 'TEST-SOURCE-HADITH-BUKHARI-ZAKAT',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Sahih al-Bukhari 1454 (Test)',
      evidenceType: 'HADITH',
      evidenceStrength: 'DEFINITIVE',
      isMandatory: true,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '1.0.0',
    createdBy: 'TEST_SUITE_ENGINEER',
    createdAt: '2026-08-02T00:00:00.000Z',
    updatedBy: 'TEST_SUITE_ENGINEER',
    updatedAt: '2026-08-02T00:00:00.000Z',
  },
  versioning: {
    contentChecksum: '',
  },
});
