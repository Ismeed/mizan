/**
 * MIZAN — Supabase Database Types
 * Generated type definitions matching the actual database schema.
 * These types ensure type-safe queries throughout the mobile app.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:                      string;
          email:                   string | null;
          first_name:              string | null;
          surname:                 string | null;
          avatar_url:              string | null;
          onboarding_completed:    boolean;
          onboarding_completed_at: string | null;
          created_at:              string;
          updated_at:              string;
        };
        Insert: {
          id:                      string;
          email?:                  string | null;
          first_name?:             string | null;
          surname?:                string | null;
          avatar_url?:             string | null;
          onboarding_completed?:   boolean;
          onboarding_completed_at?: string | null;
          created_at?:             string;
          updated_at?:             string;
        };
        Update: {
          email?:                  string | null;
          first_name?:             string | null;
          surname?:                string | null;
          avatar_url?:             string | null;
          onboarding_completed?:   boolean;
          onboarding_completed_at?: string | null;
          updated_at?:             string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id:       string;
          language_tag:  string;
          locale:        string;
          madhhab_id:    string;
          currency_code: string;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          user_id:        string;
          language_tag?:  string;
          locale?:        string;
          madhhab_id?:    string;
          currency_code?: string;
          created_at?:    string;
          updated_at?:    string;
        };
        Update: {
          language_tag?:  string;
          locale?:        string;
          madhhab_id?:    string;
          currency_code?: string;
          updated_at?:    string;
        };
        Relationships: [];
      };
    };
    Views:    Record<string, never>;
    Functions: Record<string, never>;
    Enums:    Record<string, never>;
  };
}

// ── Convenience row aliases ───────────────────────────────────────────────────

export type ProfileRow     = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert  = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate  = Database['public']['Tables']['profiles']['Update'];

export type PreferenceRow    = Database['public']['Tables']['user_preferences']['Row'];
export type PreferenceInsert = Database['public']['Tables']['user_preferences']['Insert'];
export type PreferenceUpdate = Database['public']['Tables']['user_preferences']['Update'];

// ── Domain types ─────────────────────────────────────────────────────────────

/** Merged profile used throughout the mobile app */
export interface MizanProfile {
  id:                   string;
  email:                string | null;
  firstName:            string | null;
  surname:              string | null;
  displayName:          string;   // computed: firstName + ' ' + surname or email
  avatarUrl:            string | null;
  onboardingCompleted:  boolean;
}

/** User preferences used throughout the mobile app */
export interface MizanPreferences {
  languageTag:  string;  // e.g. 'en', 'ar', 'ha'
  locale:       string;  // e.g. 'en-NG'
  madhhabId:    string;  // e.g. 'MALIKI', 'HANAFI'
  currencyCode: string;  // e.g. 'NGN', 'USD'
}
