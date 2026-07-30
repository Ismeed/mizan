import { useInheritanceStore } from '../stores/inheritance.store';
import { useSettingsStore }    from '../stores/settings.store';
import { MadhhabProvider }     from '../providers/madhhab.provider';
import { inheritanceService }  from '../services/inheritance.service';
import { historyService }      from '../services/history.service';
import { InheritanceResult }   from '../types/inheritance.types';

export const useInheritance = () => {
  const store = useInheritanceStore();
  const globalCurrency = useSettingsStore(s => s.currency);
  const activeCurrency = store.currency || globalCurrency || 'NGN';
  const activeMadhhab  = MadhhabProvider.getActiveMadhhab();

  const calculate = async (): Promise<InheritanceResult | null> => {
    store.setIsCalculating(true);
    try {
      const payload = {
        totalEstate:     parseFloat(store.totalEstate)     || 0,
        debts:           parseFloat(store.debts)           || 0,
        funeralExpenses: parseFloat(store.funeralExpenses) || 0,
        wasiyyah:        parseFloat(store.wasiyyah)        || 0,
        heirs:           store.heirs,
        currency:        activeCurrency,
        madhhab:         activeMadhhab,
      };

      const result = await inheritanceService.calculate(payload);
      store.setResult(result as any);

      // Count active heirs (non-zero counts) for history summary
      const heirCount = Object.values(store.heirs).filter(v => v > 0).length;

      // Auto-save to local history (non-blocking)
      historyService.saveInheritance(result as unknown as InheritanceResult, heirCount)
        .catch(() => { /* storage error — ignore */ });

      return result as unknown as InheritanceResult;
    } catch (error) {
      console.error('Inheritance calculation failed:', error);
      return null;
    } finally {
      store.setIsCalculating(false);
    }
  };

  return {
    ...store,
    currency: activeCurrency,
    madhhab: activeMadhhab,
    calculate,
  };
};
