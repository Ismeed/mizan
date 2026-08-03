import { create } from 'zustand';
import { ZakatEngineResult } from '../engine/zakat/types';
import type { IrrigationMethod, LivestockCounts } from '../engine/zakat/types';

// Default multi-livestock counts (all zero)
const DEFAULT_LIVESTOCK_COUNTS: LivestockCounts = {
  camels: 0,
  cattle: 0,
  sheep:  0,
  goats:  0,
  sheepGoatCombined: 0,
};


type LivestockAnimal = keyof LivestockCounts;

/** String fields that can be set via the generic setField() setter */
type StringField = 'cash' | 'gold' | 'silver' | 'business' | 'investments' | 'other' | 'agriculture' | 'debts';

interface ZakatState {
  // Selection
  selectedTypes:    string[];

  // Monetary asset fields (stored as strings for TextInput)
  cash:             string;
  gold:             string;
  silver:           string;
  business:         string;
  investments:      string;
  other:            string;
  agriculture:      string;
  debts:            string;

  // Agriculture
  irrigation:       IrrigationMethod;

  // Multi-livestock (counts stored as numbers — steppers, not text inputs)
  livestockCounts:  LivestockCounts;

  // Metadata
  currency:         string;
  hawlMet:          boolean;

  // Engine output
  engineResult:     ZakatEngineResult | null;
  isCalculating:    boolean;

  // Actions
  setSelectedTypes:   (types: string[]) => void;
  setField:           (field: StringField, value: string) => void;
  setIrrigation:      (method: IrrigationMethod) => void;
  setLivestockCount:  (animal: LivestockAnimal, count: number) => void;
  setEngineResult:    (result: ZakatEngineResult | null) => void;
  setIsCalculating:   (v: boolean) => void;
  reset:              () => void;
}

const INITIAL_STATE = {
  selectedTypes:   [],
  cash:            '',
  gold:            '',
  silver:          '',
  business:        '',
  investments:     '',
  other:           '',
  agriculture:     '',
  irrigation:      'rain' as IrrigationMethod,
  livestockCounts: { ...DEFAULT_LIVESTOCK_COUNTS },
  debts:           '',
  currency:        'NGN',
  hawlMet:         true,
  engineResult:    null,
  isCalculating:   false,
};

export const useZakatStore = create<ZakatState>((set) => ({
  ...INITIAL_STATE,

  setSelectedTypes:  (types)          => set({ selectedTypes: types }),
  setField:          (field, value)   => set((s) => ({ ...s, [field]: value })),
  setIrrigation:     (method)         => set({ irrigation: method }),

  /** Set the count for a single animal type without affecting others */
  setLivestockCount: (animal, count)  => set((s) => ({
    livestockCounts: { ...s.livestockCounts, [animal]: Math.max(0, count) },
  })),

  setEngineResult:   (result)         => set({ engineResult: result }),
  setIsCalculating:  (v)              => set({ isCalculating: v }),
  reset:             ()               => set({ ...INITIAL_STATE, livestockCounts: { ...DEFAULT_LIVESTOCK_COUNTS } }),
}));
