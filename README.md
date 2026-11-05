# Tidemark — Live Crypto Broker (not a demo)

Live prices, real accounts, real order ledger. Built with **Next.js App Router + PostgreSQL + Drizzle ORM**.

> Your old site (`scarddevonit.github.io/Trade-m…`) was a static demo. This repo is the
> live replacement: deploy it to Vercel/Render/Railway + Postgres and it trades live.

## Features

- **Live market** — Coinbase Exchange feed + Kraken fallback (`/api/prices`, `/api/candles`), 8s refresh, 8 assets
- **Real accounts** — signup/login with bcrypt + httpOnly sessions
- **Real ledger** — cash, holdings, avg-cost, fees, P&L in Postgres (no reset)
- **Order engine** — market + limit, 0.25% fee quoted pre-trade, balance checks
- **Broker routing** — `Tidemark Live` internal fill, or route to your own **Alpaca / Coinbase / Kraken** account
- **Funding** — deposit/withdraw ledger with Stripe hook point
- **KYC** — identity capture with provider webhook point (Persona/Alloy/Sumsub)
- **Pages** — landing, `/app` terminal, `/funding`, `/activity`, `/onboarding`, `/settings`, `/go-live`, `/compliance`, `/learn`

## Quick start (local)

```bash
git clone <your-repo-url>
cd tidemark-live
npm install

cp .env.example .env
# edit .env → set DATABASE_URL to your Postgres

npx drizzle-kit push
npm run dev
# open http://localhost:3000
```

Test: signup → you get **$1,000.00** ledger → buy $10 BTC in `/app` → see it in `/activity`.

## Go live with real money (3 steps)

1. **Broker (required for regulated settlement)** — free at [alpaca.markets](https://alpaca.markets):
   app → Settings → paste Paper keys → trade with venue `Alpaca`. Full guide in `GO-LIVE.md`.
2. **Deposits (Stripe)** — set `STRIPE_SECRET_KEY` + webhook, see `src/app/api/funding/route.ts`.
3. **KYC (Persona/Alloy/Sumsub)** — set `KYC_PROVIDER`, wire webhook → `POST /api/kyc`.

Read **`GO-LIVE.md`** + the in-app **Go-live** page before taking public money.
Tidemark is software, not a licensed broker/bank — you operate as the interface,
Alpaca/Coinbase is the regulated custodian. Get fintech counsel.

## Deploy (Vercel + Neon, free tier works)

1. Create Postgres at [neon.tech](https://neon.tech) → copy connection string.
2. Push this repo to GitHub → Import in [vercel.com](https://vercel.com) → add env vars:
   `DATABASE_URL`, `ALPACA_API_KEY`, `ALPACA_API_SECRET`, `ALPACA_PAPER=true`, (optional Stripe/KYC).
3. After first deploy: run `npx drizzle-kit push` against the Neon URL (or set it as
   `DATABASE_URL` locally once and push), then redeploy.
4. Done — your old GitHub Pages demo link can redirect to the Vercel URL.

## Project map (the "necessary files")

```
.env.example            → every secret for production
GO-LIVE.md              → launch + legal checklist
src/db/schema.ts        → users, sessions, holdings, orders, transactions, broker_keys, kyc
src/lib/prices.ts       → live Coinbase/Kraken feed
src/lib/broker.ts       → Alpaca live execution router
src/lib/auth.ts         → sessions
src/lib/format.ts       → money/fees/assets
src/app/api/orders/route.ts    → order engine
src/app/api/prices/route.ts    → live quotes API
src/app/api/candles/route.ts   → chart API
src/app/api/funding/route.ts   → deposits/withdrawals
src/app/api/kyc/route.ts       → identity
src/app/api/broker-keys/route.ts → saved broker keys
src/app/app/page.tsx    → trading terminal (your screenshot, live)
src/app/page.tsx        → landing (live)
```

## Scripts

```bash
npm run dev     # local dev
npm run build   # production build
npm run start   # serve production
npx drizzle-kit push  # sync schema to Postgres
```

## Legal

See `/compliance` (Risk, Terms, Privacy). Crypto is volatile — you can lose money. Not investment advice.
