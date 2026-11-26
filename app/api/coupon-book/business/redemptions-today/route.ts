import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)

    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const events = await prisma.redemptionEvent.findMany({
      where: { businessId: business.id, createdAt: { gte: start }, result: "redeemed" },
      include: { coupon: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return jsonOk(
      events.map((e) => ({
        code: e.coupon.code,
        result: e.result,
        createdAt: e.createdAt.toISOString(),
      })),
    )
  } catch (error) {
    return handleRouteError(error)
  }
}
