# RAYNO roadmap: from demo to a real app on the Play Store and App Store

_Last updated: October 2026. Prices, store rules and payment providers change, so check each one before you commit money._

## Where we are today

RAYNO is a **working demo**. Everything on screen can be tapped: browsing, item pages, chat, selling with photos, posting requests, services, stores, deals, saved items, a location picker covering all 16 districts, and a QR/barcode scanner.

What makes it a demo:

- The sellers, stores and items are sample data written into the app.
- What you create (listings, chats, profile) is saved **on your phone only**. Nobody else can see it.
- Chat messages don't reach the other person. There is no server yet.
- There are no accounts, payments or notifications.

A real app needs a **server (backend)** so that everyone's phones share the same data. That's the next big step.

---

## Phase 1: Backend (make it real) · about 6–10 weeks

| What | Why | Recommended |
| --- | --- | --- |
| Accounts with phone number + SMS code | Most people in Sierra Leone use phone numbers, not email | Supabase Auth (phone OTP) with an SMS provider |
| Database | Shared listings, profiles, chats, requests | Supabase (PostgreSQL) |
| Photo storage | Listing photos, compressed to about 300 KB | Supabase Storage + image resizing |
| Real-time chat | Messages arrive instantly | Supabase Realtime |
| Push notifications | "New message", "New offer on your request" | Expo Notifications |
| Admin panel | Approve verified sellers, remove scams, handle reports | Simple web dashboard |
| Location | Already built: region → district → town | Optional GPS "near me" later |

**Why Supabase:** one service covers login, database, storage and chat. There's a free tier to start and a paid plan (about US$25/month) at launch. It works well with this app. Firebase is a good alternative.

**Costs to expect:**
- Hosting: about US$0–25/month at first, more as you grow.
- SMS codes: priced per message. Check current SMS rates to Sierra Leone from Twilio, Vonage or Africa's Talking.
- WhatsApp verification codes can be cheaper.

## Phase 2: Payments · start simple, then add "RAYNO Pay"

Sierra Leone runs on **mobile money**: **Orange Money** and **Afrimoney**.

1. **At launch: cash and mobile money between buyer and seller.** RAYNO connects people, they agree in chat and pay each other directly. No licence is needed and it's quick to launch. Most marketplaces start this way.
2. **Later: in-app payment ("RAYNO Pay") with buyer protection (escrow).** The buyer pays into RAYNO, the seller ships, the buyer confirms, then RAYNO releases the money minus a small fee. This builds trust and earns a commission. You need:
   - **A payment partner** that collects Orange Money and Afrimoney through an API. Options to contact:
     - Sierra Leone payment aggregators such as **Monime**
     - **Orange Money**'s merchant/web-payment API
     - **Africell (Afrimoney)**'s merchant API
     - Pan-African gateways: check whether they currently support Sierra Leone collections and payouts
   - **Legal advice**: holding customer money may need approval from the **Bank of Sierra Leone**. The usual way around this is to let a licensed partner hold the funds.
3. **App Store / Play Store rules:**
   - Physical goods and real-world services (phones, plumbers) **can** use your own mobile-money payments.
   - Paid digital extras sold *inside* the app, such as "boost my listing" or a "store subscription", may have to use Apple/Google in-app purchase, which takes 15–30%. Check the current guidelines, or sell these extras through your website or by mobile money outside the app.

## Phase 3: Security and trust

**Trust (what users see):**
- **Phone-number login** with one-time SMS codes. No passwords to steal.
- **Verified badge**: check the national ID (NCRA) for individuals, and business registration for stores (Corporate Affairs Commission / OARG). The admin panel handles approval.
- **Report and block** on every listing, profile and chat. Both stores require this for apps with user content.
- **Reviews only after a real transaction**, so ratings can't be faked.
- **Scam warnings**: detect phrases like "send money first" in chats and show a warning. The safety tips are already in the app.
- **Hide phone numbers** until both sides agree, to reduce spam.

**Technical (behind the scenes):**
- Database rules (Row Level Security) so users can only change their own data.
- No secret keys inside the app. Anything sensitive runs on the server.
- HTTPS everywhere (Supabase does this by default).
- Rate limits on login, posting and messages to stop spam bots.
- Automatic photo moderation, plus admin review of reported content.
- Daily backups and audit logs of admin actions.
- Account deletion inside the app. **Apple requires it.**
- A **Privacy Policy** and **Terms of Use** web page. Both stores require these.

## Phase 4: Publishing on Google Play and the App Store · about 2–4 weeks

| | Google Play | Apple App Store |
| --- | --- | --- |
| Developer account | US$25 one-time | US$99 per year |
| As a company | Needs a D-U-N-S number (free, can take weeks) | Needs a D-U-N-S number |
| Testing before launch | New personal accounts must run a closed test (currently 12+ testers for 14 days) | TestFlight (optional) |
| Review time | Hours to a few days | About 1–3 days |

