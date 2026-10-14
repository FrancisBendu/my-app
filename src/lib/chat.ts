/**
 * Real-time 1-to-1 chat backed by Supabase (see supabase/schema.sql, step 2).
 *
 * This is the consent-based messaging layer: both people are signed in and are
 * listed members of the conversation. Row-level security means a user can only
 * read or write threads they belong to — nobody can read someone else's chat.
 *
 * Every function is safe to call in demo mode (no .env): it returns an error
 * string instead of throwing, so screens can fall back to the local store.
 */
import { supabase } from './supabase';

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

/** Row shape as it comes back from the `messages` table. */
type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

const NOT_CONNECTED = 'The RAYNO server is not connected yet.';
const MESSAGE_COLUMNS = 'id, conversation_id, sender_id, body, created_at';

const toMessage = (row: MessageRow): ChatMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderId: row.sender_id,
  text: row.body,
  createdAt: row.created_at,
});

/** Start (or reuse) a direct conversation with another signed-in user. */
export async function startDirectConversation(
  otherUserId: string,
): Promise<{ id: string | null; error: string | null }> {
  if (!supabase) return { id: null, error: NOT_CONNECTED };
  const { data, error } = await supabase.rpc('create_direct_conversation', { other_user: otherUserId });
  if (error) return { id: null, error: error.message };
  return { id: data as string, error: null };
}

/** Load a conversation's messages, oldest first. */
export async function fetchMessages(
  conversationId: string,
): Promise<{ messages: ChatMessage[]; error: string | null }> {
  if (!supabase) return { messages: [], error: NOT_CONNECTED };
  const { data, error } = await supabase
    .from('messages')
    .select(MESSAGE_COLUMNS)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) return { messages: [], error: error.message };
  return { messages: (data as MessageRow[]).map(toMessage), error: null };
}

/** Post a message to a conversation as the signed-in user. */
export async function sendMessage(
  conversationId: string,
  text: string,
): Promise<{ message: ChatMessage | null; error: string | null }> {
  if (!supabase) return { message: null, error: NOT_CONNECTED };
  const body = text.trim();
  if (!body) return { message: null, error: 'Message is empty.' };

  const { data: auth } = await supabase.auth.getUser();
  const senderId = auth.user?.id;
  if (!senderId) return { message: null, error: 'You are signed out.' };

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select(MESSAGE_COLUMNS)
    .single();
  if (error) return { message: null, error: error.message };
  return { message: toMessage(data as MessageRow), error: null };
}

/**
 * Listen for new messages in a conversation as they arrive on other devices.
 * Returns an unsubscribe function; call it when the screen unmounts.
 */
export function subscribeToMessages(
  conversationId: string,
  onInsert: (message: ChatMessage) => void,
): () => void {
  if (!supabase) return () => {};
  const client = supabase;
  const channel = client
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(toMessage(payload.new as MessageRow)),
    )
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}
