import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { hasStripe, hasTwilio, hasSendGrid, hasAppleWallet, hasGoogleWallet } from "@/lib/config"
import { BillingActions } from "@/components/coupon-book/BillingActions"
import { PhysicalBookForm } from "@/components/coupon-book/PhysicalBookForm"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted">{business.name}</p>
      </div>

      <section className="card p-5">
        <h2 className="text-lg">Billing</h2>
        <p className="mt-2 text-sm text-muted">
          Plan: $149/month, cancel anytime. Status: <span className="text-white">{business.subscriptionStatus}</span>
        </p>
        <p className="mt-2 text-xs text-muted">
          Stripe configured: {hasStripe() ? "yes" : "no — checkout disabled until keys are set"}
        </p>
        <div className="mt-4">
          <BillingActions hasCustomer={Boolean(business.stripeCustomerId)} />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg">Integrations</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>Twilio SMS: {hasTwilio() ? "configured" : "dry-run"}</li>
          <li>SendGrid email: {hasSendGrid() ? "configured" : "dry-run"}</li>
          <li>Apple Wallet: {hasAppleWallet() ? "credentials present" : "fallback (home screen)"}</li>
          <li>Google Wallet: {hasGoogleWallet() ? "credentials present" : "fallback (home screen)"}</li>
          <li>
            A2P 10DLC / toll-free registration: required for US/Canada marketing SMS. Unregistered numbers may be
            filtered by carriers.
          </li>
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="text-lg">Printed physical book (add-on)</h2>
        <p className="mt-2 text-sm text-muted">
          Digital is included. Physical is quoted manually — print + delivery make it the costlier option.
        </p>
        <div className="mt-4">
          <PhysicalBookForm />
        </div>
      </section>
    </div>
  )
}
