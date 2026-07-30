import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import { apiClient } from '../services/api.client';

export type MadhhabCode = 'MALIKI' | 'HANAFI' | 'SHAFII' | 'HANBALI' | 'JAFARI';
export type CurrencyCode = 'NGN' | 'USD' | 'SAR' | 'AED' | 'GBP' | 'EUR';
export type LanguageCode = 'en' | 'ar' | 'ha' | 'fr' | 'ur' | 'tr';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  language: LanguageCode;
  madhhab: MadhhabCode;
  currency: CurrencyCode;
  hapticsEnabled: boolean;
  biometricsEnabled: boolean;
  isLoaded: boolean;

  loadSettings: () => Promise<void>;
  setTheme: (theme: SettingsState['theme']) => void;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  setMadhhab: (madhhab: MadhhabCode) => Promise<void>;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  toggleHaptics: () => void;
  toggleBiometrics: () => void;
}

const SETTINGS_STORAGE_KEY = '@mizan_global_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'dark',
  language: 'en',
  madhhab: 'MALIKI', // Default per requirements
  currency: 'NGN',  // Default per requirements
  hapticsEnabled: true,
  biometricsEnabled: false,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const lang = (parsed.language || 'en') as LanguageCode;
        
        // Ensure native I18nManager matches requested language
        if (lang === 'ar') {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
        } else {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }

        set({
          ...parsed,
          language: lang,
          madhhab: (parsed.madhhab ? parsed.madhhab.toUpperCase() : 'MALIKI') as MadhhabCode,
          currency: (parsed.currency ? parsed.currency.toUpperCase() : 'NGN') as CurrencyCode,
          isLoaded: true,
        });
      } else {
        // Default to LTR
        I18nManager.allowRTL(false);
        I18nManager.forceRTL(false);
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load global settings', e);
      set({ isLoaded: true });
    }
  },

  setTheme: (theme) => {
    set({ theme });
    saveSettingsLocally(get());
  },

  setLanguage: async (language: LanguageCode) => {
    const isArabic = language === 'ar';
    I18nManager.allowRTL(isArabic);
    I18nManager.forceRTL(isArabic);

    set({ language });
    await saveSettingsLocally(get());
    syncWithBackend({ language });
  },

  setMadhhab: async (madhhab: MadhhabCode) => {
    const canonical = madhhab.toUpperCase() as MadhhabCode;
    set({ madhhab: canonical });
    await saveSettingsLocally(get());
    syncWithBackend({ madhhab: canonical });
  },

  setCurrency: async (currency: CurrencyCode) => {
    const canonical = currency.toUpperCase() as CurrencyCode;
    set({ currency: canonical });
    await saveSettingsLocally(get());
    syncWithBackend({ currency: canonical });
  },

  toggleHaptics: () => {
    set((state) => ({ hapticsEnabled: !state.hapticsEnabled }));
    saveSettingsLocally(get());
  },

  toggleBiometrics: () => {
    set((state) => ({ biometricsEnabled: !state.biometricsEnabled }));
    saveSettingsLocally(get());
  },
}));

async function saveSettingsLocally(state: SettingsState) {
  try {
    const payload = {
      theme: state.theme,
      language: state.language,
      madhhab: state.madhhab,
      currency: state.currency,
      hapticsEnabled: state.hapticsEnabled,
      biometricsEnabled: state.biometricsEnabled,
    };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save settings locally', e);
  }
}

async function syncWithBackend(data: { madhhab?: string; currency?: string; language?: string }) {
  try {
    await apiClient.patch('/auth/profile', data);
  } catch {
    // Offline or unauthenticated — silently ignored as local storage is primary
  }
}

// Auto-load settings on import
useSettingsStore.getState().loadSettings();
