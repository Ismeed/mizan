/**
 * Currency Conversion Service Architecture
 *
 * For MVP, changing currency updates the display formatting and symbol globally.
 * Values are entered and displayed in the user's selected active currency.
 * This service provides an interface for live exchange rate integration in future releases
 * without requiring any changes to UI components or Rule Engines.
 */
export interface ICurrencyConversionService {
  convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
  getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
}

export class DefaultCurrencyConversionService implements ICurrencyConversionService {
  /**
   * Converts an amount between currencies.
   * MVP Behavior: 1:1 pass-through (formatting & symbol updated dynamically).
   */
  async convert(amount: number, _fromCurrency: string, _toCurrency: string): Promise<number> {
    return amount;
  }

  /**
   * Fetches exchange rate.
   * MVP Behavior: Returns 1.0.
   */
  async getExchangeRate(_fromCurrency: string, _toCurrency: string): Promise<number> {
    return 1.0;
  }
}

export const currencyConversionService = new DefaultCurrencyConversionService();
