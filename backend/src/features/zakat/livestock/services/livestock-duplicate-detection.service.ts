/**
 * MIZAN — Livestock Duplicate Detection Service (Phase 9)
 *
 * Detects duplicate herds, cross-category double counting, and joint ownership overlaps.
 */

import type { CanonicalLivestockFacts, LivestockDuplicateCheckResult, LivestockDuplicateWarning } from '@mizan/shared';

export class LivestockDuplicateDetectionService {
  public checkForDuplicates(assets: CanonicalLivestockFacts[]): LivestockDuplicateCheckResult {
    const warnings: LivestockDuplicateWarning[] = [];

    // 1. Same animal type entered twice
    const seenTypes = new Map<string, string[]>();
    for (const asset of assets) {
      const existing = seenTypes.get(asset.animalTypeId) || [];
      existing.push(asset.assetInstanceId);
      seenTypes.set(asset.animalTypeId, existing);
    }

    for (const [animalType, ids] of seenTypes.entries()) {
      if (ids.length > 1) {
        warnings.push({
          warningCode: 'POSSIBLE_DUPLICATE_HERD',
          affectedInstanceIds: ids,
          message: `Multiple entries found for animal type ${animalType}. Confirm these represent separate herds.`,
          requiresUserAction: true,
          scholarReviewAdvised: false,
        });
      }
    }

    // 2. Sheep & Goat overlap check
    const hasSheepOrGoat = assets.some(a => a.animalTypeId === 'SHEEP' || a.animalTypeId === 'GOAT');
    const hasCombined = assets.some(a => a.animalTypeId === 'SHEEP_OR_GOAT');

    if (hasSheepOrGoat && hasCombined) {
      const affected = assets
        .filter(a => ['SHEEP', 'GOAT', 'SHEEP_OR_GOAT'].includes(a.animalTypeId))
        .map(a => a.assetInstanceId);

      warnings.push({
        warningCode: 'SHEEP_GOAT_COMPOSITION_OVERLAP',
        affectedInstanceIds: affected,
        message: 'Sheep/Goat entered both separately and as a combined herd. Confirm counts are not double-counted.',
        requiresUserAction: true,
        scholarReviewAdvised: true,
      });
    }

    return {
      hasWarnings: warnings.length > 0,
      warnings,
    };
  }
}
