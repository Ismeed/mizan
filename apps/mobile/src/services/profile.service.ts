/**
 * MIZAN — ProfileService
 *
 * All profile operations use the currently authenticated Supabase user ID
 * obtained from the active session. The mobile UI never passes an arbitrary
 * user ID for self-service operations. RLS enforces this at the database level.
 *
 * SECURITY: auth.uid() RLS policies on the profiles table prevent cross-user access.
 */
import { supabase } from '../lib/supabase';
import type { MizanProfile, ProfileRow, ProfileUpdate } from '../types/database.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToProfile(row: ProfileRow): MizanProfile {
  const first   = row.first_name ?? '';
  const surname = row.surname ?? '';
  const full    = [first, surname].filter(Boolean).join(' ');
  return {
    id:                  row.id,
    email:               row.email,
    firstName:           row.first_name,
    surname:             row.surname,
    displayName:         full || row.email || 'MIZAN User',
    avatarUrl:           row.avatar_url,
    onboardingCompleted: row.onboarding_completed,
  };
}

// ── ProfileService ────────────────────────────────────────────────────────────

export const profileService = {

  /**
   * Fetch the current authenticated user's profile.
   * Returns null if not found (e.g. trigger not yet fired).
   */
  async getCurrentProfile(): Promise<MizanProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await (supabase.from as any)('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !data) return null;
    return rowToProfile(data);
  },

  /**
   * Create or update the current user's profile (upsert).
   * Safe to call multiple times — idempotent.
   */
  async upsertCurrentProfile(updates: {
    firstName?:           string;
    surname?:             string;
    email?:               string;
    avatarUrl?:           string;
    onboardingCompleted?: boolean;
  }): Promise<MizanProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const payload: ProfileUpdate = {
      updated_at: new Date().toISOString(),
    };

    if (updates.firstName           !== undefined) payload.first_name            = updates.firstName;
    if (updates.surname             !== undefined) payload.surname                = updates.surname;
    if (updates.email               !== undefined) payload.email                  = updates.email;
    if (updates.avatarUrl           !== undefined) payload.avatar_url             = updates.avatarUrl;
    if (updates.onboardingCompleted !== undefined) {
      payload.onboarding_completed    = updates.onboardingCompleted;
      if (updates.onboardingCompleted) {
        payload.onboarding_completed_at = new Date().toISOString();
      }
    }

    const { data, error } = await (supabase.from as any)('profiles')
      .upsert({ id: session.user.id, ...payload }, { onConflict: 'id' })
      .select()
      .single();

    if (error || !data) {
      console.warn('[ProfileService] upsert failed:', error?.message);
      return null;
    }
    return rowToProfile(data);
  },

  /**
   * Mark onboarding as complete and set the confirmed first name.
   * Called after email OTP verification or Google name confirmation.
   */
  async completeOnboarding(firstName: string, surname?: string): Promise<MizanProfile | null> {
    return profileService.upsertCurrentProfile({
      firstName,
      surname,
      onboardingCompleted: true,
    });
  },

  /**
   * Update only the first name (used from Google name-confirm screen).
   */
  async updateFirstName(firstName: string): Promise<MizanProfile | null> {
    return profileService.upsertCurrentProfile({ firstName });
  },

  /**
   * Update both first name and surname (used from email onboarding).
   */
  async updateNames(firstName: string, surname: string): Promise<MizanProfile | null> {
    return profileService.upsertCurrentProfile({ firstName, surname });
  },

  /**
   * Re-fetch and return the latest profile.
   * Use after any external change to refresh in-memory state.
   */
  async refreshProfile(): Promise<MizanProfile | null> {
    return profileService.getCurrentProfile();
  },
};
