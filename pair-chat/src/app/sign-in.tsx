/**
 * Phone sign-in: enter a number, get an SMS code, verify it.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button, Field, Note } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { toE164 } from '@/lib/supabase';
import { colors, spacing } from '@/lib/theme';

export default function SignInScreen() {
  const { configured, sendCode, verifyCode } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'phone' | 'code'>('phone');
  const [busy, setBusy] = useState(false);
  const [e164, setE164] = useState('');

  const onSend = async () => {
    const normalised = toE164(phone);
    if (!normalised) {
      return Alert.alert('Check the number', 'Enter your phone number with its country code, e.g. +23276123456.');
    }
    setBusy(true);
    const error = await sendCode(normalised);
    setBusy(false);
    if (error) return Alert.alert('Could not send code', error);
    setE164(normalised);
    setStage('code');
  };

  const onVerify = async () => {
    setBusy(true);
    const error = await verifyCode(e164, code.trim());
    setBusy(false);
    if (error) return Alert.alert('Could not sign in', error);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <AppText weight="bold" size={22}>
            {stage === 'phone' ? 'Sign in' : 'Enter the code'}
          </AppText>
          <AppText size={13} color={colors.textMuted}>
            {stage === 'phone'
              ? 'We’ll text you a one-time code to confirm it’s you.'
              : `We sent a 6-digit code to ${e164}.`}
          </AppText>

          {!configured ? (
            <Note>The server is not connected in this build, so sign-in is disabled here.</Note>
          ) : stage === 'phone' ? (
            <>
              <Field
                label="Phone number"
                placeholder="+23276123456"
                keyboardType="phone-pad"
                autoFocus
                value={phone}
                onChangeText={setPhone}
              />
              <Button label={busy ? 'Sending…' : 'Send code'} onPress={onSend} disabled={busy} />
            </>
          ) : (
            <>
              <Field
                label="6-digit code"
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                value={code}
                onChangeText={setCode}
              />
              <Button label={busy ? 'Verifying…' : 'Verify'} onPress={onVerify} disabled={busy || code.trim().length < 4} />
              <Button label="Use a different number" variant="secondary" onPress={() => setStage('phone')} />
            </>
          )}

          {busy ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
