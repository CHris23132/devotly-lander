import { getStripe, applySubscriptionStatus } from "@/lib/billing"
import { jsonError, jsonOk } from "@/lib/api"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) return jsonError("Stripe not configured", 503)

  const payload = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) return jsonError("Missing webhook secret", 400)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return jsonError("Invalid signature", 400)
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const businessId = session.metadata?.businessId
      if (businessId) {
        await applySubscriptionStatus(
          businessId,
          "active",
          typeof session.customer === "string" ? session.customer : undefined,
          typeof session.subscription === "string" ? session.subscription : undefined,
        )
      }
      break
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const businessId = sub.metadata?.businessId
      if (businessId) {
        const status =
          sub.status === "active"
            ? "active"
            : sub.status === "trialing"
              ? "trialling"
              : sub.status === "past_due"
                ? "past_due"
                : sub.status === "canceled"
                  ? "canceled"
                  : "unpaid"
        await applySubscriptionStatus(businessId, status, typeof sub.customer === "string" ? sub.customer : undefined, sub.id)
      }
      break
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === "string" ? invoice.customer : null
      if (customerId) {
        // Grace handled in admin banner via past_due status on subscription.updated
      }
      break
    }
    default:
      break
  }

  return jsonOk({ received: true })
}
