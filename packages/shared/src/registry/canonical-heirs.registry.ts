/**
 * MIZAN — Baseline Canonical Heir Registry (Phase 7)
 *
 * The initial baseline of 37 permanent canonical heir entity records.
 *
 * CRITICAL: These records define identity, presentation, and input support metadata ONLY.
 * Eligibility, blocking, and share calculation are strictly determined by the Rule Engine.
 */

import type { HeirEntityRecord, CanonicalHeirId } from '../types/heir/canonical-heir.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'b'.repeat(64);

function createBaselineEntity(
  heirId: CanonicalHeirId,
  canonicalName: string,
  category: HeirEntityRecord['classification']['relationshipCategory'],
  side: HeirEntityRecord['classification']['lineageSide'],
  sex: HeirEntityRecord['classification']['sexClassification'],
  dir: HeirEntityRecord['classification']['generationDirection'],
  dist: number,
  lineagePath: (string | Record<string, string>)[],
  groupMemberships: string[],
  parentHeirId: CanonicalHeirId | null = null,
  maxCount: number | null = null,
  unsupportedInJafari = false
): HeirEntityRecord {
  const isSupportedAll = { inputSupportStatus: 'SUPPORTED' as const };
  const isNotSupported = { inputSupportStatus: 'NOT_SUPPORTED' as const };

  return {
    heirId,
    version: '1.0.0',
    schemaVersion: '1.0.0',
    classification: {
      relationshipCategory: category,
      lineageSide: side,
      sexClassification: sex,
      generationDirection: dir,
      generationDistance: dist,
    },
    relationship: {
      canonicalName,
      lineagePath,
      parentHeirId,
    },
    localization: {
      labelKey: `heir.${heirId.toLowerCase()}.label`,
      descriptionKey: `heir.${heirId.toLowerCase()}.description`,
      singularLabelKey: `heir.${heirId.toLowerCase()}.singular`,
      pluralLabelKey: `heir.${heirId.toLowerCase()}.plural`,
    },
    madhhabMetadata: {
      HANAFI: isSupportedAll,
      MALIKI: isSupportedAll,
      SHAFII: isSupportedAll,
      HANBALI: isSupportedAll,
      JAFARI: unsupportedInJafari ? isNotSupported : isSupportedAll,
    },
    groupMemberships,
    inputMetadata: {
      allowCount: true,
      minimumCount: 0,
      maximumCount: maxCount,
      allowIndividualNames: false,
    },
    governance: {
      status: 'DRAFT',
      effectiveFrom: NOW,
    },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  };
}

