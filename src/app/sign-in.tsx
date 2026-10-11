import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, DemoNote } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { toE164Sl } from '@/lib/supabase';
import { colors, fonts, radius, spacing } from '@/lib/theme';

export default function SignInScreen() {
  const auth = useAuth();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const e164 = toE164Sl(phone);

  const send = async () => {
    if (!e164) {
      setError('Enter a Sierra Leone number, e.g. 076 123 456.');
      return;
    }
    setBusy(true);
    setError(null);
    const problem = await auth.sendCode(e164);
    setBusy(false);
    if (problem) setError(problem);
    else setStep('code');
  };

  const verify = async () => {
    if (!e164 || !/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from the SMS.');
      return;
    }
    setBusy(true);
    setError(null);
    const problem = await auth.verifyCode(e164, code);
    setBusy(false);
    if (problem) setError(problem);
    else router.back();
  };

  if (!auth.configured) {
    return (
      <View style={styles.screen}>
        <View style={styles.content}>
          <DemoNote>
            Sign-in needs the RAYNO server. Add the Supabase URL and key to a .env file in the project folder, then
            restart with npx expo start. The README explains how.
          </DemoNote>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.icon}>
          <Ionicons name={step === 'phone' ? 'phone-portrait-outline' : 'chatbox-ellipses-outline'} size={32} color={colors.primary} />
        </View>
        <AppText weight="semiBold" size={22}>
          {step === 'phone' ? 'Sign in with your phone' : 'Enter the code'}
        </AppText>
        <AppText size={14} color={colors.textMuted}>
          {step === 'phone'
            ? 'We’ll send you a 6-digit code by SMS. No password needed.'
            : `We sent a code to ${e164}. It can take a minute to arrive.`}
        </AppText>

        {step === 'phone' ? (
          <View style={styles.phoneRow}>
            <View style={styles.prefix}>
              <AppText weight="medium" size={16}>
                🇸🇱 +232
              </AppText>
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="76 123 456"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              style={[styles.input, styles.phoneInput]}
            />
          </View>
        ) : (
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            style={[styles.input, styles.code]}
          />
        )}

        {error ? (
          <AppText size={13} color={colors.red}>
            {error}
          </AppText>
        ) : null}

        {busy ? (
          <ActivityIndicator color={colors.primary} />
        ) : step === 'phone' ? (
          <Button label="Send code" icon="paper-plane-outline" onPress={send} />
        ) : (
          <>
            <Button label="Verify and sign in" icon="checkmark" onPress={verify} />
            <Pressable onPress={send} style={styles.link} accessibilityRole="button">
              <AppText size={13} color={colors.primary}>
                Send a new code
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => {
                setStep('phone');
                setCode('');
                setError(null);
              }}
              style={styles.link}
              accessibilityRole="button"
            >
              <AppText size={13} color={colors.textMuted}>
                Use a different number
              </AppText>
            </Pressable>
          </>
        )}

        <AppText size={11} color={colors.textMuted} style={styles.terms}>
          By signing in you agree to the RAYNO Terms of Use and Privacy Policy. You must be 18 or older to buy or sell.
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  prefix: {
    height: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontFamily: fonts.medium,
    fontSize: 17,
    color: colors.text,
  },
  code: {
    letterSpacing: 8,
    fontSize: 22,
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  link: {
    alignSelf: 'center',
    padding: spacing.xs,
  },
  terms: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
