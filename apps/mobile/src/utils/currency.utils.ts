import { useSettingsStore, CurrencyCode } from '../stores/settings.store';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'NGN', symbol: '₦',    name: 'Nigerian Naira' },
  { code: 'USD', symbol: '$',    name: 'US Dollar' },
  { code: 'SAR', symbol: '﷼',    name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ',  name: 'UAE Dirham' },
  { code: 'GBP', symbol: '£',    name: 'British Pound' },
  { code: 'EUR', symbol: '€',    name: 'Euro' },
];

/**
 * Returns the symbol for a currency code (e.g. 'NGN' -> '₦').
 */
export const getCurrencySymbol = (currencyCode?: string): string => {
  const code = currencyCode || useSettingsStore.getState().currency || 'NGN';
  const match = SUPPORTED_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (match) return match.symbol;

  const fallbackSymbols: Record<string, string> = {
    'NGN': '₦',
    'USD': '$',
    'SAR': '﷼',
    'AED': 'د.إ',
    'GBP': '£',
    'EUR': '€',
  };
  return fallbackSymbols[code.toUpperCase()] || code;
};

/**
 * Returns full CurrencyInfo for a code.
 */
export const getCurrencyInfo = (currencyCode?: string): CurrencyInfo => {
  const code = (currencyCode || useSettingsStore.getState().currency || 'NGN') as CurrencyCode;
  const match = SUPPORTED_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return match || { code, symbol: getCurrencySymbol(code), name: code };
};

/**
 * Formats a monetary amount into a clean currency string using active or specified currency.
 * Example: formatCurrency(2500000, 'NGN') -> '₦2,500,000.00'
 */
export const formatCurrency = (amount: number | string, currencyCode?: string): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const activeCode = currencyCode || useSettingsStore.getState().currency || 'NGN';

  if (isNaN(numericAmount)) {
    return `${getCurrencySymbol(activeCode)}0.00`;
  }

  const symbol = getCurrencySymbol(activeCode);

  return `${symbol}${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
