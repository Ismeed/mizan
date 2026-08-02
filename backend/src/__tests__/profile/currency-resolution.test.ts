import { CurrencyRegistryService } from '../../features/profile/registries/currency.registry';

describe('Currency Registry & Formatting Integration', () => {
  test('Validates active currency definitions and symbols', () => {
    const ngn = CurrencyRegistryService.get('NGN');
    expect(ngn).toBeDefined();
    expect(ngn?.symbol).toBe('₦');
    expect(ngn?.decimalPlaces).toBe(2);

    const usd = CurrencyRegistryService.get('USD');
    expect(usd?.symbol).toBe('$');

    const sar = CurrencyRegistryService.get('SAR');
    expect(sar?.symbol).toBe('﷼');
  });

  test('Rejects unsupported ISO currency codes', () => {
    expect(CurrencyRegistryService.isSupported('INVALID_COIN')).toBe(false);
  });

  test('Formats financial amounts according to currency registry precision', () => {
    const formattedNGN = CurrencyRegistryService.formatAmount(2500000, 'NGN', 'en-NG');
    expect(formattedNGN).toContain('2,500,000.00');

    const formattedUSD = CurrencyRegistryService.formatAmount(10250.5, 'USD', 'en-US');
    expect(formattedUSD).toContain('10,250.50');
  });
});
