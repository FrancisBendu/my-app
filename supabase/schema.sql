-- RAYNO database, step 1: user profiles and staff roles.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- One row per signed-in user. Created by the app after the first SMS sign-in.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text,
  name text,
  location text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Signed-in users can see public profile details (sellers' names and towns).
drop policy if exists "profiles are visible to signed-in users" on public.profiles;
create policy "profiles are visible to signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

-- Each user can create and change only their own profile.
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

-- RAYNO team roles for the future staff dashboard.
-- Only the project owner (in the Supabase dashboard) can add rows here; the app cannot.
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'moderator', 'support', 'finance', 'field_agent')),
  added_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- Staff can see their own role; nobody can change roles from the app.
drop policy if exists "staff see their own role" on public.staff;
create policy "staff see their own role"
  on public.staff for select
  to authenticated
  using (auth.uid() = user_id);

-- RAYNO database, step 2: private 1-to-1 chat.
-- A conversation has two (or more) members; only its members can read or write
-- its messages. This is consent-based messaging: each person is signed in and
-- is a listed member of the conversation. Nobody can read a thread they are not in.

-- One chat thread.
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  is_direct boolean not null default true,
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
-- conversation_members without tripping that table's own row-level policy
-- (a policy that queried the same table it guards would recurse).
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

-- Members can see conversations they belong to.
drop policy if exists "members see their conversations" on public.conversations;
create policy "members see their conversations"
  on public.conversations for select
  to authenticated
  using (public.is_conversation_member(id));

-- Members can see the membership list of conversations they belong to.
drop policy if exists "members see co-members" on public.conversation_members;
create policy "members see co-members"
  on public.conversation_members for select
  to authenticated
  using (public.is_conversation_member(conversation_id));

-- Members can read messages in their conversations.
drop policy if exists "members read messages" on public.messages;
create policy "members read messages"
  on public.messages for select
  to authenticated
  using (public.is_conversation_member(conversation_id));

-- A member can post a message as themselves, only in a conversation they are in.
drop policy if exists "members send messages" on public.messages;
create policy "members send messages"
  on public.messages for insert
  to authenticated
  with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

-- Start (or reuse) a direct conversation with another user. SECURITY DEFINER so
-- it can add both membership rows atomically; the app never inserts members directly.
create or replace function public.create_direct_conversation(other_user uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if other_user is null or other_user = auth.uid() then
    raise exception 'pick a different person to chat with';
  end if;

  -- Reuse the existing direct thread between exactly these two people, if any.
  select c.id into cid
  from public.conversations c
  join public.conversation_members a on a.conversation_id = c.id and a.user_id = auth.uid()
  join public.conversation_members b on b.conversation_id = c.id and b.user_id = other_user
  where c.is_direct
  limit 1;

  if cid is not null then
    return cid;
  end if;

  insert into public.conversations (is_direct) values (true) returning id into cid;
  insert into public.conversation_members (conversation_id, user_id)
    values (cid, auth.uid()), (cid, other_user);
  return cid;
end;
$$;

-- Let signed-in users call the helpers.
grant execute on function public.create_direct_conversation(uuid) to authenticated;

-- Realtime: push new messages to subscribed clients.
-- (Safe to re-run; ignore the "already member" notice on a second run.)
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end
$$;
