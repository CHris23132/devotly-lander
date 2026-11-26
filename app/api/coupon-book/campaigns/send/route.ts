import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { canPublishAndSend } from "@/lib/billing"
import { sendCampaignToEligible } from "@/lib/messaging/send"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  type: z.enum(["first_send", "monthly", "blast", "expiry_reminder"]),
  customerIds: z.array(z.string()).optional(),
  confirm: z.literal(true),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    if (!canPublishAndSend(business)) {
      return jsonError("Subscription inactive — live sending is gated. Draft building is still allowed.", 402)
    }

    const body = schema.parse(await req.json())
    const result = await sendCampaignToEligible({
      businessId: business.id,
      type: body.type,
      customerIds: body.customerIds,
    })
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
