/**
 * Home: your private chats. Sign in, then connect with one other person by code.
 */
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, Button, EmptyState, Note } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { listChats, type ChatSummary } from '@/lib/chat';
import { chatTime } from '@/lib/format';
import { colors, spacing } from '@/lib/theme';

export default function HomeScreen() {
  const { configured, session, signOut } = useAuth();
  const myId = session?.user.id;
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!myId) {
        setLoading(false);
        return;
      }
      let active = true;
      setLoading(true);
      listChats(myId).then(({ chats: loaded }) => {
        if (!active) return;
        setChats(loaded);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [myId]),
  );

  const headerRight = () =>
    myId ? (
      <Pressable onPress={signOut} accessibilityRole="button" accessibilityLabel="Sign out" hitSlop={8}>
        <Ionicons name="log-out-outline" size={22} color={colors.primary} />
      </Pressable>
    ) : null;

  if (!configured) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerRight }} />
        <View style={styles.pad}>
          <Note>
            Tether needs its backend connected. Copy .env.example to .env with your Supabase URL and key, then
            run the SQL in supabase/schema.sql. Until then this is a preview.
          </Note>
        </View>
      </SafeAreaView>
    );
  }

  if (!myId) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerRight }} />
        <View style={styles.welcome}>
          <View style={styles.logo}>
            <Ionicons name="infinite" size={34} color={colors.white} />
          </View>
          <AppText weight="bold" size={24} style={styles.center}>
            Tether
          </AppText>
          <AppText size={14} color={colors.textMuted} style={styles.center}>
            A private chat for two. Sign in, share a one-time code with one person, and your messages sync
            between both phones.
          </AppText>
          <Button label="Sign in" icon="log-in-outline" onPress={() => router.push('/sign-in')} style={styles.welcomeButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerRight }} />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="chatbubble-ellipses-outline"
              title="No chats yet"
              body="Tap New chat to connect with someone by sharing or entering a one-time code."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Avatar name={item.partnerName} size={50} />
              <View style={styles.rowBody}>
                <View style={styles.rowLine}>
                  <AppText weight="semiBold" size={15} numberOfLines={1} style={styles.flex}>
                    {item.partnerName}
                  </AppText>
                  {item.lastAt ? (
                    <AppText size={11} color={colors.textMuted}>
                      {chatTime(item.lastAt)}
                    </AppText>
                  ) : null}
                </View>
                <AppText size={13} color={colors.textMuted} numberOfLines={1}>
                  {item.lastText ?? 'Say hello'}
                </AppText>
              </View>
            </Pressable>
          )}
        />
      )}
      <View style={styles.fabWrap}>
        <Button label="New chat" icon="add" onPress={() => router.push('/connect')} />
      </View>
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
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  welcomeButton: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.xs,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  fabWrap: {
    padding: spacing.lg,
  },
});
