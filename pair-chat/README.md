# Tether

A private 1-to-1 chat app, built with Expo (SDK 57) + Expo Router + Supabase.

Two people sign in, one shares a single-use invite code, and their messages
sync live between both phones. It is consent-based: each person chooses to
connect, and row-level security means nobody can read a thread they are not in.

This is a standalone app, separate from anything else in the repository.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project, then run `supabase/schema.sql` in the Supabase
   SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
3. Enable **Phone** auth in Supabase (Authentication → Providers → Phone) and
   connect an SMS provider.
4. Copy the env template and fill it in:
   ```bash
   cp .env.example .env
   ```
   Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   from Supabase → Settings → API.
5. Start the app:
   ```bash
   npx expo start
   ```

Without a `.env`, the app runs in a signed-out preview and explains what to set up.

## How two people connect

1. Both sign in with their phone number.
2. Person A: **New chat → Create my code → Share code**.
3. Person B: **New chat → enter the code → Connect**.

They now share one private thread (a pair can only ever have one), and messages
appear on both phones in real time.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
```

## Layout

- `src/app/` — screens (Expo Router): home list, sign-in, connect, chat.
- `src/lib/` — Supabase client, auth, and the chat data layer.
- `src/components/` — shared UI.
- `supabase/schema.sql` — tables, row-level security, and functions.
