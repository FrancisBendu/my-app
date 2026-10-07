import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, EmptyState, VerifiedBadge } from '@/components/ui';
import { categoryStyle } from '@/data/mock';
import { chatTime, formatNLe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, fonts, radius, spacing } from '@/lib/theme';

const QUICK_REPLIES = ['Is this still available?', 'What is your last price?', 'Can you deliver?', 'Where can we meet?'];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { conversations, getMember, getListing, sendMessage, markRead } = useStore();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const conversation = conversations.find((c) => c.id === id);
  const member = conversation ? getMember(conversation.memberId) : undefined;
  const listing = conversation?.listingId ? getListing(conversation.listingId) : undefined;

  useEffect(() => {
    if (conversation) markRead(conversation.id);
  }, [conversation, markRead]);

  if (!conversation || !member) {
    return <EmptyState icon="chatbubbles-outline" title="Chat not found" body="Start a chat from a listing or profile." />;
  }

  const send = (value = text) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(conversation.id, trimmed);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Pressable onPress={() => router.push(`/member/${member.id}`)} style={styles.headerTitle}>
              <Avatar name={member.name} size={32} />
              <AppText weight="semiBold" size={16} numberOfLines={1} style={styles.shrink}>
                {member.name}
              </AppText>
              {member.verified ? <VerifiedBadge /> : null}
            </Pressable>
          ),
        }}
      />

      {listing ? (
        <Pressable onPress={() => router.push(`/listing/${listing.id}`)} style={styles.listingBar}>
          <View style={[styles.thumb, { backgroundColor: categoryStyle[listing.category].tint }]}>
            {listing.image ? (
              <Image source={listing.image} style={styles.thumbImage} contentFit="cover" />
            ) : (
              <Ionicons name={categoryStyle[listing.category].icon} size={20} color={colors.navy} />
            )}
          </View>
          <View style={styles.flex}>
            <AppText weight="medium" size={13} numberOfLines={1}>
              {listing.title}
            </AppText>
            <AppText weight="semiBold" size={13} color={colors.primary}>
              {formatNLe(listing.price, listing.priceSuffix)}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>
      ) : null}

      <FlatList
        ref={listRef}
        data={conversation.messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <AppText size={13} color={colors.textMuted} style={styles.emptyText}>
            Say hello to {member.name}. Tap a quick message below or type your own.
          </AppText>
        }
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <AppText size={14} color={colors.text}>
                {item.text}
              </AppText>
              <AppText size={10} color={colors.textMuted} style={styles.time}>
                {chatTime(item.at)}
              </AppText>
            </View>
          );
        }}
      />

      <FlatList
        horizontal
        data={QUICK_REPLIES}
        keyExtractor={(q) => q}
        showsHorizontalScrollIndicator={false}
        style={styles.quickList}
        contentContainerStyle={styles.quick}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable onPress={() => send(item)} style={styles.quickChip}>
            <AppText size={12} color={colors.primary}>
              {item}
            </AppText>
          </Pressable>
        )}
      />

      <View style={[styles.inputBar, { paddingBottom: spacing.sm + insets.bottom }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={() => send()}
          disabled={!text.trim()}
          style={[styles.sendButton, !text.trim() && styles.sendDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Send"
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: 240,
  },
  shrink: {
    flexShrink: 1,
  },
  listingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  messages: {
    padding: spacing.lg,
    gap: spacing.sm,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: '#DDF7E6',
    borderBottomRightRadius: 4,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  time: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  quickList: {
    flexGrow: 0,
  },
  quick: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  quickChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#CFE0FF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingTop: 11,
    paddingBottom: 11,
    backgroundColor: colors.lightGrey,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
