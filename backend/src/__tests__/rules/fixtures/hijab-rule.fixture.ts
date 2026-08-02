/**
 * MIZAN — Hijab Rule Test Fixtures (Phase 6)
 *
 * IMPORTANT: These fixtures are TEST_ONLY_FIXTURE tagged.
 * They MUST NOT be used in any PRODUCTION context.
 * They are structured to mimic real rule format but are NOT scholar-reviewed.
 *
 * Real hijab rules must be authored by qualified Islamic scholars
 * following the HIJAB_RULE_STANDARD.md governance process.
 */

import type { HijabRuleRecord } from '@mizan/shared';

const NOW = '2026-08-01T00:00:00.000Z';
const DUMMY_CHECKSUM = 'a'.repeat(64);

/**
 * TEST FIXTURE: Son blocks Full Brother (HIRMAN, ALL_SCHOOLS)
 * Structural test only — not a complete scholarly record.
 */
export const FIXTURE_SON_BLOCKS_FULL_BROTHER: HijabRuleRecord = {
  hijabRuleId: 'HIJAB-FULLBROTHERS-SONS-001',
  hijabRuleVersion: '1.0.0',
  titleEn: '[TEST] Son blocks Full Brother — Hijab Hirman',
  titleAr: '[اختبار] الابن يحجب الأخ الشقيق حجب حرمان',
  descriptionEn:
    '[TEST FIXTURE] When a son is present, full brothers are completely excluded from inheritance. ' +
    'This fixture is for structural testing only and must not be used in production.',
  category: 'HAJB_BIL_SHAKHSY',
  blockedHeirKey: 'fullBrothers',
  blockingCause: 'sons',
  effectType: 'HIRMAN',
  reducedFraction: undefined,
  madhhabScope: ['ALL_SCHOOLS'],
  evidenceRefs: [
    {
      evidenceId: 'TEST-EVIDENCE-001',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Test Reference Only',
      evidenceType: 'SCHOLARLY_OPINION',
      evidenceStrength: 'ACCEPTABLE',
      isMandatory: false,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '6.0.0',
    createdBy: 'SYSTEM_TEST',
    createdAt: NOW,
    updatedBy: 'SYSTEM_TEST',
    updatedAt: NOW,
    reviewNotes: 'Test fixture — not for production use',
  },
  versioning: {
    contentChecksum: DUMMY_CHECKSUM,
    changelogNote: 'Initial test fixture',
  },
};

/**
 * TEST FIXTURE: Son reduces Mother's share from 1/3 to 1/6 (NUQSAN, ALL_SCHOOLS)
 */
export const FIXTURE_SON_REDUCES_MOTHER_SHARE: HijabRuleRecord = {
  hijabRuleId: 'HIJAB-MOTHER-SONS-001',
  hijabRuleVersion: '1.0.0',
  titleEn: '[TEST] Son reduces Mother\'s share — Hijab Nuqsan',
  titleAr: '[اختبار] الابن يُنقص نصيب الأم من الثلث إلى السدس',
  descriptionEn:
    '[TEST FIXTURE] When a son is present, the mother\'s share is reduced from 1/3 to 1/6. ' +
    'This fixture is for structural testing only.',
  category: 'HAJB_BIL_SHAKHSY',
  blockedHeirKey: 'mother',
  blockingCause: 'sons',
  effectType: 'NUQSAN',
  reducedFraction: { numerator: 1, denominator: 6 },
  madhhabScope: ['ALL_SCHOOLS'],
  evidenceRefs: [
    {
      evidenceId: 'TEST-EVIDENCE-002',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Test Reference Only',
      evidenceType: 'SCHOLARLY_OPINION',
      evidenceStrength: 'ACCEPTABLE',
      isMandatory: false,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '6.0.0',
    createdBy: 'SYSTEM_TEST',
    createdAt: NOW,
    updatedBy: 'SYSTEM_TEST',
    updatedAt: NOW,
    reviewNotes: 'Test fixture — not for production use',
  },
  versioning: {
    contentChecksum: DUMMY_CHECKSUM,
    changelogNote: 'Initial test fixture',
  },
};

/**
 * TEST FIXTURE: Son blocks Paternal Grandfather (HIRMAN, ALL_SCHOOLS)
 */
export const FIXTURE_SON_BLOCKS_PAT_GRANDFATHER: HijabRuleRecord = {
  hijabRuleId: 'HIJAB-PATERNALGRANDFATHERS-SONS-001',
  hijabRuleVersion: '1.0.0',
  titleEn: '[TEST] Son blocks Paternal Grandfather — Hijab Hirman',
  descriptionEn:
    '[TEST FIXTURE] When a son or father is present, the paternal grandfather is excluded. ' +
    'This fixture is for structural testing only.',
  category: 'HAJB_BIL_SHAKHSY',
  blockedHeirKey: 'paternalGrandfathers',
  blockingCause: 'sons',
  effectType: 'HIRMAN',
  madhhabScope: ['ALL_SCHOOLS'],
  evidenceRefs: [
    {
      evidenceId: 'TEST-EVIDENCE-003',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Test Reference Only',
      evidenceType: 'SCHOLARLY_OPINION',
      evidenceStrength: 'ACCEPTABLE',
      isMandatory: false,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '6.0.0',
    createdBy: 'SYSTEM_TEST',
    createdAt: NOW,
    updatedBy: 'SYSTEM_TEST',
    updatedAt: NOW,
  },
  versioning: {
    contentChecksum: DUMMY_CHECKSUM,
  },
};

/**
 * TEST FIXTURE: HANAFI-specific rule — shows madhhab-scoped record
 */
export const FIXTURE_HANAFI_SPECIFIC_BLOCKING: HijabRuleRecord = {
  hijabRuleId: 'HIJAB-PATERNALGRANDFATHERS-FATHER-001',
  hijabRuleVersion: '1.0.0',
  titleEn: '[TEST] Father blocks Paternal Grandfather — Hanafi',
  descriptionEn:
    '[TEST FIXTURE] Under Hanafi fiqh, the father completely excludes the paternal grandfather. ' +
    'Structural test only.',
  category: 'HAJB_BIL_SHAKHSY',
  blockedHeirKey: 'paternalGrandfathers',
  blockingCause: 'father',
  effectType: 'HIRMAN',
  madhhabScope: ['HANAFI'],
  evidenceRefs: [
    {
      evidenceId: 'TEST-EVIDENCE-004',
      evidenceVersion: '1.0.0',
      referenceLabel: 'Test Reference Only',
      evidenceType: 'SCHOLARLY_OPINION',
      evidenceStrength: 'ACCEPTABLE',
      isMandatory: false,
    },
  ],
  explanationRefs: [],
  governance: {
    status: 'DRAFT',
    isTestFixture: true,
    fixtureTag: 'TEST_ONLY_FIXTURE',
    schemaVersion: '6.0.0',
    createdBy: 'SYSTEM_TEST',
    createdAt: NOW,
    updatedBy: 'SYSTEM_TEST',
    updatedAt: NOW,
  },
  versioning: {
    contentChecksum: DUMMY_CHECKSUM,
  },
};

export const ALL_HIJAB_TEST_FIXTURES: HijabRuleRecord[] = [
  FIXTURE_SON_BLOCKS_FULL_BROTHER,
  FIXTURE_SON_REDUCES_MOTHER_SHARE,
  FIXTURE_SON_BLOCKS_PAT_GRANDFATHER,
  FIXTURE_HANAFI_SPECIFIC_BLOCKING,
];
