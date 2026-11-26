import { prisma } from "@/lib/prisma"
import { sendCampaignToEligible } from "@/lib/messaging/send"
import { jsonError, jsonOk } from "@/lib/api"

export async function POST(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!secret || secret !== process.env.CRON_SECRET) return jsonError("Unauthorized", 401)

  const businesses = await prisma.business.findMany({
    where: { subscriptionStatus: { in: ["active", "trialling"] } },
  })

  const results = []
  for (const business of businesses) {
    const monthKey = new Date().toISOString().slice(0, 7)
    const already = await prisma.campaign.findFirst({
      where: {
        businessId: business.id,
        type: "monthly",
        createdAt: {
          gte: new Date(`${monthKey}-01T00:00:00.000Z`),
        },
      },
    })
    if (already) {
      results.push({ businessId: business.id, skipped: true })
      continue
    }

    const sent = await sendCampaignToEligible({ businessId: business.id, type: "monthly" })
    results.push({ businessId: business.id, ...sent })
  }

  // Expiry sweep
  await prisma.coupon.updateMany({
    where: {
      status: "issued",
      offer: { expiresAt: { lt: new Date() } },
    },
    data: { status: "expired" },
  })

  return jsonOk({ results })
}
