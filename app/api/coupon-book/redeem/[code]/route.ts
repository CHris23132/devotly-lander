import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { validateCouponCode, redeemCoupon } from "@/lib/redemption"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)

    const { code } = await ctx.params
    const limited = rateLimit(`redeem-get:${business.id}:${user.id}`, 60, 60_000)
    if (!limited.ok) return jsonError("Too many requests", 429)

    const result = await validateCouponCode(business.id, decodeURIComponent(code))
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error)
  }
}

const postSchema = z.object({
  confirm: z.literal(true),
})

export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    postSchema.parse(await req.json())

    const { code } = await ctx.params
    const limited = rateLimit(`redeem-post:${business.id}:${user.id}`, 30, 60_000)
    if (!limited.ok) return jsonError("Too many requests", 429)

    const result = await redeemCoupon(business.id, decodeURIComponent(code), user.id)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
