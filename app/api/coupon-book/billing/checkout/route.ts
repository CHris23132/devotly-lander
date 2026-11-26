import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { createCheckoutSession, getStripe } from "@/lib/billing"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    if (!getStripe()) {
      return jsonError("STRIPE_NOT_CONFIGURED — set STRIPE_SECRET_KEY and STRIPE_PRICE_COUPON_BOOK_MONTHLY", 503)
    }
    const session = await createCheckoutSession({
      businessId: business.id,
      customerEmail: user.email,
      stripeCustomerId: business.stripeCustomerId,
    })
    return jsonOk({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
