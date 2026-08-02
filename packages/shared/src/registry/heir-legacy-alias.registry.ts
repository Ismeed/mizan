/**
 * MIZAN — Legacy Heir Alias Registry (Phase 7)
 *
 * Migration map for mapping legacy camelCase keys, old HeirType enum values,
 * and user-facing screen labels to permanent Canonical Heir IDs.
 */

import type { HeirAliasRecord } from '../types/heir/heir-alias.types';
import type { CanonicalHeirId } from '../types/heir/canonical-heir.types';

function createAlias(
  aliasId: string,
  heirId: CanonicalHeirId,
  languageTag: string,
  aliasText: string,
  aliasType: HeirAliasRecord['aliasType'],
  requiresUserConfirmation = false
): HeirAliasRecord {
  return {
    aliasId,
    heirId,
    languageTag,
    aliasText,
    aliasType,
    matchingMode: 'EXACT',
    requiresUserConfirmation,
    reviewStatus: 'APPROVED',
  };
}

export const BASELINE_HEIR_ALIASES: HeirAliasRecord[] = [
  // ─── Legacy camelCase keys ───────────────────────────────────────────────
  createAlias('ALIAS-LEGACY-HUSBAND', 'HUSBAND', 'en', 'husband', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-WIVES', 'WIFE', 'en', 'wives', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-SONS', 'SON', 'en', 'sons', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-DAUGHTERS', 'DAUGHTER', 'en', 'daughters', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-FATHER', 'FATHER', 'en', 'father', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-MOTHER', 'MOTHER', 'en', 'mother', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-PAT-GF', 'PATERNAL_GRANDFATHER', 'en', 'paternalGrandfathers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-PAT-GM', 'PATERNAL_GRANDMOTHER', 'en', 'paternalGrandmothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-MAT-GM', 'MATERNAL_GRANDMOTHER', 'en', 'maternalGrandmothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-FULL-BROTHERS', 'FULL_BROTHER', 'en', 'fullBrothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-FULL-SISTERS', 'FULL_SISTER', 'en', 'fullSisters', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-PAT-BROTHERS', 'PATERNAL_BROTHER', 'en', 'paternalHalfBrothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-PAT-SISTERS', 'PATERNAL_SISTER', 'en', 'paternalHalfSisters', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-MAT-SIBLINGS', 'MATERNAL_HALF_SIBLING', 'en', 'maternalHalfSiblings', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-SONS-FULL-BRO', 'FULL_BROTHERS_SON', 'en', 'sonsOfFullBrothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-SONS-PAT-BRO', 'PATERNAL_BROTHERS_SON', 'en', 'sonsOfPatHalfBrothers', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-PAT-UNCLES', 'FATHERS_FULL_BROTHER', 'en', 'paternalUncles', 'LEGACY_CAMELCASE_KEY'),
  createAlias('ALIAS-LEGACY-SONS-PAT-UNCLES', 'FATHERS_FULL_BROTHERS_SON', 'en', 'sonsOfPatUncles', 'LEGACY_CAMELCASE_KEY'),

  // ─── English Screen Labels ────────────────────────────────────────────────
  createAlias('ALIAS-LABEL-EN-HUSBAND', 'HUSBAND', 'en', 'Husband', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-WIFE', 'WIFE', 'en', 'Wife', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-WIFE-PL', 'WIFE', 'en', 'Wives', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-SON', 'SON', 'en', 'Son', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-SONS', 'SON', 'en', 'Sons', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-DAUGHTER', 'DAUGHTER', 'en', 'Daughter', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-DAUGHTERS', 'DAUGHTER', 'en', 'Daughters', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-FATHER', 'FATHER', 'en', 'Father', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-MOTHER', 'MOTHER', 'en', 'Mother', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-FULL-BROTHER', 'FULL_BROTHER', 'en', 'Full Brother', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-FULL-SISTER', 'FULL_SISTER', 'en', 'Full Sister', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-PAT-GF', 'PATERNAL_GRANDFATHER', 'en', 'Paternal Grandfather', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-MAT-GF', 'MATERNAL_GRANDFATHER', 'en', 'Maternal Grandfather', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-PAT-GM', 'PATERNAL_GRANDMOTHER', 'en', 'Paternal Grandmother', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-EN-MAT-GM', 'MATERNAL_GRANDMOTHER', 'en', 'Maternal Grandmother', 'COMMON_TERM'),

  // ─── Arabic Screen Labels ─────────────────────────────────────────────────
  createAlias('ALIAS-LABEL-AR-HUSBAND', 'HUSBAND', 'ar', 'زوج', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-WIFE', 'WIFE', 'ar', 'زوجة', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-SON', 'SON', 'ar', 'ابن', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-DAUGHTER', 'DAUGHTER', 'ar', 'بنت', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-FATHER', 'FATHER', 'ar', 'أب', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-MOTHER', 'MOTHER', 'ar', 'أم', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-FULL-BROTHER', 'FULL_BROTHER', 'ar', 'أخ شقيق', 'SCHOLARLY_TERM'),
  createAlias('ALIAS-LABEL-AR-FULL-SISTER', 'FULL_SISTER', 'ar', 'أخت شقيقة', 'SCHOLARLY_TERM'),

  // ─── Hausa Common Labels ──────────────────────────────────────────────────
  createAlias('ALIAS-LABEL-HA-FULL-BROTHER', 'FULL_BROTHER', 'ha', 'Ɗan’uwa na uwa da uba', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-HA-FULL-SISTER', 'FULL_SISTER', 'ha', '’Yar’uwa ta uwa da uba', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-HA-FATHER', 'FATHER', 'ha', 'Uba', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-HA-MOTHER', 'MOTHER', 'ha', 'Uwa', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-HA-HUSBAND', 'HUSBAND', 'ha', 'Miji', 'COMMON_TERM'),
  createAlias('ALIAS-LABEL-HA-WIFE', 'WIFE', 'ha', 'Mata', 'COMMON_TERM'),

  // ─── Ambiguous Terms Requiring Confirmation ──────────────────────────────
  createAlias('ALIAS-AMBIG-GRANDFATHER-PAT', 'PATERNAL_GRANDFATHER', 'en', 'Grandfather', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-GRANDFATHER-MAT', 'MATERNAL_GRANDFATHER', 'en', 'Grandfather', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-GRANDMOTHER-PAT', 'PATERNAL_GRANDMOTHER', 'en', 'Grandmother', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-GRANDMOTHER-MAT', 'MATERNAL_GRANDMOTHER', 'en', 'Grandmother', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-BROTHER-FULL', 'FULL_BROTHER', 'en', 'Brother', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-BROTHER-PAT', 'PATERNAL_BROTHER', 'en', 'Brother', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-SISTER-FULL', 'FULL_SISTER', 'en', 'Sister', 'COMMON_TERM', true),
  createAlias('ALIAS-AMBIG-SISTER-PAT', 'PATERNAL_SISTER', 'en', 'Sister', 'COMMON_TERM', true),
];
