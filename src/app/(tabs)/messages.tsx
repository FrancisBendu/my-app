import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, Button, EmptyState, VerifiedBadge } from '@/components/ui';
import { chatTime } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function MessagesScreen() {
  const { conversations, getMember, getListing } = useStore();

  const threads = useMemo(
    () =>
      conversations
        .map((c) => ({ ...c, last: c.messages[c.messages.length - 1] }))
        .sort((a, b) => (b.last?.at ?? '').localeCompare(a.last?.at ?? '')),
    [conversations],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppText weight="semiBold" size={22} style={styles.heading}>
        Messages
      </AppText>
      <AppText size={13} color={colors.textMuted} style={styles.subheading}>
        Chat with sellers and service providers. Tap “Chat” on any item or profile to start.
      </AppText>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No messages yet"
            body="When you chat with a seller about an item, the conversation shows up here."
            action={<Button label="Browse the Market" onPress={() => router.push('/market')} />}
          />
        }
        renderItem={({ item }) => {
          const member = getMember(item.memberId);
          if (!member) return null;
          const listing = item.listingId ? getListing(item.listingId) : undefined;
          const preview = item.last
            ? `${item.last.from === 'me' ? 'You: ' : ''}${item.last.text}`
            : listing
              ? `About: ${listing.title}`
              : 'No messages yet';
          return (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Avatar name={member.name} size={50} color={member.kind === 'store' ? colors.primary : colors.navy} />
              <View style={styles.body}>
                <View style={styles.line}>
                  <View style={styles.nameRow}>
                    <AppText weight="semiBold" size={15} numberOfLines={1} style={styles.shrink}>
                      {member.name}
                    </AppText>
                    {member.verified ? <VerifiedBadge size={14} /> : null}
                  </View>
                  {item.last ? (
                    <AppText size={11} color={colors.textMuted}>
                      {chatTime(item.last.at)}
                    </AppText>
                  ) : null}
                </View>
                <View style={styles.line}>
                  <AppText size={13} color={colors.textMuted} numberOfLines={1} style={styles.flex}>
                    {preview}
                  </AppText>
                  {item.unread > 0 ? (
                    <View style={styles.badge}>
                      <AppText weight="semiBold" size={11} color={colors.white}>
                        {item.unread}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  subheading: {
    paddingHorizontal: spacing.lg,
    marginTop: 2,
  },
  list: {
    padding: spacing.lg,
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
  body: {
    flex: 1,
    gap: 2,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shrink: {
    flexShrink: 1,
  },
  flex: {
    flex: 1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
