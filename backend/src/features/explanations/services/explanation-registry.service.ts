/**
 * Explanation Registry Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationRecord } from '@mizan/shared';
import { ExplanationRecordSchema } from '@mizan/shared';

export class ExplanationRegistryService {
  private static inMemoryStore: Map<string, ExplanationRecord> = new Map();

  public static registerExplanation(record: ExplanationRecord): void {
    const validated = ExplanationRecordSchema.parse(record);
    const key = `${validated.explanationId}:${validated.version}`;
    this.inMemoryStore.set(key, validated as ExplanationRecord);
  }

  public static getExplanation(explanationId: string, version: string = '1.0.0'): ExplanationRecord | null {
    const key = `${explanationId}:${version}`;
    return this.inMemoryStore.get(key) || null;
  }

  public static hasExplanation(explanationId: string, version: string = '1.0.0'): boolean {
    return this.inMemoryStore.has(`${explanationId}:${version}`);
  }

  public static clear(): void {
    this.inMemoryStore.clear();
  }
}
