# Sintu (Chazwi) — Bantu Language Dictionary

A full-stack dictionary and community platform for Bantu languages (Zulu, Sotho, Xhosa, Tswana,Tsonga, Venda0), featuring word comparison, a community feed, prediction rounds, and subscription payments via PayFast.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **PostgreSQL** + **Prisma ORM**
- **JWT** cookie-based session auth
- **PayFast** payment integration (sandbox mode)

## Features

- 🔍 **Search** — full-text word search across languages
- ⚖️ **Compare** — side-by-side word comparison (tracked)
- 📰 **Feed** — community posts with word mentions
- 🏆 **Rankings** — Word of the Day/Week via weighted event scores
- 🎯 **Predictions** — public prediction rounds; submit your bet
- 💳 **Pricing** — PayFast subscription (sandbox scaffold)
- 💰 **Payouts** — private per-user payout ledger
- 🌐 **Translate** — MVP cross-language word lookup
- 🔧 **Admin** — user management panel (ADMIN role)

## Sintu Laws (Encoding)

- **Law #1**: syllable heuristic tokenizer
- **Law #2**: morpheme concept table
- **Law #3**: vowel spectrum scoring (a/e/i/o/u) — rule-based matrix + consonant-skeleton matching

## Rankings Weights

| Event Type   | Weight |
|--------------|--------|
| SEARCH       | 1      |
| VIEW         | 2      |
| COMPARE      | 3      |
| POST_MENTION | 4      |

## Setup

```bash
# 1. Copy env template
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, etc.

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Seed starter data (Zulu/Sotho/Xhosa + sample entries)
npx prisma db seed

# 6. Start dev server
npm run dev
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string                     |
| `JWT_SECRET`          | Secret for signing JWT session tokens            |
| `ADMIN_EMAIL`         | Email that gets the ADMIN role on registration   |
| `PAYFAST_MODE`        | `sandbox` or `live`                              |
| `PAYFAST_MERCHANT_ID` | PayFast merchant ID                              |
| `PAYFAST_MERCHANT_KEY`| PayFast merchant key                             |

## Admin Bootstrap

Set `ADMIN_EMAIL` in `.env`. When a user registers with that email they are automatically assigned the `ADMIN` role.

## PayFast Integration (Scaffold)

- `/api/payfast/start` — returns sandbox redirect payload (TODO: full signature + redirect)
- `/api/payfast/itn` — ITN handler skeleton (TODO: IP validation, MD5 verify, DB update)

Default: `PAYFAST_MODE=sandbox`

## Seed Data

Running `npx prisma db seed` creates:

- **Languages**: Zulu (`zu`), Sotho (`st`), Xhosa (`xh`)
- **Zulu entries**: moya (spirit/wind/air), hla, hle, hli, hlo, hlu
- **Morphemes** for moya: `mo` (noun prefix), `ya` (connective)
- **Sotho entry**: motho (person)
- **Xhosa entry**: ubuntu (humanity)

## API Routes

| Method | Route                              | Description                        |
|--------|------------------------------------|------------------------------------|
| POST   | `/api/auth/register`               | Register user                      |
| POST   | `/api/auth/login`                  | Login                              |
| POST   | `/api/auth/logout`                 | Logout                             |
| GET    | `/api/entries/search?q=&lang=`     | Search entries                     |
| GET    | `/api/entries/[id]`                | Get entry + track VIEW             |
| GET    | `/api/compare?ids=id1,id2`         | Compare entries + track COMPARE    |
| GET    | `/api/translate?word=&from=&to=`   | Cross-language lookup              |
| GET    | `/api/feed`                        | List posts                         |
| POST   | `/api/feed`                        | Create post (auth required)        |
| GET    | `/api/rankings?period=week\|day`   | Weighted word rankings             |
| GET    | `/api/predictions`                 | List prediction rounds             |
| POST   | `/api/predictions`                 | Create round (admin only)          |
| POST   | `/api/predictions/[roundId]/predict` | Submit prediction (auth)         |
| POST   | `/api/payfast/start`               | Start PayFast subscription         |
| POST   | `/api/payfast/itn`                 | PayFast ITN webhook                |
| GET    | `/api/me/payouts`                  | My payout ledger (auth)            |
| GET    | `/api/admin/users`                 | List users (admin only)            |
