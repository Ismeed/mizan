import { useSettingsStore } from '../stores/settings.store';
import { formatCurrency as format } from '../utils/currency.utils';

export const useCurrency = () => {
  const { currency } = useSettingsStore();

  const formatCurrency = (amount: number | string) => {
    return format(amount, currency);
  };

  return {
    formatCurrency,
    currency,
  };
};
