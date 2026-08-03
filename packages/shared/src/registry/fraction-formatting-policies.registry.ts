/**
 * Fraction Formatting Policies Registry
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { FractionFormattingPolicy } from '../types/explanation/formatting-policy.types';

export const FRACTION_FORMATTING_POLICIES: Record<string, FractionFormattingPolicy> = {
  'FRACTION-DISPLAY-STANDARD-001': {
    policyId: 'FRACTION-DISPLAY-STANDARD-001',
    displayModes: {
      compact: 'SYMBOLIC',
      full: 'SYMBOLIC_AND_WORDS',
      report: 'SYMBOLIC_WORDS_AND_PERCENTAGE',
    },
    preserveExactFraction: true,
  },
};
