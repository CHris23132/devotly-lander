# Devotly

Marketing lander + **Digital Coupon Book** system ($149/month, cancel anytime).

## Stack

- Next.js App Router (TypeScript strict)
- PostgreSQL + Prisma
- Tailwind CSS (existing Devotly design tokens)
- Twilio SMS + SendGrid email behind dry-run providers
- Stripe subscriptions
- Apple/Google Wallet behind a provider interface (home-screen fallback when unconfigured)

This repo was migrated from Vite SPA → Next.js to support the Coupon Book product. The Devotly loyalty lander remains at `/`.

## Quick start

```bash
# Postgres (local Homebrew or docker compose)
createdb devotly   # if needed

cp .env.example .env
# set DATABASE_URL, CUSTOMER_LINK_SECRET, SESSION_SECRET, CRON_SECRET

npm install
npx prisma db push
npm run db:seed
npm run dev
```

- Lander: http://localhost:3000
- Coupon Book sales: http://localhost:3000/coupon-book
- Demo public book: http://localhost:3000/b/demo
- Admin: http://localhost:3000/coupon-book/admin  
  Seed login: `demo@devotly.app` / `demo-password-change-me`

## Scripts

- `npm run dev` — Next.js
- `npm run build` / `npm start`
- `npm run typecheck`
- `npm test`
- `npm run db:seed`

## Billing behaviour

- Draft building is always allowed.
- Live sending + publishing gate on `subscriptionStatus` active/trialling.
- Set `ALLOW_TRIAL_WITHOUT_STRIPE=true` for local demos without Stripe.
- Cancel anytime via Stripe Customer Portal; after the paid period, new coupon issuance stops; already-issued unexpired coupons remain redeemable.
- Currency: `BILLING_CURRENCY` (default `cad`). Create a $149/mo Stripe Price and set `STRIPE_PRICE_COUPON_BOOK_MONTHLY`.

## Messaging

Without Twilio/SendGrid keys, sends are **dry-run**: composed, logged, marked `dry_run`, never claimed as delivered. Admin shows a banner when messaging is unconfigured.

Monthly job: `POST /api/cron/monthly` with `Authorization: Bearer $CRON_SECRET`.

US/Canada marketing SMS needs A2P 10DLC / toll-free verification. Unregistered numbers may be filtered.

## Wallet

Without Apple/Google credentials, wallet buttons stay hidden and the personal book page prompts Add to Home Screen. Do not commit pass certificates.

## Compliance notes

- Canada-first implied consent: last purchase within ~24 months.
- Express consent on claim.
- Shared send filter used by first send, monthly, blasts, referrals, reminders.
- STOP / unsubscribe → immediate suppression.
- This tooling helps apply rules; it does **not** guarantee legal compliance.

## Do not

- Do not paste real API keys into chat or commit `.env`
- Do not send real messages to uploaded lists in development
- Do not build this into Shopify
