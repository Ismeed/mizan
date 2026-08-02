/**
 * MIZAN — Zakat Category Localization Service (Phase 8)
 *
 * Returns localized labels and descriptions for canonical Zakat categories.
 *
 * In this baseline implementation, labels are returned as i18n keys.
 * A full localization database will be populated in the knowledge management phase.
 *
 * CRITICAL: Changing localization for a category must never change its canonical ID.
 */

import type {
  CanonicalZakatCategoryId,
  SupportedZakatLanguage,
  ZakatCategoryLabelSet,
  ZakatCategoryLocalizationRecord,
} from '@mizan/shared';
import { getZakatCategoryById } from '@mizan/shared';

// ── Baseline English label sets ────────────────────────────────────────────────
// These are inline for now. A database-backed service will replace this in Phase 9.

const EN_LABELS: Record<string, ZakatCategoryLabelSet> = {
  CASH_AND_BANK:         { label: 'Cash & Bank',             description: 'Cash in hand and bank current or savings accounts',                reportLabel: 'Cash and Bank Accounts',         inputPlaceholder: 'Enter total cash and bank balance',    arabicTerm: 'Nuqud' },
  FOREIGN_CURRENCY:      { label: 'Foreign Currency',        description: 'Currency holdings other than your base currency',                   reportLabel: 'Foreign Currency Holdings',       inputPlaceholder: 'Enter total in your base currency' },
  DIGITAL_CURRENCY:      { label: 'Digital Currency',        description: 'Cryptocurrency and digital tokens (contemporary ruling required)',   reportLabel: 'Digital Currency Holdings',       inputPlaceholder: 'Enter value in your base currency' },
  GOLD:                  { label: 'Gold',                    description: 'Gold held in any form including jewellery, bullion, and coins',     reportLabel: 'Gold',                            inputPlaceholder: 'Enter weight in grams',                arabicTerm: 'Dhahab' },
  SILVER:                { label: 'Silver',                  description: 'Silver held in any form including jewellery, bullion, and coins',   reportLabel: 'Silver',                          inputPlaceholder: 'Enter weight in grams',                arabicTerm: 'Fidda' },
  BUSINESS_INVENTORY:    { label: 'Business Inventory',      description: 'Stock and goods intended for trade or sale',                        reportLabel: 'Business Inventory and Stock',    inputPlaceholder: 'Enter market value',                   arabicTerm: 'Mal al-Tijarah' },
  BUSINESS_RECEIVABLES:  { label: 'Business Receivables',   description: 'Amounts owed to the business that are expected to be recovered',    reportLabel: 'Business Receivables',            inputPlaceholder: 'Enter total expected recovery amount' },
  BUSINESS_INVESTMENTS:  { label: 'Business Investments',   description: 'Equity stakes and investments in business ventures',                reportLabel: 'Business Equity and Investments', inputPlaceholder: 'Enter current market value' },
  QUOTED_INVESTMENTS:    { label: 'Stocks & Funds',          description: 'Publicly traded shares, funds, and ETFs at current market value',  reportLabel: 'Quoted Investments',              inputPlaceholder: 'Enter current market value' },
  UNQUOTED_INVESTMENTS:  { label: 'Private Equity',         description: 'Unlisted shares and private company equity holdings',              reportLabel: 'Unquoted Investments',            inputPlaceholder: 'Enter estimated value' },
  PENSION_FUNDS:         { label: 'Pension Fund',            description: 'Pension and retirement fund value accessible to you',              reportLabel: 'Pension and Retirement Funds',    inputPlaceholder: 'Enter accessible value' },
  BONDS_AND_SUKUK:       { label: 'Bonds & Sukuk',           description: 'Fixed-income instruments and Islamic bonds held for investment',   reportLabel: 'Bonds and Sukuk',                 inputPlaceholder: 'Enter face or market value' },
  PERSONAL_RECEIVABLES:  { label: 'Personal Receivables',   description: 'Money owed to you that you expect to be repaid',                  reportLabel: 'Personal Receivables',            inputPlaceholder: 'Enter expected recovery amount' },
  LOAN_GIVEN:            { label: 'Loans Given',             description: 'Recoverable loans and money lent to others',                      reportLabel: 'Loans Given',                     inputPlaceholder: 'Enter total loan amount' },
  AGRICULTURAL_PRODUCE:  { label: 'Agricultural Produce',   description: 'Crops and harvests subject to Ushr at time of harvest',            reportLabel: 'Agricultural Produce',            inputPlaceholder: 'Enter weight in kilograms',            arabicTerm: 'Zakat al-Zuru\'' },
  LIVESTOCK_CAMELS:      { label: 'Camels',                  description: 'Camels (ibil) held for trade or breeding',                        reportLabel: 'Livestock — Camels',              inputPlaceholder: 'Enter number of camels',               arabicTerm: 'Ibil' },
  LIVESTOCK_CATTLE:      { label: 'Cattle',                  description: 'Cattle and buffalo (baqar) held for trade or breeding',           reportLabel: 'Livestock — Cattle',              inputPlaceholder: 'Enter number of cattle',               arabicTerm: 'Baqar' },
  LIVESTOCK_SHEEP_GOATS: { label: 'Sheep & Goats',           description: 'Sheep and goats (ghanam) held for trade or breeding',            reportLabel: 'Livestock — Sheep and Goats',     inputPlaceholder: 'Enter number of animals',              arabicTerm: 'Ghanam' },
  RENTAL_INCOME:         { label: 'Rental Income',           description: 'Net rental income from investment property',                      reportLabel: 'Net Rental Income',               inputPlaceholder: 'Enter annual net rental income' },
  SAVINGS_DEPOSITS:      { label: 'Savings & Deposits',      description: 'Fixed-term savings accounts and bank deposits',                   reportLabel: 'Savings and Deposits',            inputPlaceholder: 'Enter total savings balance' },
  CURRENT_LIABILITIES:   { label: 'Current Liabilities',    description: 'Debts currently due and payable that can be deducted from assets', reportLabel: 'Current Liabilities (Deductible)', inputPlaceholder: 'Enter total current debts' },
  DEFERRED_LIABILITIES:  { label: 'Deferred Liabilities',   description: 'Longer-term debts (madhhab-specific deductibility)',              reportLabel: 'Deferred Liabilities',            inputPlaceholder: 'Enter total deferred liabilities' },
};

