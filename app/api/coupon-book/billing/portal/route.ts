import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { createPortalSession } from "@/lib/billing"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business?.stripeCustomerId) return jsonError("No Stripe customer", 400)
    const session = await createPortalSession(business.stripeCustomerId)
    return jsonOk({ url: session.url })
  } catch (error) {
    return handleRouteError(error)
  }
}
