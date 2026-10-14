/**
 * A live 1-to-1 chat. Messages sync across both people's phones in real time.
 * Only the two members can read or send — enforced by row-level security.
 */
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { Avatar, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fetchMessages, getPartner, sendMessage, subscribeToMessages, type ChatMessage } from '@/lib/chat';
import { chatTime } from '@/lib/format';
import { colors, radius, spacing } from '@/lib/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const myId = session?.user.id;
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [partner, setPartner] = useState('Partner');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
  }, []);

  useEffect(() => {
    if (!id || !myId) return;
    let active = true;

    fetchMessages(id).then(({ messages: loaded }) => {
      if (!active) return;
      setMessages(loaded);
      setLoading(false);
    });
    getPartner(id, myId).then(({ name }) => {
      if (active) setPartner(name);
    });

    const unsubscribe = subscribeToMessages(id, (message) => {
      if (active) addMessage(message);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [id, myId, addMessage]);

  if (!myId) {
    return (
      <EmptyState
        icon="lock-closed-outline"
        title="Sign in to chat"
        body="Tether needs you signed in with your phone number."
      />
    );
  }

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !id) return;
    setText('');
    setSending(true);
    const { message, error } = await sendMessage(id, trimmed);
    setSending(false);
    if (error) {
      setText(trimmed);
      return;
    }
    if (message) addMessage(message);
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
            <View style={styles.headerTitle}>
              <Avatar name={partner} size={32} />
              <AppText weight="semiBold" size={16} numberOfLines={1} style={styles.shrink}>
                {partner}
              </AppText>
            </View>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <AppText size={13} color={colors.textMuted} style={styles.emptyText}>
              You are connected. Say hello to {partner}.
            </AppText>
          }
          renderItem={({ item }) => {
            const mine = item.senderId === myId;
            return (
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                <AppText size={14} color={mine ? colors.mineText : colors.text}>
                  {item.text}
                </AppText>
                <AppText size={10} color={mine ? 'rgba(255,255,255,0.7)' : colors.textMuted} style={styles.time}>
                  {chatTime(item.createdAt)}
                </AppText>
              </View>
            );
          }}
        />
      )}

      <View style={[styles.inputBar, { paddingBottom: spacing.sm + insets.bottom }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={send}
          disabled={!text.trim() || sending}
          style={[styles.sendButton, (!text.trim() || sending) && styles.sendDisabled]}
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
    backgroundColor: colors.surface,
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: colors.mineBubble,
    borderBottomRightRadius: 4,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.theirsBubble,
    borderBottomLeftRadius: 4,
  },
  time: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingTop: 11,
    paddingBottom: 11,
    backgroundColor: colors.surface,
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
