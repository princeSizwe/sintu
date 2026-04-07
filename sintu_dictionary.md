# Sintu (Chazwi) — Dictionary + Compare + Feed + Predictions (MVP)

## Tech
- Next.js (App Router) + TypeScript + Tailwind
- PostgreSQL + Prisma

## Setup
1. Copy env:
   - `cp .env.example .env`
2. Set `DATABASE_URL` (Postgres).
3. Install deps:
   - `npm i`
4. Migrate DB:
   - `npx prisma migrate dev`
5. Seed starter data:
   - `npx prisma db seed`
6. Run:
   - `npm run dev`

## Admin bootstrap (Option A)
Set `ADMIN_EMAIL` in `.env`. If a user registers with that email, they will be created as `ADMIN`.

## PayFast
This repo includes a **scaffold** only:
- `/api/payfast/start` (TODO: redirect + signature)
- `/api/payfast/itn` (TODO: full ITN verification + subscription update)

Default mode is `PAYFAST_MODE=sandbox`.

## Sintu Laws (initial encoding)
- Law #1: syllable heuristic tokenizer
- Law #2: morpheme concept table
- Law #3: vowel spectrum scoring (a/e/i/o/u) implemented as a rule-based scoring matrix and consonant-skeleton matching (MVP approximation)

## Rankings (Word of Day / Week)
MVP currently tracks events in `WordEvent`. You requested a **weighted formula** (recommended).
Suggested weights:
- SEARCH: 1
- VIEW: 2
- COMPARE: 3
- POST_MENTION: 4

Next step: update `/rankings` query to compute a weighted score (instead of raw count).

## Predictions + Payouts
- Predictions are public (all bets displayed).
- **Payouts are private per user** (stored in `PayoutLedger`).
- A future admin job/action will compute profit share pools (e.g., 20%) and allocate to winners by tier.