import { create } from 'zustand';
import { InheritanceResult } from '../types/inheritance.types';

export interface HeirsState {
  husband: number;
  wives: number;
  sons: number;
  daughters: number;
  father: number;
  mother: number;
  paternalGrandfathers: number;
  paternalGrandmothers: number;
  maternalGrandmothers: number;
  fullBrothers: number;
  fullSisters: number;
  paternalHalfBrothers: number;
  paternalHalfSisters: number;
  maternalHalfSiblings: number;
  sonsOfFullBrothers: number;
  sonsOfPatHalfBrothers: number;
  paternalUncles: number;
  sonsOfPatUncles: number;
}

interface InheritanceState {
  totalEstate: string;
  debts: string;
  funeralExpenses: string;
  wasiyyah: string;
  currency: string;
  heirs: HeirsState;
  result: InheritanceResult | null;
  isCalculating: boolean;
  
  setEstateField: (field: string, value: string) => void;
  setHeirCount: (heir: keyof HeirsState, count: number) => void;
  setResult: (result: InheritanceResult | null) => void;
  setIsCalculating: (isCalculating: boolean) => void;
  reset: () => void;
}

const initialHeirs: HeirsState = {
  husband: 0,
  wives: 0,
  sons: 0,
  daughters: 0,
  father: 0,
  mother: 0,
  paternalGrandfathers: 0,
  paternalGrandmothers: 0,
  maternalGrandmothers: 0,
  fullBrothers: 0,
  fullSisters: 0,
  paternalHalfBrothers: 0,
  paternalHalfSisters: 0,
  maternalHalfSiblings: 0,
  sonsOfFullBrothers: 0,
  sonsOfPatHalfBrothers: 0,
  paternalUncles: 0,
  sonsOfPatUncles: 0,
};

export const useInheritanceStore = create<InheritanceState>((set) => ({
  totalEstate: '',
  debts: '',
  funeralExpenses: '',
  wasiyyah: '',
  currency: 'NGN',
  heirs: { ...initialHeirs },
  result: null,
  isCalculating: false,
  
  setEstateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setHeirCount: (heir, count) => set((state) => ({ 
    heirs: { ...state.heirs, [heir]: count } 
  })),
  setResult: (result) => set({ result }),
  setIsCalculating: (isCalculating) => set({ isCalculating }),
  reset: () => set({
    totalEstate: '',
    debts: '',
    funeralExpenses: '',
    wasiyyah: '',
    heirs: { ...initialHeirs },
    result: null,
  }),
}));
