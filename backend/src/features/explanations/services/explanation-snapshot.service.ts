/**
 * Explanation Snapshot Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationSnapshot, RenderedExplanation } from '@mizan/shared';

export class ExplanationSnapshotService {
  private static snapshotsStore: Map<string, ExplanationSnapshot> = new Map();

  public static createSnapshot(
    calculationId: string,
    resultItemId: string,
    renderedExplanation: RenderedExplanation,
    knowledgeReleaseVersion: string = '1.0.0'
  ): ExplanationSnapshot {
    const snapshotId = `SNAP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const snapshot: ExplanationSnapshot = {
      snapshotId,
      calculationId,
      resultItemId,
      explanationId: renderedExplanation.explanationId,
      explanationVersion: renderedExplanation.explanationVersion,
      languageTag: renderedExplanation.language.resolvedLanguageTag,
      locale: renderedExplanation.language.locale,
      renderedContent: renderedExplanation.content,
      variableValues: renderedExplanation.variables,
      evidenceVersions: renderedExplanation.evidence.map((e) => e.evidenceVersion),
      selectedMadhhab: renderedExplanation.madhhab.madhhabId,
      knowledgeReleaseVersion,
      renderedChecksum: renderedExplanation.integrity.renderedChecksum,
      createdAt: new Date().toISOString(),
      isImmutable: true,
    };

    this.snapshotsStore.set(snapshotId, snapshot);
    return snapshot;
  }

  public static getSnapshot(snapshotId: string): ExplanationSnapshot | null {
    return this.snapshotsStore.get(snapshotId) || null;
  }

  public static getSnapshotsForCalculation(calculationId: string): ExplanationSnapshot[] {
    return Array.from(this.snapshotsStore.values()).filter((s) => s.calculationId === calculationId);
  }

  public static clear(): void {
    this.snapshotsStore.clear();
  }
}
