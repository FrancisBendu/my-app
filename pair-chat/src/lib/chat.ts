/**
 * Real-time 1-to-1 chat backed by Supabase (see supabase/schema.sql).
 *
 * Consent-based messaging: both people are signed in and are listed members of
 * the conversation. Row-level security means a user can only read or write
 * threads they belong to — nobody can read someone else's chat.
 *
 * Every function is safe to call in preview mode (no .env): it returns an error
 * string instead of throwing.
 */
import { supabase } from './supabase';

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type ChatSummary = {
  id: string;
  partnerName: string;
  lastText: string | null;
  lastAt: string | null;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

const NOT_CONNECTED = 'The server is not connected yet.';
const MESSAGE_COLUMNS = 'id, conversation_id, sender_id, body, created_at';

const toMessage = (row: MessageRow): ChatMessage => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderId: row.sender_id,
  text: row.body,
  createdAt: row.created_at,
});

/** Create a fresh single-use invite code to share with the person you want to chat with. */
export async function createInvite(): Promise<{ code: string | null; error: string | null }> {
  if (!supabase) return { code: null, error: NOT_CONNECTED };
  const { data, error } = await supabase.rpc('create_chat_invite');
  if (error) return { code: null, error: error.message };
  return { code: data as string, error: null };
}

/** Redeem a code the other person shared, which connects you and opens the thread. */
export async function redeemInvite(code: string): Promise<{ id: string | null; error: string | null }> {
  if (!supabase) return { id: null, error: NOT_CONNECTED };
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { id: null, error: 'Enter the code the other person shared.' };
  const { data, error } = await supabase.rpc('redeem_chat_invite', { invite_code: trimmed });
  if (error) return { id: null, error: error.message };
  return { id: data as string, error: null };
}

/** The other member of a conversation: their display name, or their phone, or "Partner". */
export async function getPartner(
  conversationId: string,
  myId: string,
): Promise<{ name: string; error: string | null }> {
  if (!supabase) return { name: 'Partner', error: NOT_CONNECTED };
  const { data: members, error: membersError } = await supabase
    .from('conversation_members')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .neq('user_id', myId)
    .limit(1);
  if (membersError) return { name: 'Partner', error: membersError.message };

  const otherId = (members as { user_id: string }[])[0]?.user_id;
  if (!otherId) return { name: 'Partner', error: null };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, phone')
    .eq('id', otherId)
    .maybeSingle();
  if (profileError) return { name: 'Partner', error: profileError.message };

  const row = profile as { name: string | null; phone: string | null } | null;
  return { name: row?.name?.trim() || row?.phone || 'Partner', error: null };
}

/** All of the signed-in user's chats, newest activity first. */
export async function listChats(myId: string): Promise<{ chats: ChatSummary[]; error: string | null }> {
  if (!supabase) return { chats: [], error: NOT_CONNECTED };
  const client = supabase;

  const { data: mine, error: mineError } = await client
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', myId);
  if (mineError) return { chats: [], error: mineError.message };

  const ids = (mine as { conversation_id: string }[]).map((r) => r.conversation_id);
  if (ids.length === 0) return { chats: [], error: null };

  const { data: others, error: othersError } = await client
    .from('conversation_members')
    .select('conversation_id, user_id')
    .in('conversation_id', ids)
    .neq('user_id', myId);
  if (othersError) return { chats: [], error: othersError.message };

  const partnerByConv = new Map<string, string>();
  const partnerIds = new Set<string>();
  (others as { conversation_id: string; user_id: string }[]).forEach((r) => {
    if (!partnerByConv.has(r.conversation_id)) {
      partnerByConv.set(r.conversation_id, r.user_id);
      partnerIds.add(r.user_id);
    }
  });

  const names = new Map<string, string>();
  if (partnerIds.size) {
    const { data: profiles } = await client
      .from('profiles')
      .select('id, name, phone')
      .in('id', [...partnerIds]);
    (profiles as { id: string; name: string | null; phone: string | null }[] | null)?.forEach((p) => {
      names.set(p.id, p.name?.trim() || p.phone || 'Partner');
    });
  }

  const { data: msgs, error: msgError } = await client
    .from('messages')
    .select('conversation_id, body, created_at')
    .in('conversation_id', ids)
    .order('created_at', { ascending: false });
  if (msgError) return { chats: [], error: msgError.message };

  const lastByConv = new Map<string, { body: string; created_at: string }>();
  (msgs as { conversation_id: string; body: string; created_at: string }[]).forEach((m) => {
    if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, { body: m.body, created_at: m.created_at });
  });

  const chats: ChatSummary[] = ids.map((id) => {
    const partnerId = partnerByConv.get(id);
    const last = lastByConv.get(id);
    return {
      id,
      partnerName: (partnerId && names.get(partnerId)) || 'Partner',
      lastText: last?.body ?? null,
      lastAt: last?.created_at ?? null,
    };
  });
  chats.sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? ''));
  return { chats, error: null };
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
