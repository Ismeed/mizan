/**
 * Inheritance service — mobile
 *
 * Strategy:
 *   1. Run the real Mirath engine LOCALLY (offline-first, instant, no network needed)
 *   2. If the user is authenticated, also POST to the backend in the background
 *      to persist the calculation to history (fire-and-forget)
 */
import { calculateMirath } from '@mizan/shared';
import { apiClient } from './api.client';
import { HeirsState } from '../stores/inheritance.store';
import { MadhhabProvider } from '../providers/madhhab.provider';
import { useSettingsStore } from '../stores/settings.store';

export interface CalculateInheritancePayload {
  totalEstate: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number;
  heirs: HeirsState;
  currency?: string;
  madhhab?: string;
}

export interface ShareResult {
  key: string;
  label: string;
  count: number;
  shareType: 'FARD' | 'ASABAH' | 'BLOCKED' | 'NONE';
  fractionLabel: string;
  fractionNumerator: number;
  fractionDenominator: number;
  shareOfEstate: number;
  totalAmount: number;
  perPersonAmount: number;
  isBlocked: boolean;
  blockingReason?: string;
  reference?: string;
}

export interface InheritanceResult {
  netEstate: number;
  shares: ShareResult[];
  totalAllocated: number;
  unallocated: number;
  calculationMethod: 'NORMAL' | 'AWL' | 'RADD';
  awlFactor?: number;
  madhhab: string;
}

export const inheritanceService = {
  /**
   * Calculate inheritance shares.
   * Runs instantly using the local Mirath engine.
   * Syncs to backend in the background (non-blocking) for history.
   */
  calculate: async (payload: CalculateInheritancePayload): Promise<InheritanceResult> => {
    const activeCurrency = payload.currency || useSettingsStore.getState().currency || 'NGN';
    const activeMadhhab  = payload.madhhab || MadhhabProvider.getActiveMadhhab();

    const {
      totalEstate,
      debts = 0,
      funeralExpenses = 0,
      wasiyyah = 0,
      heirs,
    } = payload;

    const netEstate = Math.max(0, totalEstate - debts - funeralExpenses - wasiyyah);

    // Run the local engine — synchronous and instant
    const result = calculateMirath({
      netEstate,
      heirs: {
        husband:               heirs.husband,
        wives:                 heirs.wives,
        sons:                  heirs.sons,
        daughters:             heirs.daughters,
        father:                heirs.father,
        mother:                heirs.mother,
        paternalGrandfathers:  heirs.paternalGrandfathers,
        paternalGrandmothers:  heirs.paternalGrandmothers,
        maternalGrandmothers:  heirs.maternalGrandmothers,
        fullBrothers:          heirs.fullBrothers,
        fullSisters:           heirs.fullSisters,
        paternalHalfBrothers:  heirs.paternalHalfBrothers,
        paternalHalfSisters:   heirs.paternalHalfSisters,
        maternalHalfSiblings:  heirs.maternalHalfSiblings,
        sonsOfFullBrothers:    heirs.sonsOfFullBrothers,
        sonsOfPatHalfBrothers: heirs.sonsOfPatHalfBrothers,
        paternalUncles:        heirs.paternalUncles,
        sonsOfPatUncles:       heirs.sonsOfPatUncles,
      },
      madhhab: activeMadhhab as any,
    });

    // Background sync to backend for persistence (non-blocking)
    apiClient.post('/inheritance/calculate', {
      totalEstate,
      debts,
      funeralExpenses,
      wasiyyah,
      currency: activeCurrency,
      madhhab: activeMadhhab,
      heirs: {
        husband:               heirs.husband,
        wives:                 heirs.wives,
        sons:                  heirs.sons,
        daughters:             heirs.daughters,
        father:                heirs.father,
        mother:                heirs.mother,
        paternalGrandfathers:  heirs.paternalGrandfathers,
        paternalGrandmothers:  heirs.paternalGrandmothers,
        maternalGrandmothers:  heirs.maternalGrandmothers,
        fullBrothers:          heirs.fullBrothers,
        fullSisters:           heirs.fullSisters,
        paternalHalfBrothers:  heirs.paternalHalfBrothers,
        paternalHalfSisters:   heirs.paternalHalfSisters,
        maternalHalfSiblings:  heirs.maternalHalfSiblings,
        sonsOfFullBrothers:    heirs.sonsOfFullBrothers,
        sonsOfPatHalfBrothers: heirs.sonsOfPatHalfBrothers,
        paternalUncles:        heirs.paternalUncles,
        sonsOfPatUncles:       heirs.sonsOfPatUncles,
      },
    }).catch(() => {
      // Background sync fail — swallow silently
    });

    return result as InheritanceResult;
  },

  getHistory: async () => {
    const response = await apiClient.get('/inheritance/history');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/inheritance/${id}`);
    return response.data.data;
  },
};
