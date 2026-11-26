import type { Business, SubscriptionStatus } from "@prisma/client"
import { appConfig, hasStripe } from "@/lib/config"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export function getStripe(): Stripe | null {
  if (!hasStripe()) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export function canPublishAndSend(business: Pick<Business, "subscriptionStatus">): boolean {
  if (appConfig.allowTrialWithoutStripe) return true
  return business.subscriptionStatus === "active" || business.subscriptionStatus === "trialling"
}

export function canBuildDrafts(): boolean {
  return true
}

export async function createCheckoutSession(params: {
  businessId: string
  customerEmail: string
  stripeCustomerId?: string | null
}) {
  const stripe = getStripe()
  if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED")

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: params.stripeCustomerId ?? undefined,
    customer_email: params.stripeCustomerId ? undefined : params.customerEmail,
    line_items: [{ price: process.env.STRIPE_PRICE_COUPON_BOOK_MONTHLY!, quantity: 1 }],
    success_url: `${appConfig.appUrl}/coupon-book/admin?checkout=success`,
    cancel_url: `${appConfig.appUrl}/coupon-book/admin/onboarding?step=billing&checkout=cancel`,
    metadata: { businessId: params.businessId },
    subscription_data: { metadata: { businessId: params.businessId } },
    allow_promotion_codes: true,
  })

  return session
}

export async function createPortalSession(stripeCustomerId: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED")
  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${appConfig.appUrl}/coupon-book/admin/settings`,
  })
}

export async function applySubscriptionStatus(
  businessId: string,
  status: SubscriptionStatus,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
) {
  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionStatus: status,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
    },
  })
}
