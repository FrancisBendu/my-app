/**
 * Connect a private chat with one other person by invite code.
 * One person taps "Create my code" and shares it; the other types it in and
 * taps "Connect". Both must be signed in — this is consent-based: each person
 * chooses to connect, and either can simply not share or not enter a code.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button, DemoNote, Field } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { createInvite, redeemInvite } from '@/lib/chat';
import { colors, fonts, radius, spacing } from '@/lib/theme';

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
    Share.share({ message: `Connect with me on RAYNO private chat. My code is ${code}` }).catch(() => {});
  };

  const onConnect = async () => {
    setConnecting(true);
    const { id, error } = await redeemInvite(entry);
    setConnecting(false);
    if (error) return Alert.alert('Could not connect', error);
    if (id) router.replace(`/private-chat/${id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="people-outline" size={26} color={colors.primary} />
          </View>
          <AppText weight="semiBold" size={20} style={styles.center}>
            Start a private chat
          </AppText>
          <AppText size={13} color={colors.textMuted} style={styles.center}>
            Connect with one other person. Both of you must be signed in and both choose to connect — share
            your code, or enter theirs.
          </AppText>
        </View>

        {!configured ? (
          <DemoNote>
            Private chat needs the RAYNO server connected. It is not set up in this build yet, so this screen is
            a preview.
          </DemoNote>
        ) : !signedIn ? (
          <View style={styles.gate}>
            <DemoNote>Sign in with your phone number first, then come back here to connect.</DemoNote>
            <Button label="Sign in" icon="log-in-outline" onPress={() => router.push('/sign-in')} />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <AppText weight="semiBold" size={15}>
                Your code
              </AppText>
              <AppText size={12} color={colors.textMuted}>
                Share this with the person you want to chat with. It works once and expires in 7 days.
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
                label="Partner's code"
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
  gate: {
    gap: spacing.md,
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
    backgroundColor: colors.lightGrey,
  },
  codeText: {
    letterSpacing: 6,
    color: colors.navy,
  },
  codeInput: {
    fontFamily: fonts.semiBold,
    letterSpacing: 4,
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
});
