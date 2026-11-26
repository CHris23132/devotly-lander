import { z } from "zod"
import { createReferral } from "@/lib/referrals"
import { rateLimit } from "@/lib/rate-limit"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  businessId: z.string(),
  referrerCustomerId: z.string(),
  friendName: z.string().min(1),
  friendPhone: z.string().min(7),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const limited = rateLimit(`referral:${body.referrerCustomerId}`, 10, 60 * 60 * 1000)
    if (!limited.ok) return jsonError("Too many referrals", 429)
    const referral = await createReferral(body)
    return jsonOk({ id: referral.id, status: referral.status })
  } catch (error) {
    return handleRouteError(error)
  }
}
