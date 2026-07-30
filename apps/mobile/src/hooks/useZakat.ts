/**
 * useZakat — connects the UI to the Zakat Rule Engine.
 *
 * The AI Assistant MUST NEVER calculate Zakat.
 * All calculations are delegated exclusively to ZakatEngine.
 */
import { useZakatStore }        from '../stores/zakat.store';
import { useSettingsStore }     from '../stores/settings.store';
import { MadhhabProvider }      from '../providers/madhhab.provider';
import { zakatEngine }          from '../engine/zakat/ZakatEngine';
import { ZakatEngineResult }    from '../engine/zakat/types';
import { apiClient }            from '../services/api.client';
import { historyService }       from '../services/history.service';

/** Fallback Nisab (silver 595g × ~₦4,300/g ≈ ₦2,558,500) — updated periodically */
const FALLBACK_NISAB_NGN = 2_558_500;

let cachedNisab: { value: number; at: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchNisab(currency: string): Promise<number> {
  if (cachedNisab && Date.now() - cachedNisab.at < CACHE_TTL) {
    return cachedNisab.value;
  }
  try {
    const res   = await apiClient.get('/zakat/nisab-rates');
    const rates = res.data?.data as Array<{ type: string; value_in_grams: number; price_per_gram_ngn?: number; price_per_gram_usd?: number }>;
    const silver = rates.find(r => r.type === 'SILVER');
    if (silver) {
      const pricePerGram = silver.price_per_gram_ngn ?? (silver.price_per_gram_usd ?? 0) * 1600;
      const nisab = silver.value_in_grams * pricePerGram;
      cachedNisab = { value: nisab, at: Date.now() };
      return nisab;
    }
  } catch { /* offline — use fallback */ }
  return FALLBACK_NISAB_NGN;
}

export const useZakat = () => {
  const store = useZakatStore();
  const globalCurrency = useSettingsStore(s => s.currency);
  const activeCurrency = store.currency || globalCurrency || 'NGN';
  const activeMadhhab  = MadhhabProvider.getActiveMadhhabCode();

  const calculate = async (): Promise<ZakatEngineResult | null> => {
    store.setIsCalculating(true);
    try {
      const nisabThreshold = await fetchNisab(activeCurrency);

      const input = {
        cash:           parseFloat(store.cash)        || 0,
        gold:           parseFloat(store.gold)        || 0,
        silver:         parseFloat(store.silver)      || 0,
        business:       parseFloat(store.business)    || 0,
        investments:    parseFloat(store.investments) || 0,
        agriculture:    parseFloat(store.agriculture) || 0,
        irrigation:     store.irrigation,
        livestockCounts: store.livestockCounts,
        other:          parseFloat(store.other)       || 0,
        debts:          parseFloat(store.debts)       || 0,
        selectedTypes:  store.selectedTypes,
        nisabThreshold,
        currency:       activeCurrency,
        madhhab:        activeMadhhab,
      };

      const result = zakatEngine.calculate(input);
      store.setEngineResult(result);

      // Auto-save to local history (non-blocking)
      historyService.saveZakat(result).catch(() => { /* storage error — ignore */ });

      // Background sync to backend (non-blocking, best-effort)
      apiClient.post('/zakat/calculate', { ...input, engineResult: result })
        .catch(() => { /* offline or unauthenticated — ignore */ });

      return result;
    } catch (err) {
      console.error('[useZakat] Calculation error:', err);
      return null;
    } finally {
      store.setIsCalculating(false);
    }
  };

  return { ...store, currency: activeCurrency, calculate };
};
