/**
 * Connection to the Tether backend (Supabase).
 * Values come from a `.env` file (never committed) — see .env.example:
 *   EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
 *   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>  (older projects: EXPO_PUBLIC_SUPABASE_ANON_KEY)
 * The publishable/anon key is meant to live in the app; row-level security in
 * supabase/schema.sql decides what each user may read or change. Never put the
 * service_role / secret key in the app.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, key!, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/** Normalise a typed phone number to E.164 (e.g. "+23276123456"). Null if it doesn't look valid. */
export function toE164(input: string): string | null {
  const hasPlus = input.trim().startsWith('+');
  const digits = input.replace(/\D/g, '');
  // E.164 allows up to 15 digits; require a country code, so at least 8.
  if (!hasPlus || digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}
