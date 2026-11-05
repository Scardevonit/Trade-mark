# Tidemark — Go Live (not a demo)

Your screenshots showed a **demo market**. This repo is already a **live broker scaffold**:
live prices, real accounts, real ledger. Follow these steps to handle real money legally.

## 1. What is already live (no key needed)

| Feature | File | Notes |
|---|---|---|
| Live prices | `src/lib/prices.ts` → `GET /api/prices` | Coinbase Exchange public, Kraken fallback, 8s cache |
| Live charts | `src/lib/prices.ts` → `GET /api/candles?symbol=BTC&tf=1H` | 15M / 1H / 4H / 1D |
| Accounts | `POST /api/auth/signup`, `/login`, `/logout`, `GET /api/auth/me` | bcrypt + httpOnly session cookie, 30d |
| Ledger | `src/db/schema.ts` | users, holdings, orders, transactions, broker_keys, kyc_submissions |
| Order engine | `POST /api/orders` | market + limit, 0.25% fee shown pre-trade, balance checks |
| Broker router | `src/lib/broker.ts` | `tidemark_live` internal fill, `alpaca` real API call, coinbase/kraken pass-through |
| Funding | `POST /api/funding` | deposit/withdraw ledger; Stripe hook point marked |
| KYC | `POST /api/kyc` | starter auto-verify; strict mode when `KYC_PROVIDER` set |

## 2. Go live with a regulated broker (required for real settlement)

You (Tidemark) are the **interface**. Alpaca/Coinbase is the **broker**. This is how
Robinhood-style startups launch without owning a license on day one.

### Alpaca (recommended — free, US FINRA/SIPC for securities, crypto via partner)

1. Sign up at https://alpaca.markets → complete individual verification.
2. Go to **Paper trading** → generate Paper keys.
3. In app: **Settings → Connect broker keys → provider=alpaca → paste → paper=ON → Save**.
4. Trade page → venue **Alpaca** → place $1 buy → check **Activity**: `externalOrderId` proves it hit Alpaca.
5. Check Alpaca dashboard paper portfolio — it should match.
6. Only then: generate **Live** keys, save with paper=OFF, keep trade-only permissions.

Env alternative (single global account instead of per-user):
```bash
ALPACA_API_KEY=PK...
ALPACA_API_SECRET=...
ALPACA_PAPER=true
```

### Coinbase Advanced / Kraken (bring-your-own-exchange)

1. User creates exchange account + API key with **trade only** (disable withdraw).
2. Paste in Settings. Orders record with `venue=coinbase|kraken`, `status=routed`.
3. To auto-execute, extend `src/lib/broker.ts::routeOrder` with signed REST calls
   (Coinbase `CB-ACCESS-*` headers, Kraken nonce+HMAC). Stubs + ledger mirroring already done.

## 3. Real deposits (Stripe)

Current `/api/funding` credits the internal ledger instantly and flags whether
`STRIPE_SECRET_KEY` exists. For production cards/ACH:

1. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` in `.env`.
2. Install: `npm i stripe @stripe/stripe-js`
3. Create PaymentIntent server-side on deposit, confirm with Stripe.js, then credit
   cash only inside the `payment_intent.succeeded` webhook (idempotency key = tx id).
4. Gate withdrawals behind `kycStatus=verified` + manual review > $1k.

## 4. KYC/AML (required before raising limits)

1. Pick Persona / Alloy / Sumsub. Set `KYC_PROVIDER=persona` (+ API key).
2. Embed their inquiry in `/onboarding`, point webhook → `POST /api/kyc`.
3. Flip `users.kycStatus` to `verified` only inside the signed webhook.
4. Add sanctions screening (provider add-on) + keep `kyc_submissions` audit rows.

## 5. Legal checklist (talk to a fintech attorney)

- [ ] Money-transmitter licenses (US state-by-state) **or** operate strictly as Alpaca/Coinbase IB/agent
- [ ] FinCEN MSB registration + BSA/AML program, SAR filing process
- [ ] Custody: never hold keys/funds yourself — qualified custodian only
- [ ] Terms, Privacy, Risk Disclosure published (starter at `/compliance` — have counsel review)
- [ ] Tax reporting (1099-B/DA via broker), statements, complaints handling
- [ ] Security: rotate secrets, encrypt `broker_keys` at rest (KMS), rate-limit auth, 2FA, audit logs
- [ ] Incident + disaster-recovery runbooks, backups of Postgres

## 6. Deploy checklist

- [ ] `cp .env.example .env` and fill secrets (never commit `.env`)
- [ ] `npx drizzle-kit push` against production Postgres
- [ ] `npm run build` passes
- [ ] HTTPS + `Secure` cookies (already set in prod), HSTS
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Add monitoring on `/api/health` + `/api/prices` latency

## 7. Quick test script

1. `/signup` → create account → lands in `/app` with $1,000.00
2. Watch BTC price tick every ~8s (LIVE badge).
3. Buy $10 BTC market → Activity shows `filled`, portfolio equity updates.
4. `/funding` → deposit $500 → cash increases.
5. `/onboarding` → submit ID → status verified (or pending with provider).
6. `/settings` → save Alpaca paper keys → switch mode to broker → buy $1 with venue=alpaca.
