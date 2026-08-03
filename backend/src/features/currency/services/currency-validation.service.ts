/**
 * Currency Validation Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { CurrencyRegistryService } from './currency-registry.service';

export interface CurrencyValidationDetails {
  currencyCode: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CurrencyValidationService {
  public static validateCode(currencyCode: string): CurrencyValidationDetails {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!currencyCode || typeof currencyCode !== 'string') {
      errors.push('INVALID_CURRENCY_CODE: Code must be a non-empty string');
      return { currencyCode, isValid: false, errors, warnings };
    }

    const codeUpper = currencyCode.toUpperCase();
    if (!/^[A-Z]{3}$/.test(codeUpper)) {
      errors.push('INVALID_CURRENCY_FORMAT: Currency code must be a 3-letter uppercase ASCII ISO 4217 code');
    }

    const currency = CurrencyRegistryService.getCurrency(codeUpper);
    if (!currency) {
      errors.push(`UNREGISTERED_CURRENCY: '${codeUpper}' is not registered in the canonical registry`);
    } else {
      if (currency.governance.status === 'DRAFT') {
        errors.push(`DRAFT_CURRENCY: '${codeUpper}' is in DRAFT governance status and cannot be used in production calculations`);
      }
      if (!currency.support.calculationEnabled) {
        errors.push(`CALCULATION_DISABLED: '${codeUpper}' has calculationEnabled=false`);
      }
    }

    return {
      currencyCode: codeUpper,
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
