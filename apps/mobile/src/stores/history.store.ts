import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalculationType = 'zakat' | 'inheritance';

export interface HistoryEntry {
  id: string;              // 'zk_timestamp' or 'inh_timestamp'
  type: CalculationType;
  date: string;            // ISO string
  madhhab: string;         // e.g. 'Hanafi'
  userId?: string;         // Owner ID
  // Zakat
  categories?: string[];   // e.g. ['Cash & Savings', 'Gold']
  totalWealth?: number;
  totalZakat?: number;
  nisabMet?: boolean;
  currency?: string;
  // Inheritance
  netEstate?: number;
  heirCount?: number;
  // Raw engine results for re-opening
  engineResult: unknown;
}

interface HistoryState {
  entries: HistoryEntry[];
  activeUserId: string | null;
  isLoaded: boolean;

  load: (userId?: string) => Promise<void>;
  add: (entry: HistoryEntry, userId?: string) => Promise<void>;
  remove: (id: string, userId?: string) => Promise<void>;
  clear: (userId?: string) => Promise<void>;
  clearMemory: () => void;
}

const getStorageKey = (userId?: string) => {
  return userId ? `mizan_calculation_history_${userId}` : 'mizan_calculation_history_guest';
};

const MAX_ENTRIES = 100;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  activeUserId: null,
  isLoaded: false,

  load: async (userId?: string) => {
    try {
      const key = getStorageKey(userId);
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        set({ entries: JSON.parse(stored), activeUserId: userId || null, isLoaded: true });
      } else {
        set({ entries: [], activeUserId: userId || null, isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load user-isolated history', e);
      set({ entries: [], isLoaded: true });
    }
  },

  add: async (entry: HistoryEntry, userId?: string) => {
    try {
      const currentUserId = userId || get().activeUserId || undefined;
      const key = getStorageKey(currentUserId);
      const current = get().entries;
      const entryWithOwner = { ...entry, userId: currentUserId };
      const updated = [entryWithOwner, ...current].slice(0, MAX_ENTRIES);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      set({ entries: updated, activeUserId: currentUserId || null });
    } catch (e) {
      console.error('Failed to save user-isolated history entry', e);
    }
  },

  remove: async (id: string, userId?: string) => {
    try {
      const currentUserId = userId || get().activeUserId || undefined;
      const key = getStorageKey(currentUserId);
      const current = get().entries;
      const updated = current.filter(e => e.id !== id);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      set({ entries: updated });
    } catch (e) {
      console.error('Failed to remove user-isolated history entry', e);
    }
  },

  clear: async (userId?: string) => {
    try {
      const currentUserId = userId || get().activeUserId || undefined;
      const key = getStorageKey(currentUserId);
      await AsyncStorage.removeItem(key);
      set({ entries: [] });
    } catch (e) {
      console.error('Failed to clear user-isolated history', e);
    }
  },

  clearMemory: () => {
    set({ entries: [], activeUserId: null, isLoaded: false });
  },
}));
