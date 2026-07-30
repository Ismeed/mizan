import { create } from 'zustand';
import { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setOnboardingComplete: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:               null,
  token:              null,
  onboardingComplete: false,
  isLoading:          false,
  error:              null,

  setAuth: (user, token) => set({
    user,
    token,
    error:              null,
    onboardingComplete: (user as any).onboardingComplete ?? false,
  }),
  setUser:               (user)    => set({ user }),
  setOnboardingComplete: (value)   => set({ onboardingComplete: value }),
  setLoading:            (loading) => set({ isLoading: loading }),
  setError:              (error)   => set({ error }),
  logout: () => set({ user: null, token: null, error: null, onboardingComplete: false }),
}));