export class ZakatLocalizationService {

  /**
   * Get the localized label set for a canonical Zakat category.
   * Falls back to English if the requested language is not available.
   */
  getLocalizedLabelSet(
    categoryId: CanonicalZakatCategoryId,
    language: SupportedZakatLanguage = 'en',
  ): ZakatCategoryLabelSet {
    // Currently only English is implemented at the baseline.
    // Other languages will be added via the knowledge management system.
    const englishSet = EN_LABELS[categoryId];
    if (!englishSet) {
      const entity = getZakatCategoryById(categoryId);
      return {
        label: entity?.canonicalName ?? categoryId,
        description: '',
        reportLabel: entity?.canonicalName ?? categoryId,
      };
    }
    return englishSet;
  }

  /**
   * Get a full localization record for a category.
   * Currently returns English only.
   */
  getLocalizationRecord(
    categoryId: CanonicalZakatCategoryId,
    language: SupportedZakatLanguage = 'en',
  ): ZakatCategoryLocalizationRecord {
    return {
      categoryId,
      languageCode: 'en',
      labelSet: this.getLocalizedLabelSet(categoryId, language),
      reviewStatus: 'DRAFT',
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-01T00:00:00.000Z',
    };
  }

  /**
   * List localized label sets for all categories in a given language.
   * Returns English for any category whose language record is not yet available.
   */
  listLocalizedCategories(
    categoryIds: CanonicalZakatCategoryId[],
    language: SupportedZakatLanguage = 'en',
  ): Array<{ categoryId: CanonicalZakatCategoryId; labelSet: ZakatCategoryLabelSet }> {
    return categoryIds.map(id => ({
      categoryId: id,
      labelSet: this.getLocalizedLabelSet(id, language),
    }));
  }
}
