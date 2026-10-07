# RAYNO

Your everyday app for Sierra Leone. Buy. Find. Connect.

Built with Expo (React Native), TypeScript and Expo Router. This is the UI foundation: all data is mocked, there is no backend yet.

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
    _layout.tsx        Root stack, loads Poppins
    (tabs)/            Bottom tabs: Home, Search, + (create sheet), Messages, Profile
    need-it-now.tsx    Placeholder screens opened from the Home action cards
    market.tsx
    services.tsx
    stores.tsx
    deals.tsx
  components/          Shared UI (cards, sheets, logo, text)
  data/mock.ts         ALL mock data — replace with API calls later
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

## Built for slow connections

- No animation libraries; sheets use the core `Modal` with a fade.
- The logo and listing tiles are drawn from views and icons, so the home screen needs no image downloads.
- Listings accept an optional small `image` URL (~240px); when set it is shown via `expo-image` with disk caching.
