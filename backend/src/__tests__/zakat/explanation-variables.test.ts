/**
 * Explanation Variables & Formatting Unit Tests
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { FractionFormattingService } from '../../features/explanations/services/fraction-formatting.service';
import { MoneyFormattingService } from '../../features/explanations/services/money-formatting.service';
import { EntityLabelResolutionService } from '../../features/explanations/services/entity-label-resolution.service';

describe('Explanation Variables & Formatting Tests', () => {
  it('should format exact fraction symbolically and with words without replacing with rounded decimals', () => {
    const fraction = { numerator: 1, denominator: 8 };

    const compact = FractionFormattingService.formatFraction(fraction, 'FRACTION-DISPLAY-STANDARD-001', 'compact', 'en');
    expect(compact).toBe('1/8');

    const fullEn = FractionFormattingService.formatFraction(fraction, 'FRACTION-DISPLAY-STANDARD-001', 'full', 'en');
    expect(fullEn).toBe('1/8 (one-eighth)');

    const fullAr = FractionFormattingService.formatFraction(fraction, 'FRACTION-DISPLAY-STANDARD-001', 'full', 'ar');
    expect(fullAr).toBe('1/8 (الثمن)');
  });

  it('should format money with locale-aware grouping and currency symbol', () => {
    const ngnFormatted = MoneyFormattingService.formatMoney(1250000, 'NGN', 'en-NG');
    expect(ngnFormatted).toBe('₦1,250,000.00');

    const usdFormatted = MoneyFormattingService.formatMoney(5000, 'USD', 'en-US');
    expect(usdFormatted).toBe('$5,000.00');
  });

  it('should resolve canonical heir and category labels in different languages', () => {
    const wifeEn = EntityLabelResolutionService.resolveEntityLabel('WIFE', 'ENTITY_LABEL', 'en');
    expect(wifeEn).toBeDefined();

    const hanafiAr = EntityLabelResolutionService.resolveEntityLabel('HANAFI', 'ENTITY_LABEL', 'ar');
    expect(hanafiAr).toBe('الحنفي');
  });
});
