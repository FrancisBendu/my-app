-- Tether database. Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Tether is a private chat for two people who both choose to connect. Row-level
-- security means a person can only ever read or write a thread they belong to.

-- One row per signed-in user. Created by the app after the first SMS sign-in.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text,
  name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in user can read the profiles of people (so a partner's name shows).
drop policy if exists "profiles readable by signed-in users" on public.profiles;
create policy "profiles readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "users insert their own profile" on public.profiles;
create policy "users insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- One chat thread between two people.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  -- The two members' ids, sorted and joined, so a pair can only ever have ONE
  -- thread between them.
  pair_key text unique,
  created_at timestamptz not null default now()
);

-- Who is in a conversation. One row per (conversation, user).
create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- One message in a conversation.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);
create index if not exists conversation_members_user_idx
  on public.conversation_members (user_id);

-- Membership check used by the policies below. SECURITY DEFINER so it can read
-- conversation_members without tripping that table's own row-level policy.
create or replace function public.is_conversation_member(cid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversation_members m
    where m.conversation_id = cid and m.user_id = auth.uid()
  );
$$;

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

drop policy if exists "members see their conversations" on public.conversations;
create policy "members see their conversations"
  on public.conversations for select
  to authenticated
  using (public.is_conversation_member(id));

drop policy if exists "members see co-members" on public.conversation_members;
create policy "members see co-members"
  on public.conversation_members for select
  to authenticated
  using (public.is_conversation_member(conversation_id));

drop policy if exists "members read messages" on public.messages;
create policy "members read messages"
  on public.messages for select
  to authenticated
  using (public.is_conversation_member(conversation_id));

drop policy if exists "members send messages" on public.messages;
create policy "members send messages"
  on public.messages for insert
  to authenticated
  with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

-- Start (or reuse) the one direct conversation between the caller and other_user.
-- SECURITY DEFINER so it can add both membership rows atomically.
create or replace function public.create_direct_conversation(other_user uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  key text;
begin
  if other_user is null or other_user = auth.uid() then
    raise exception 'pick a different person to chat with';
  end if;

  key := least(auth.uid()::text, other_user::text) || ':' || greatest(auth.uid()::text, other_user::text);

  select id into cid from public.conversations where pair_key = key;
  if cid is not null then
    return cid;
  end if;

  begin
    insert into public.conversations (pair_key) values (key) returning id into cid;
    insert into public.conversation_members (conversation_id, user_id)
      values (cid, auth.uid()), (cid, other_user);
  exception when unique_violation then
    -- The other person connected at the same moment; use the thread they made.
    select id into cid from public.conversations where pair_key = key;
  end;
  return cid;
end;
$$;

grant execute on function public.create_direct_conversation(uuid) to authenticated;

-- Link two people by a single-use, expiring invite code.
create table if not exists public.chat_invites (
  code text primary key,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_by uuid references auth.users (id) on delete set null,
  used_at timestamptz
);

-- Only the security-definer functions below touch this table.
alter table public.chat_invites enable row level security;

create or replace function public.create_chat_invite()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  -- No I, L, O, 0 or 1 — easy to read aloud and type.
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  attempts int := 0;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    begin
      insert into public.chat_invites (code, created_by) values (code, auth.uid());
      return code;
    exception when unique_violation then
      attempts := attempts + 1;
      if attempts > 10 then
        raise exception 'could not generate a code, please try again';
      end if;
    end;
  end loop;
end;
$$;

create or replace function public.redeem_chat_invite(invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.chat_invites;
  cid uuid;
begin
  select * into inv from public.chat_invites
  where code = upper(trim(invite_code))
  for update;

  if inv.code is null then
    raise exception 'that code is not valid';
  end if;
  if inv.used_by is not null then
    raise exception 'that code has already been used';
  end if;
  if inv.expires_at < now() then
    raise exception 'that code has expired';
  end if;
  if inv.created_by = auth.uid() then
    raise exception 'that is your own code — share it with the other person';
  end if;

  cid := public.create_direct_conversation(inv.created_by);

  update public.chat_invites
    set used_by = auth.uid(), used_at = now()
    where code = inv.code;

  return cid;
end;
$$;

grant execute on function public.create_chat_invite() to authenticated;
grant execute on function public.redeem_chat_invite(text) to authenticated;

-- Realtime: push new messages to subscribed clients.
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end
$$;
