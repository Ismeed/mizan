import { create } from 'zustand';
import { MadhhabCode, CalculationProfile } from '@mizan/shared';
import { useSettingsStore } from './settings.store';

interface PreferencesState {
  // Calculation-level overrides
  overrideMadhhab: MadhhabCode | null;
  overrideCurrency: string | null;
  overrideLanguage: string | null;
  
  // Effective active profile
  activeProfile: CalculationProfile | null;
  
  setOverrideMadhhab: (madhhab: MadhhabCode | null) => void;
  setOverrideCurrency: (currency: string | null) => void;
  setOverrideLanguage: (language: string | null) => void;
  clearOverrides: () => void;
  setActiveProfile: (profile: CalculationProfile | null) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  overrideMadhhab: null,
  overrideCurrency: null,
  overrideLanguage: null,
  activeProfile: null,

  setOverrideMadhhab: (madhhab) => set({ overrideMadhhab: madhhab }),
  setOverrideCurrency: (currency) => set({ overrideCurrency: currency }),
  setOverrideLanguage: (language) => set({ overrideLanguage: language }),
  clearOverrides: () => set({ overrideMadhhab: null, overrideCurrency: null, overrideLanguage: null }),
  setActiveProfile: (activeProfile) => set({ activeProfile }),
}));
