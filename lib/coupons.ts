import { prisma } from "@/lib/prisma"
import { generateCouponCode, hashToken, signQrPayload } from "@/lib/codes"
import { randomBytes } from "node:crypto"

export async function issueCoupon(params: {
  businessId: string
  offerId: string
  customerId: string
}) {
  const offer = await prisma.offer.findFirst({
    where: { id: params.offerId, businessId: params.businessId, status: "active" },
  })
  if (!offer) throw new Error("OFFER_NOT_FOUND")

  const activeCount = await prisma.coupon.count({
    where: {
      businessId: params.businessId,
      offerId: params.offerId,
      customerId: params.customerId,
      status: "issued",
    },
  })
  if (activeCount >= offer.perCustomerLimit) {
    throw new Error("LIMIT_REACHED")
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateCouponCode(10)
    const qrRaw = randomBytes(18).toString("base64url")
    try {
      const coupon = await prisma.coupon.create({
        data: {
          businessId: params.businessId,
          offerId: params.offerId,
          customerId: params.customerId,
          code,
          qrTokenHash: hashToken(qrRaw),
          status: "issued",
        },
        include: { offer: true, customer: true },
      })
      const qrToken = signQrPayload(coupon.id, coupon.code, coupon.businessId)
      return { coupon, qrToken, qrRaw }
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      if (!message.includes("Unique constraint")) throw error
    }
  }
  throw new Error("CODE_COLLISION")
}
