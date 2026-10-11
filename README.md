# RAYNO

Your everyday app for Sierra Leone. Buy. Find. Connect.

Built with Expo (React Native), TypeScript and Expo Router. This is a working demo: every screen works, but data is sample data or saved on the phone only. There is no backend yet. See [docs/ROADMAP.md](docs/ROADMAP.md) for the plan to launch.

## Run it

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go, or press `a` (Android), `i` (iOS) or `w` (web).

Typecheck with `npm run typecheck`.

## Project layout

```
src/
  app/                 Expo Router routes (every file is a screen)
    _layout.tsx        Root stack, loads Poppins, provides the app store
    (tabs)/            Bottom tabs: Home, Search, + (create sheet), Messages, Profile
    listing/[id].tsx   Item page (photos, seller, chat, save, share)
    member/[id].tsx    Seller / store / service provider page
    chat/[id].tsx      Chat thread
    market, services, stores, deals, need-it-now
    sell, offer-service, scan, saved, my-listings, edit-profile, notifications, help
  components/          Shared UI (cards, sheets, forms, rows)
  data/mock.ts         Sample sellers, items, chats — replace with API calls later
  data/locations.ts    All 16 districts of Sierra Leone with towns
  lib/store.tsx        What the user creates (saved on the phone with AsyncStorage)
  lib/theme.ts         Brand colours, fonts, spacing
  lib/format.ts        formatNLe(24500) -> "NLe 24,500"
```

## Brand

| Token      | Hex       |
| ---------- | --------- |
| Primary    | `#0066FF` |
| Green      | `#00C853` |
| Dark Navy  | `#0B1F3B` |
| Light Grey | `#F4F6F8` |

Font: Poppins (`@expo-google-fonts/poppins`, bundled with the app).

## Assets

| File                            | Used for                                          |
| ------------------------------- | ------------------------------------------------- |
| `assets/icon.png`               | iOS app icon (opaque, 1024×1024)                  |
| `assets/adaptive-icon.png`      | Android adaptive icon foreground (white background) |
| `assets/splash-icon.png`        | Splash screen (white background)                  |
| `assets/favicon.png`            | Web favicon                                       |
| `assets/rayno-wordmark.png`     | Logo on the Home screen                           |
| `assets/listings/*.jpg`         | Mock listing photos (300×240, ~10 KB each)        |

Expo Go always shows its own icon and splash. Yours appear in development and store builds (`npx eas-cli@latest build`).

## Built for slow connections

- No animation libraries; sheets use the core `Modal` with a fade.
- Mock listing photos are bundled with the app (~75 KB in total), so Home needs no downloads.
- A listing's `image` can also be a remote URL; keep it around 300px. `expo-image` caches it on disk.

## Real sign-in with SMS codes (Supabase)

1. Create a free account at <https://supabase.com> and a **New project** (region: the closest to Sierra Leone, e.g. Europe West). Save the database password somewhere safe.
2. **SQL Editor → New query**: paste everything from `supabase/schema.sql` and press **Run**.
3. **Authentication → Sign In / Providers → Phone**: turn Phone on.
   - **To test today without paying for SMS:** add **Test phone numbers** with a fixed code, e.g. `23276123456=123456`. Those numbers sign in with that code and no SMS is sent.
   - **For real SMS:** create a Twilio (or Vonage / MessageBird) account, then paste its Account SID, Auth Token and sender into the Phone settings. Each SMS costs money (roughly US$0.13–0.25 per SMS to Sierra Leone; check the provider's price list).
4. **Project Settings → API**: copy the **Project URL** and the **anon / publishable** key.
5. In the project folder create a file named `.env` (copy `.env.example`) and fill in both values. Never use the `service_role` / secret key in the app.
6. Restart with `npx expo start --clear`. Profile → **Sign in with phone number**.

New users appear under **Authentication → Users**, and their profiles in **Table Editor → profiles**.
