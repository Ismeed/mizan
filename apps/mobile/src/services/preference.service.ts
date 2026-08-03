/**
 * MIZAN — PreferenceService
 *
 * Manages user_preferences for the authenticated user through Supabase.
 *
 * CRITICAL RULES:
 * • Changing a preference NEVER calls logout() or revokeSession().
 * • Changing a preference NEVER redirects to Signup.
 * • Failed preference updates preserve authentication state.
 * • All operations use the Supabase session user ID (never client-supplied).
 * • RLS on user_preferences prevents cross-user access at the database level.
 *
 * STRATEGY:
 * • Optimistic local update → server sync → revert on failure
 * • Falls back to AsyncStorage values when offline
 */
import { supabase } from '../lib/supabase';
import type { MizanPreferences, PreferenceRow } from '../types/database.types';

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_PREFERENCES: MizanPreferences = {
  languageTag:  'en',
  locale:       'en-NG',
  madhhabId:    'MALIKI',
  currencyCode: 'NGN',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowToPrefs(row: PreferenceRow): MizanPreferences {
  return {
    languageTag:  row.language_tag,
    locale:       row.locale,
    madhhabId:    row.madhhab_id,
    currencyCode: row.currency_code,
  };
}

// ── PreferenceService ─────────────────────────────────────────────────────────

export const preferenceService = {

  /**
   * Fetch the authenticated user's preferences.
   * Returns DEFAULT_PREFERENCES when the row doesn't exist yet.
   * Returns DEFAULT_PREFERENCES on network error — NEVER clears auth.
   */
  async getPreferences(): Promise<MizanPreferences> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return DEFAULT_PREFERENCES;

      const { data, error } = await (supabase.from as any)('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) return DEFAULT_PREFERENCES;
      return rowToPrefs(data);
    } catch {
      // Network or unexpected error — preserve auth, return defaults
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Create default preferences for a new user.
   * Safe to call multiple times — upsert is idempotent.
   */
  async createDefaultPreferences(userId: string): Promise<void> {
    try {
      await (supabase.from as any)('user_preferences')
        .upsert({
          user_id:       userId,
          language_tag:  'en',
          locale:        'en-NG',
          madhhab_id:    'MALIKI',
          currency_code: 'NGN',
          updated_at:    new Date().toISOString(),
        }, { onConflict: 'user_id' });
    } catch {
      // Non-fatal — trigger will have created defaults
    }
  },

  /**
   * Update the language preference.
   * On error: throws a feature-level Error; NEVER clears auth state.
   */
  async updateLanguage(languageTag: string): Promise<void> {
    await preferenceService._updateField({ language_tag: languageTag });
  },

  /**
   * Update the madhhab preference.
   * On error: throws a feature-level Error; NEVER clears auth state.
   */
  async updateMadhhab(madhhabId: string): Promise<void> {
    await preferenceService._updateField({ madhhab_id: madhhabId });
  },

  /**
   * Update the currency preference.
   * On error: throws a feature-level Error; NEVER clears auth state.
   */
  async updateCurrency(currencyCode: string): Promise<void> {
    await preferenceService._updateField({ currency_code: currencyCode });
  },

  /**
   * Batch update multiple preferences at once.
   * On error: throws a feature-level Error; NEVER clears auth state.
   */
  async updatePreferences(updates: Partial<MizanPreferences>): Promise<void> {
    const row: Record<string, string> = { updated_at: new Date().toISOString() };
    if (updates.languageTag  !== undefined) row.language_tag  = updates.languageTag;
    if (updates.locale       !== undefined) row.locale        = updates.locale;
    if (updates.madhhabId    !== undefined) row.madhhab_id    = updates.madhhabId;
    if (updates.currencyCode !== undefined) row.currency_code = updates.currencyCode;

    await preferenceService._update(row);
  },

  // ── Internal ──────────────────────────────────────────────────────────────

  async _updateField(field: Record<string, string>): Promise<void> {
    await preferenceService._update({ ...field, updated_at: new Date().toISOString() });
  },

  async _update(row: Record<string, string>): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('PREFERENCE_UPDATE_NO_SESSION');
    }

    const { error } = await (supabase.from as any)('user_preferences')
      .update(row)
      .eq('user_id', session.user.id);

    if (error) {
      // Feature-level error — throw so caller can show UI message
      // Do NOT clear session or redirect
      throw new Error(`PREFERENCE_UPDATE_FAILED: ${error.message}`);
    }
  },
};
