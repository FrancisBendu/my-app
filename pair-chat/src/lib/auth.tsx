/**
 * Who is signed in. Phone number + one-time SMS code through Supabase Auth.
 * Without a .env (see src/lib/supabase.ts) the app runs in preview mode, signed out.
 */
import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { isSupabaseConfigured, supabase } from './supabase';

type Auth = {
  configured: boolean;
  session: Session | null;
  phone: string | null;
  sendCode: (phoneE164: string) => Promise<string | null>;
  verifyCode: (phoneE164: string, code: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

/** Turns technical errors into words people can act on. */
function friendly(message: string): string {
  if (/fetch|network/i.test(message)) return 'Can’t reach the server. Check your internet connection and try again.';
  if (/expired|invalid/i.test(message) && /otp|token|code/i.test(message)) return 'That code is wrong or has expired. Ask for a new code.';
  if (/rate|too many|security purposes/i.test(message)) return 'Too many tries. Please wait a minute, then try again.';
  if (/sms|provider|phone/i.test(message)) return `SMS could not be sent: ${message}`;
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => setSession(next));
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });
    client.auth.startAutoRefresh();
    return () => {
      sub.subscription.unsubscribe();
      appState.remove();
    };
  }, []);

  const value: Auth = {
    configured: isSupabaseConfigured,
    session,
    phone: session?.user.phone ? `+${session.user.phone.replace(/^\+/, '')}` : null,
    // Each returns an error message, or null on success.
    sendCode: async (phone) => {
      if (!supabase) return 'The server is not connected yet.';
      const { error } = await supabase.auth.signInWithOtp({ phone });
      return error ? friendly(error.message) : null;
    },
    verifyCode: async (phone, token) => {
      if (!supabase) return 'The server is not connected yet.';
      const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) return friendly(error.message);
      if (data.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, phone }, { onConflict: 'id', ignoreDuplicates: true });
      }
      return null;
    },
    signOut: async () => {
      await supabase?.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>');
  return auth;
}
