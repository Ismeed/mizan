/**
 * MIZAN — Rule Checksum Service
 *
 * Generates and verifies deterministic SHA-256 checksums for CanonicalRule records.
 * Uses the same sorted-key canonical serialisation pattern as KnowledgeRecord.
 */

import crypto from 'crypto';
import type { CanonicalRule } from '@mizan/shared';

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const result: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    result[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return result;
}

export class RuleChecksumService {
  /**
   * Generates a deterministic SHA-256 hex checksum for a canonical rule.
   *
   * Fields included in the checksum:
   *   ruleId, ruleVersion, module, ruleType, madhhabScope (sorted),
   *   conditions (full tree), decisions (full array), evidenceRefs (sorted by id),
   *   schemaVersion
   *
   * Fields excluded:
   *   contentChecksum itself, governance timestamps, reviewNotes, createdBy, updatedBy
   */
  static generateRuleChecksum(rule: Omit<CanonicalRule, 'versioning'> & { versioning?: Partial<CanonicalRule['versioning']> }): string {
    const canonicalObj = {
      ruleId:           rule.identity.ruleId,
      ruleVersion:      rule.identity.ruleVersion,
      module:           rule.scope.module,
      ruleType:         rule.scope.ruleType,
      madhhabScope:     [...rule.scope.madhhabScope].sort(),
      knowledgeReleaseVersion: rule.scope.knowledgeReleaseVersion,
      priority:         rule.scope.priority ?? 0,
      titles:           rule.titles,
      conditions:       rule.applicability.conditions,
      decisions:        rule.decisions,
      evidenceRefs:     [...rule.evidenceRefs].sort((a, b) => a.evidenceId.localeCompare(b.evidenceId)),
      schemaVersion:    rule.governance.schemaVersion,
    };

    const sortedObj = sortObjectKeys(canonicalObj);
    const jsonString = JSON.stringify(sortedObj);
    return crypto.createHash('sha256').update(jsonString, 'utf8').digest('hex');
  }

  /**
   * Verifies that a rule's embedded contentChecksum matches the computed checksum.
   * Returns false if tampered, missing, or malformed.
   */
  static verifyRuleChecksum(rule: CanonicalRule): boolean {
    try {
      const expected = rule.versioning.contentChecksum;
      const actual = this.generateRuleChecksum(rule);
      return actual === expected;
    } catch {
      return false;
    }
  }
}