**What both stores ask for:**
- App icon (done)
- Screenshots
- Short and long description
- Privacy policy URL
- Content rating questionnaire
- Data safety / privacy labels
- A **test account** for the reviewer
- For user-generated content: report/block and terms of use

**How we build it** (no Mac needed):
```
npx eas-cli@latest build --platform android   # creates the Play Store file (.aab)
npx eas-cli@latest build --platform ios       # creates the App Store file
npx eas-cli@latest submit                     # uploads to the stores
```
After launch, small fixes can go out instantly with `eas update`, without a new store review.

**Tip:** register a **company** first (see Phase 6). The store listing then shows "RAYNO Ltd" instead of your personal name, and you'll need it for payment partners anyway.

## Phase 5: Launch and growth (selling it to the public)

1. **Pilot in one area first.** Freetown, e.g. Lumley + Kissy + the PZ/Big Market area. A marketplace only works when there are enough sellers in one place.
2. **Sign up sellers in person before launch.** Aim for 100–200 shops and service providers, including phone shops, furniture stores, tailors and electricians. Upload their products for them. Give them free "Verified" badges and free featured listings in the first months.
3. **Then bring buyers:**
   - Facebook and TikTok videos showing real local deals
   - WhatsApp status and groups
   - Local radio
   - Campus ambassadors (FBC, Njala, UniMak, IAMTECH)
   - Posters with RAYNO QR codes at shops. The scanner is already built for this.
4. **Referral rewards**, e.g. airtime for every friend who signs up and posts.
5. **Keep it light**: small app size and compressed photos, so it works on cheap phones and slow data.

**How RAYNO makes money** (start free, add these gradually):
- **Featured / boosted listings**: pay to appear at the top.
- **Store subscriptions**: monthly plan for businesses with a verified badge, more listings and analytics.
- **RAYNO Pay commission**: a small % on protected payments (Phase 2).
- **Delivery partnerships** with okada/keke riders and courier companies.
- **Ads** from local brands (later, once there are many users).

## Phase 6: Business setup

- Register the company (Corporate Affairs Commission / OARG) and get a business bank account.
- Get a TIN from the National Revenue Authority.
- Register the domain **rayno.sl** (or .com) and a professional email.
- Trademark the RAYNO name and logo.
- Write the Privacy Policy and Terms (a local lawyer is best), and follow Sierra Leone's data protection rules.
- Sign agreements with your payment partner and SMS provider.

## Phase 7: Funding

**What you need to raise (rough estimates; refine them with real quotes):**

| Item | Rough cost |
| --- | --- |
| Store accounts, domain, email | US$150–300 first year |
| Server + SMS (first 6 months) | US$300–1,500 |
| Company registration + legal (policies, contracts) | US$500–2,000 |
| Developer(s) to finish the backend (contract or salary, 3–4 months) | US$4,000–15,000 |
| Seller onboarding team / agents (3–6 months) | US$2,000–6,000 |
| Marketing for the launch (social media, radio, posters, referrals) | US$2,000–10,000 |
| **Total for a 6-month lean launch** | **≈ US$9,000–35,000** |

**Where to get it:**
- **Bootstrap**: your savings, plus pre-selling "launch partner" packages to shops (featured placement for a year).
- **Friends, family and local business partners**, e.g. a phone distributor or bank that benefits from RAYNO.
- **Grants and programmes open to Sierra Leonean founders**: check current eligibility and deadlines.
  - Tony Elumelu Foundation Entrepreneurship Programme
  - Africa's Business Heroes
  - Google for Startups Accelerator: Africa
  - Programmes run by Sierra Leone's Directorate of Science, Technology and Innovation (DSTI), and local innovation hubs
- **Angel investors and accelerators**, once you have traction (users, sellers, transactions).

**What funders will ask for:**
1. A **pitch deck** (10–12 slides: problem, solution, demo, market, business model, traction, team, money needed and how it's spent).
2. A **working demo**. You have this now.
3. **Traction**: seller sign-ups, waitlist numbers, letters of intent from shops.
4. A simple **financial plan** for 12–18 months.
5. The **team**: who does tech, sales and operations.

---

## Suggested next 30 days

**You:**
- [ ] Collect real product photos from 20–30 shops, with their permission, and their details.
- [ ] Talk to 30+ sellers and service providers: would they list on RAYNO? What would they pay for?
- [ ] Start the company registration and open the Google Play developer account.
- [ ] Choose the payment partner to talk to (Orange Money, Afrimoney or an aggregator).

**Development (we can do this together):**
- [ ] Set up Supabase: phone login, database, photo storage.
- [ ] Connect the app to it: real listings, real chat, real profiles.
- [ ] Add report/block, account deletion, and Privacy Policy and Terms pages.
- [ ] First test build for Android testers (closed test).
