/**
 * MIZAN — Supabase Singleton Client
 *
 * SECURITY RULES:
 * • One singleton instance — do NOT create another client anywhere.
 * • Uses Expo-compatible AsyncStorage for session persistence.
 * • Never logs access tokens, refresh tokens, or the publishable key.
 * • The service-role key must NEVER appear in Expo — it lives on the backend only.
 *
 * SESSION PERSISTENCE:
 * • AsyncStorage is used as the storage adapter for React Native.
 * • autoRefreshToken: true  — Supabase will silently refresh before expiry.
 * • persistSession: true    — Session survives app restarts.
 * • detectSessionInUrl: false — Disabled for native app (OAuth handled manually).
 */
try {
  require('react-native-url-polyfill/auto');
} catch {
  // Global URL is natively supported in Hermes / Expo SDK 54
}
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// ── Validate environment configuration ───────────────────────────────────────
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://hobtpgryrvfhmvcwjgyj.supabase.co';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sbp_dummy_key';

// ── Create and export the one singleton client ────────────────────────────────
export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      storage:            AsyncStorage,
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);

// ── Type-safe helpers ────────────────────────────────────────────────────────

/** Returns the current Supabase access token, or null if unauthenticated. */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Returns the current authenticated user's ID, or null. */
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}
