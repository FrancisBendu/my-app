/**
 * Connect with one other person by invite code. One person creates and shares a
 * code; the other enters it. Both choose to connect — nobody is added silently.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button, Field, Note } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { createInvite, redeemInvite } from '@/lib/chat';
import { colors, radius, spacing } from '@/lib/theme';

export default function ConnectScreen() {
  const { configured, session } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [entry, setEntry] = useState('');
  const [connecting, setConnecting] = useState(false);

  const signedIn = Boolean(session);

  const onCreate = async () => {
    setCreating(true);
    const { code: created, error } = await createInvite();
    setCreating(false);
    if (error) return Alert.alert('Could not create a code', error);
    setCode(created);
  };

  const onShare = () => {
    if (!code) return;
    Share.share({ message: `Connect with me on Tether. My code is ${code}` }).catch(() => {});
  };

  const onConnect = async () => {
    setConnecting(true);
    const { id, error } = await redeemInvite(entry);
    setConnecting(false);
    if (error) return Alert.alert('Could not connect', error);
    if (id) router.replace(`/chat/${id}`);
  };

  if (!configured || !signedIn) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.pad}>
          <Note>
            {configured
              ? 'Sign in first, then come back here to connect.'
              : 'Tether needs its backend connected before you can connect with someone.'}
          </Note>
          {configured ? (
            <Button label="Sign in" icon="log-in-outline" onPress={() => router.push('/sign-in')} style={styles.gap} />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText weight="semiBold" size={15}>
            Your code
          </AppText>
          <AppText size={12} color={colors.textMuted}>
            Share this with the one person you want to chat with. It works once and expires in 7 days.
          </AppText>
          {code ? (
            <>
              <View style={styles.codeBox}>
                <AppText weight="bold" size={30} style={styles.codeText}>
                  {code}
                </AppText>
              </View>
              <Button label="Share code" icon="share-outline" onPress={onShare} />
              <Pressable onPress={onCreate} disabled={creating} style={styles.link}>
                <AppText size={13} color={colors.primary}>
                  Create a new code
                </AppText>
              </Pressable>
            </>
          ) : (
            <Button
              label={creating ? 'Creating…' : 'Create my code'}
              icon="key-outline"
              onPress={onCreate}
              disabled={creating}
            />
          )}
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <AppText size={12} color={colors.textMuted}>
            or
          </AppText>
          <View style={styles.line} />
        </View>

        <View style={styles.card}>
          <AppText weight="semiBold" size={15}>
            Enter their code
          </AppText>
          <Field
            label="Their code"
            placeholder="e.g. K7P2QH"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            value={entry}
            onChangeText={(t) => setEntry(t.toUpperCase())}
            style={styles.codeInput}
          />
          <Button
            label={connecting ? 'Connecting…' : 'Connect'}
            icon="link-outline"
            onPress={onConnect}
            disabled={connecting || entry.trim().length < 6}
          />
        </View>

        {connecting ? <ActivityIndicator color={colors.primary} /> : null}

        <View style={styles.footer}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          <AppText size={12} color={colors.textMuted} style={styles.flex}>
            Only the two of you can read this chat. Either of you can simply not share or not enter a code.
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pad: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  gap: {
    marginTop: spacing.sm,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  codeBox: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  codeText: {
    letterSpacing: 6,
    color: colors.primary,
  },
  codeInput: {
    letterSpacing: 4,
    fontWeight: '600',
  },
  link: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  flex: {
    flex: 1,
  },
});
