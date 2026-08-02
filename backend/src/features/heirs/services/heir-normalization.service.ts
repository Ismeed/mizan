/**
 * MIZAN — Heir Normalization Service (Phase 7)
 *
 * Normalizes user-entered terms, legacy keys, and aliases into permanent
 * Canonical Heir IDs. Detects ambiguous inputs and rejects unsupported values.
 *
 * CRITICAL SAFETY RULES:
 * - NEVER determines inheritance eligibility or blocking
 * - NEVER calls AI for authoritative resolution
 * - Ambiguous inputs MUST return `status: 'AMBIGUOUS'` requiring user confirmation
 * - Preserves original user input string for auditability
 */

import {
  BASELINE_HEIR_ALIASES,
  BASELINE_CANONICAL_HEIRS,
  CanonicalHeirId,
  HeirNormalizationRequest,
  HeirNormalizationResult,
  HeirNormalizationOption,
} from '@mizan/shared';
import { prisma } from '../../../config/database';

export class HeirNormalizationService {
  /**
   * Normalizes an input term to a permanent Canonical Heir ID.
   */
  static async normalizeHeirInput(
    request: HeirNormalizationRequest
  ): Promise<HeirNormalizationResult> {
    const rawInput = request.input.trim();
    if (!rawInput) {
      return {
        status: 'UNSUPPORTED',
        originalInput: request.input,
        requiresUserConfirmation: false,
        message: 'Empty heir input provided',
      };
    }

    const normalizedInput = rawInput.toUpperCase().replace(/[-\s]+/g, '_');

    // 1. Direct match on permanent Canonical Heir ID
    const directMatch = BASELINE_CANONICAL_HEIRS.find((h) => h.heirId === normalizedInput);
    if (directMatch) {
      return {
        status: 'RESOLVED',
        originalInput: rawInput,
        resolvedHeirId: directMatch.heirId,
        confidenceMode: 'EXACT_CANONICAL_ID',
        requiresUserConfirmation: false,
      };
    }

    // 2. Check baseline alias registry
    const exactAliases = BASELINE_HEIR_ALIASES.filter(
      (a) =>
        a.aliasText.toLowerCase() === rawInput.toLowerCase() ||
        a.aliasText.toUpperCase().replace(/[-\s]+/g, '_') === normalizedInput
    );

    if (exactAliases.length === 1 && !exactAliases[0].requiresUserConfirmation) {
      return {
        status: 'RESOLVED',
        originalInput: rawInput,
        resolvedHeirId: exactAliases[0].heirId,
        matchedAliasId: exactAliases[0].aliasId,
        confidenceMode: 'EXACT_APPROVED_ALIAS',
        requiresUserConfirmation: false,
      };
    }

    // 3. Ambiguous aliases (multiple exact alias matches or marked requiresUserConfirmation)
    if (exactAliases.length > 0) {
      const options: HeirNormalizationOption[] = exactAliases.map((alias) => {
        const entity = BASELINE_CANONICAL_HEIRS.find((h) => h.heirId === alias.heirId);
        return {
          heirId: alias.heirId,
          localizedLabel: entity?.relationship.canonicalName ?? alias.heirId,
          description: `Relationship: ${entity?.relationship.canonicalName}`,
        };
      });

      return {
        status: 'AMBIGUOUS',
        originalInput: rawInput,
        matchedAliasId: exactAliases[0].aliasId,
        requiresUserConfirmation: true,
        options,
        message: `The term "${rawInput}" is ambiguous. Please clarify the specific relationship.`,
      };
    }

    // 4. Log normalization attempt for audit (skip in test environment)
    if (process.env.NODE_ENV !== 'test') {
      try {
        await (prisma as any).heirNormalizationRecord.create({
          data: {
            original_input: rawInput,
            language_tag: request.languageTag ?? 'en',
            madhhab: request.selectedMadhhab ?? null,
            status: 'UNSUPPORTED',
            user_confirmed: false,
          },
        });
      } catch {
        // Non-blocking audit log
      }
    }

    return {
      status: 'UNSUPPORTED',
      originalInput: rawInput,
      requiresUserConfirmation: false,
      message: `The relationship term "${rawInput}" is not recognized in the canonical registry.`,
    };
  }
}
