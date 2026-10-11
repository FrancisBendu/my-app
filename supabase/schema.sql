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