export const BASELINE_CANONICAL_HEIRS: HeirEntityRecord[] = [
  // ─── Spouses ─────────────────────────────────────────────────────────────
  createBaselineEntity('HUSBAND', 'Husband', 'SPOUSE', 'NONE', 'MALE', 'SAME_GENERATION', 0, ['SPOUSE'], ['SPOUSES'], null, 1),
  createBaselineEntity('WIFE', 'Wife', 'SPOUSE', 'NONE', 'FEMALE', 'SAME_GENERATION', 0, ['SPOUSE'], ['SPOUSES'], null, 4),

  // ─── Immediate Ascendants ───────────────────────────────────────────────
  createBaselineEntity('FATHER', 'Father', 'ASCENDANT', 'PATERNAL', 'MALE', 'ASCENDING', 1, ['FATHER'], ['PARENTS', 'ASCENDANTS'], null, 1),
  createBaselineEntity('MOTHER', 'Mother', 'ASCENDANT', 'MATERNAL', 'FEMALE', 'ASCENDING', 1, ['MOTHER'], ['PARENTS', 'ASCENDANTS'], null, 1),

  // ─── Grandparents & Higher Ascendants ──────────────────────────────────
  createBaselineEntity('PATERNAL_GRANDFATHER', 'Paternal Grandfather', 'ASCENDANT', 'PATERNAL', 'MALE', 'ASCENDING', 2, ['FATHER', 'FATHER'], ['GRANDPARENTS', 'ASCENDANTS'], 'FATHER', 1),
  createBaselineEntity('MATERNAL_GRANDFATHER', 'Maternal Grandfather', 'ASCENDANT', 'MATERNAL', 'MALE', 'ASCENDING', 2, ['MOTHER', 'FATHER'], ['GRANDPARENTS', 'ASCENDANTS'], 'MOTHER', 1),
  createBaselineEntity('PATERNAL_GRANDMOTHER', 'Paternal Grandmother', 'ASCENDANT', 'PATERNAL', 'FEMALE', 'ASCENDING', 2, ['FATHER', 'MOTHER'], ['GRANDPARENTS', 'ASCENDANTS'], 'FATHER', 1),
  createBaselineEntity('MATERNAL_GRANDMOTHER', 'Maternal Grandmother', 'ASCENDANT', 'MATERNAL', 'FEMALE', 'ASCENDING', 2, ['MOTHER', 'MOTHER'], ['GRANDPARENTS', 'ASCENDANTS'], 'MOTHER', 1),
  createBaselineEntity('PATERNAL_GREAT_GRANDFATHER', 'Paternal Great-Grandfather', 'ASCENDANT', 'PATERNAL', 'MALE', 'ASCENDING', 3, ['FATHER', 'FATHER', 'FATHER'], ['ASCENDANTS'], 'PATERNAL_GRANDFATHER', 1),
  createBaselineEntity('MATERNAL_GREAT_GRANDFATHER', 'Maternal Great-Grandfather', 'ASCENDANT', 'MATERNAL', 'MALE', 'ASCENDING', 3, ['MOTHER', 'FATHER', 'FATHER'], ['ASCENDANTS'], 'MATERNAL_GRANDFATHER', 1),
  createBaselineEntity('PATERNAL_GREAT_GRANDMOTHER', 'Paternal Great-Grandmother', 'ASCENDANT', 'PATERNAL', 'FEMALE', 'ASCENDING', 3, ['FATHER', 'FATHER', 'MOTHER'], ['ASCENDANTS'], 'PATERNAL_GRANDMOTHER', 1),
  createBaselineEntity('MATERNAL_GREAT_GRANDMOTHER', 'Maternal Great-Grandmother', 'ASCENDANT', 'MATERNAL', 'FEMALE', 'ASCENDING', 3, ['MOTHER', 'MOTHER', 'MOTHER'], ['ASCENDANTS'], 'MATERNAL_GRANDMOTHER', 1),

  // ─── Immediate Descendants ──────────────────────────────────────────────
  createBaselineEntity('SON', 'Son', 'DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 1, ['SON'], ['IMMEDIATE_DESCENDANTS', 'DESCENDANTS', 'MALE_DESCENDANTS']),
  createBaselineEntity('DAUGHTER', 'Daughter', 'DESCENDANT', 'PATERNAL', 'FEMALE', 'DESCENDING', 1, ['DAUGHTER'], ['IMMEDIATE_DESCENDANTS', 'DESCENDANTS', 'FEMALE_DESCENDANTS']),

  // ─── Descendants Through Son ───────────────────────────────────────────
  createBaselineEntity('SONS_SON', "Son's Son", 'DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 2, ['SON', 'SON'], ['DESCENDANTS', 'MALE_DESCENDANTS'], 'SON'),
  createBaselineEntity('SONS_DAUGHTER', "Son's Daughter", 'DESCENDANT', 'PATERNAL', 'FEMALE', 'DESCENDING', 2, ['SON', 'DAUGHTER'], ['DESCENDANTS', 'FEMALE_DESCENDANTS'], 'SON'),
  createBaselineEntity('SONS_SONS_SON', "Son's Son's Son", 'DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 3, ['SON', 'SON', 'SON'], ['DESCENDANTS', 'MALE_DESCENDANTS'], 'SONS_SON'),
  createBaselineEntity('SONS_SONS_DAUGHTER', "Son's Son's Daughter", 'DESCENDANT', 'PATERNAL', 'FEMALE', 'DESCENDING', 3, ['SON', 'SON', 'DAUGHTER'], ['DESCENDANTS', 'FEMALE_DESCENDANTS'], 'SONS_SON'),

  // ─── Descendants Through Daughter ──────────────────────────────────────
  createBaselineEntity('DAUGHTERS_SON', "Daughter's Son", 'DESCENDANT', 'MATERNAL', 'MALE', 'DESCENDING', 2, ['DAUGHTER', 'SON'], ['DESCENDANTS'], 'DAUGHTER'),
  createBaselineEntity('DAUGHTERS_DAUGHTER', "Daughter's Daughter", 'DESCENDANT', 'MATERNAL', 'FEMALE', 'DESCENDING', 2, ['DAUGHTER', 'DAUGHTER'], ['DESCENDANTS'], 'DAUGHTER'),

  // ─── Full Siblings ─────────────────────────────────────────────────────
  createBaselineEntity('FULL_BROTHER', 'Full Brother', 'SIBLING', 'BOTH', 'MALE', 'SAME_GENERATION', 0, [{ sharedParent: 'BOTH' }], ['FULL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('FULL_SISTER', 'Full Sister', 'SIBLING', 'BOTH', 'FEMALE', 'SAME_GENERATION', 0, [{ sharedParent: 'BOTH' }], ['FULL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),

  // ─── Paternal Siblings ─────────────────────────────────────────────────
  createBaselineEntity('PATERNAL_BROTHER', 'Paternal Brother', 'SIBLING', 'PATERNAL', 'MALE', 'SAME_GENERATION', 0, [{ sharedParent: 'FATHER' }], ['PATERNAL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('PATERNAL_SISTER', 'Paternal Sister', 'SIBLING', 'PATERNAL', 'FEMALE', 'SAME_GENERATION', 0, [{ sharedParent: 'FATHER' }], ['PATERNAL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),

  // ─── Maternal Siblings ─────────────────────────────────────────────────
  createBaselineEntity('MATERNAL_BROTHER', 'Maternal Brother', 'SIBLING', 'MATERNAL', 'MALE', 'SAME_GENERATION', 0, [{ sharedParent: 'MOTHER' }], ['MATERNAL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('MATERNAL_SISTER', 'Maternal Sister', 'SIBLING', 'MATERNAL', 'FEMALE', 'SAME_GENERATION', 0, [{ sharedParent: 'MOTHER' }], ['MATERNAL_SIBLINGS', 'SIBLINGS', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('MATERNAL_HALF_SIBLING', 'Maternal Half-Sibling', 'SIBLING', 'MATERNAL', 'MALE', 'SAME_GENERATION', 0, [{ sharedParent: 'MOTHER' }], ['MATERNAL_SIBLINGS', 'SIBLINGS']),

  // ─── Descendants of Full Brothers ──────────────────────────────────────
  createBaselineEntity('FULL_BROTHERS_SON', "Full Brother's Son", 'SIBLING_DESCENDANT', 'BOTH', 'MALE', 'DESCENDING', 1, [{ sharedParent: 'BOTH' }, 'SON'], ['SIBLINGS_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FULL_BROTHER'),
  createBaselineEntity('FULL_BROTHERS_SONS_SON', "Full Brother's Son's Son", 'SIBLING_DESCENDANT', 'BOTH', 'MALE', 'DESCENDING', 2, [{ sharedParent: 'BOTH' }, 'SON', 'SON'], ['SIBLINGS_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FULL_BROTHERS_SON'),

  // ─── Descendants of Paternal Brothers ──────────────────────────────────
  createBaselineEntity('PATERNAL_BROTHERS_SON', "Paternal Brother's Son", 'SIBLING_DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 1, [{ sharedParent: 'FATHER' }, 'SON'], ['SIBLINGS_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'PATERNAL_BROTHER'),
  createBaselineEntity('PATERNAL_BROTHERS_SONS_SON', "Paternal Brother's Son's Son", 'SIBLING_DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 2, [{ sharedParent: 'FATHER' }, 'SON', 'SON'], ['SIBLINGS_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'PATERNAL_BROTHERS_SON'),

  // ─── Father's Full Brothers & Descendants ──────────────────────────────
  createBaselineEntity('FATHERS_FULL_BROTHER', "Father's Full Brother", 'PATERNAL_UNCLE', 'PATERNAL', 'MALE', 'SAME_GENERATION', 1, ['FATHER', { sharedParent: 'BOTH' }], ['PATERNAL_UNCLES', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('FATHERS_FULL_BROTHERS_SON', "Father's Full Brother's Son", 'PATERNAL_UNCLE_DESCENDANT', 'PATERNAL', 'MALE', 'SAME_GENERATION', 0, ['FATHER', { sharedParent: 'BOTH' }, 'SON'], ['PATERNAL_UNCLES_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FATHERS_FULL_BROTHER'),
  createBaselineEntity('FATHERS_FULL_BROTHERS_SONS_SON', "Father's Full Brother's Son's Son", 'PATERNAL_UNCLE_DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 1, ['FATHER', { sharedParent: 'BOTH' }, 'SON', 'SON'], ['PATERNAL_UNCLES_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FATHERS_FULL_BROTHERS_SON'),

  // ─── Father's Paternal Brothers & Descendants ──────────────────────────
  createBaselineEntity('FATHERS_PATERNAL_BROTHER', "Father's Paternal Brother", 'PATERNAL_UNCLE', 'PATERNAL', 'MALE', 'SAME_GENERATION', 1, ['FATHER', { sharedParent: 'FATHER' }], ['PATERNAL_UNCLES', 'COLLATERAL_RELATIVES']),
  createBaselineEntity('FATHERS_PATERNAL_BROTHERS_SON', "Father's Paternal Brother's Son", 'PATERNAL_UNCLE_DESCENDANT', 'PATERNAL', 'MALE', 'SAME_GENERATION', 0, ['FATHER', { sharedParent: 'FATHER' }, 'SON'], ['PATERNAL_UNCLES_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FATHERS_PATERNAL_BROTHER'),
  createBaselineEntity('FATHERS_PATERNAL_BROTHERS_SONS_SON', "Father's Paternal Brother's Son's Son", 'PATERNAL_UNCLE_DESCENDANT', 'PATERNAL', 'MALE', 'DESCENDING', 1, ['FATHER', { sharedParent: 'FATHER' }, 'SON', 'SON'], ['PATERNAL_UNCLES_DESCENDANTS', 'COLLATERAL_RELATIVES'], 'FATHERS_PATERNAL_BROTHERS_SON'),
];
