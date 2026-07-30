import { useHistoryStore, HistoryEntry } from '../stores/history.store';
import type { ZakatEngineResult } from '../engine/zakat/types';
import type { InheritanceResult } from '../types/inheritance.types';

export const historyService = {
  saveZakat: async (result: ZakatEngineResult) => {
    const entry: HistoryEntry = {
      id: `zk_${Date.now()}`,
      type: 'zakat',
      date: result.calculatedAt || new Date().toISOString(),
      madhhab: result.madhhab,
      categories: result.categories.map(c => c.name),
      totalWealth: result.totalDeclaredWealth,
      totalZakat: result.totalZakatDue,
      nisabMet: result.isDue,
      currency: result.currency,
      engineResult: result,
    };
    await useHistoryStore.getState().add(entry);
  },

  saveInheritance: async (result: InheritanceResult, heirCount: number) => {
    const entry: HistoryEntry = {
      id: `inh_${Date.now()}`,
      type: 'inheritance',
      date: new Date().toISOString(),
      madhhab: result.madhhab,
      netEstate: result.netEstate,
      heirCount,
      engineResult: result,
    };
    await useHistoryStore.getState().add(entry);
  }
};
