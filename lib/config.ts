export const appConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  billingCurrency: (process.env.BILLING_CURRENCY ?? "cad").toLowerCase(),
  monthlyPriceCents: 14900,
  allowTrialWithoutStripe: process.env.ALLOW_TRIAL_WITHOUT_STRIPE === "true",
  defaultTimezone: "America/Toronto",
  defaultCountry: "CA" as const,
  consentCopyVersion: "claim-v1",
  marketingSmsCapDefault: 3,
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function hasTwilio(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      (process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_FROM_NUMBER),
  )
}

export function hasSendGrid(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL)
}

export function hasStripe(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_COUPON_BOOK_MONTHLY)
}

export function hasAppleWallet(): boolean {
  return Boolean(
    process.env.APPLE_WALLET_PASS_TYPE_ID &&
      process.env.APPLE_WALLET_TEAM_ID &&
      process.env.APPLE_WALLET_CERT_PEM &&
      process.env.APPLE_WALLET_KEY_PEM,
  )
}

export function hasGoogleWallet(): boolean {
  return Boolean(process.env.GOOGLE_WALLET_ISSUER_ID && process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON)
}
