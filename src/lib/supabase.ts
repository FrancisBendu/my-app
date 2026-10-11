/**
 * Connection to the RAYNO server (Supabase).
 * The two values come from a `.env` file in the project folder (never committed):
 *   EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
 *   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>  (older projects: EXPO_PUBLIC_SUPABASE_ANON_KEY)
 * The anon/publishable key is meant to be in the app; the database rules (RLS)
 * in supabase/schema.sql decide what each user may read or change.
 * Never put the service_role / secret key in the app.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Each name is written out in full so Expo can insert the values at build time.
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

/** "076 123 456", "76123456" or "+232 76 123 456" -> "+23276123456". Null if it isn't a Sierra Leone number. */
export function toE164Sl(input: string): string | null {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('232')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return /^\d{8}$/.test(d) ? `+232${d}` : null;
}
