/**
 * MIZAN — Baseline Synthetic Livestock Schedules Registry (Phase 9)
 *
 * CRITICAL GOVERNANCE NOTICE:
 * All schedule records in this file are synthetic TEST_ONLY_FIXTURE definitions.
 * Zero production thresholds, animal obligations, age classes, or rates are populated here.
 */

import type { CanonicalLivestockSchedule } from '../types/zakat/livestock/livestock-schedule.types';

export const BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES: CanonicalLivestockSchedule[] = [
  {
    scheduleId: 'ZAKAT-LIVESTOCK-CATTLE-SYNTHETIC-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      module: 'ZAKAT',
      ruleType: 'ZAKAT_LIVESTOCK_SCHEDULE',
      categoryId: 'LIVESTOCK_CATTLE',
      animalTypeId: 'CATTLE',
      ruleFamilyId: 'ZAKAT-LIVESTOCK-CATTLE-FAMILY',
      topic: 'LIVESTOCK_ZAKAT',
      subtopic: 'CATTLE_SYNTHETIC_SCHEDULE',
    },
    titles: {
      en: 'Synthetic Cattle Schedule (Development Test Fixture)',
      ar: 'جدول البقر الاصطناعي التجريبي',
    },
    madhhabScope: {
      mode: 'SHARED',
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
      excludedMadhhabs: [],
    },
    eligibilityRuleIds: ['RULE-ZAKAT-LIVESTOCK-ELIGIBILITY-001'],
    scheduleModel: {
      modelType: 'EXPLICIT_BANDS',
      bands: [
        {
          bandId: 'BAND-CATTLE-SYNTHETIC-BELOW-THRESHOLD',
          sequence: 1,
          range: { minimumCount: 0, maximumCount: 29, minimumInclusive: true, maximumInclusive: true },
          obligation: { obligationDefinitionId: 'OBLIGATION-SYNTHETIC-NONE' },
          evidenceLinks: [{ evidenceId: 'EVIDENCE-SYNTHETIC-001', evidenceVersion: '1.0.0', supports: 'COUNT_RANGE' }],
          explanationIds: ['EXPL-LIVESTOCK-BELOW-THRESHOLD'],
          governance: { status: 'DRAFT', isTestFixture: true, fixtureTag: 'TEST_ONLY_FIXTURE' },
        },
        {
          bandId: 'BAND-CATTLE-SYNTHETIC-RANGE-1',
          sequence: 2,
          range: { minimumCount: 30, maximumCount: 39, minimumInclusive: true, maximumInclusive: true },
          obligation: { obligationDefinitionId: 'OBLIGATION-SYNTHETIC-CATTLE-1' },
          evidenceLinks: [{ evidenceId: 'EVIDENCE-SYNTHETIC-002', evidenceVersion: '1.0.0', supports: 'OBLIGATION' }],
          explanationIds: ['EXPL-LIVESTOCK-CATTLE-RANGE-1'],
          governance: { status: 'DRAFT', isTestFixture: true, fixtureTag: 'TEST_ONLY_FIXTURE' },
        },
      ],
      patterns: [],
      combinationRules: [],
      remainderRules: [],
    },
    obligationDefinitions: ['OBLIGATION-SYNTHETIC-NONE', 'OBLIGATION-SYNTHETIC-CATTLE-1'],
    exceptions: [],
    execution: {
      stage: 'LIVESTOCK_SCHEDULE_RESOLUTION',
      priority: 100,
      terminal: true,
    },
    references: {
      evidenceIds: ['EVIDENCE-SYNTHETIC-001', 'EVIDENCE-SYNTHETIC-002'],
      fiqhReferenceIds: [],
      explanationIds: ['EXPL-LIVESTOCK-BELOW-THRESHOLD', 'EXPL-LIVESTOCK-CATTLE-RANGE-1'],
      sourceRecordIds: [],
    },
    governance: {
      status: 'DRAFT',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
      effectiveFrom: '2026-01-01',
    },
    integrity: {
      contentChecksum: 'CATTLE_SYNTHETIC_SCHEDULE_CHECKSUM_v1',
      createdAt: '2026-08-03T00:00:00Z',
      createdBy: 'MIZAN_SYSTEM',
      updatedAt: '2026-08-03T00:00:00Z',
      updatedBy: 'MIZAN_SYSTEM',
    },
  },
];

export function getSyntheticScheduleById(scheduleId: string): CanonicalLivestockSchedule | undefined {
  return BASELINE_SYNTHETIC_LIVESTOCK_SCHEDULES.find(s => s.scheduleId === scheduleId);
}
