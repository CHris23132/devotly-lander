import { prisma } from "@/lib/prisma"
import { verifyQrPayload } from "@/lib/codes"
import { processReferralConversion } from "@/lib/referrals"

export async function validateCouponCode(businessId: string, input: string) {
  const signed = verifyQrPayload(input)
  const code = signed?.code ?? input.trim().toUpperCase()

  const coupon = await prisma.coupon.findUnique({
    where: { code },
    include: {
      offer: true,
      customer: true,
      redeemedBy: true,
    },
  })

  if (!coupon) {
    return { ok: false as const, reason: "wrong_business" as const, coupon: null }
  }

  if (coupon.businessId !== businessId) {
    await prisma.redemptionEvent.create({
      data: {
        businessId: coupon.businessId,
        couponId: coupon.id,
        result: "wrong_business",
      },
    })
    return { ok: false as const, reason: "wrong_business" as const, coupon: null }
  }

  if (coupon.status === "redeemed") {
    await prisma.redemptionEvent.create({
      data: { businessId, couponId: coupon.id, result: "already_redeemed" },
    })
    return {
      ok: false as const,
      reason: "already_redeemed" as const,
      coupon,
      redeemedAt: coupon.redeemedAt,
      redeemedBy: coupon.redeemedBy?.name ?? coupon.redeemedBy?.email ?? null,
    }
  }

  if (coupon.status === "expired" || (coupon.offer.expiresAt && coupon.offer.expiresAt < new Date())) {
    await prisma.redemptionEvent.create({
      data: { businessId, couponId: coupon.id, result: "expired" },
    })
    return { ok: false as const, reason: "expired" as const, coupon }
  }

  if (coupon.status === "voided") {
    await prisma.redemptionEvent.create({
      data: { businessId, couponId: coupon.id, result: "void" },
    })
    return { ok: false as const, reason: "void" as const, coupon }
  }

  await prisma.redemptionEvent.create({
    data: { businessId, couponId: coupon.id, result: "valid" },
  })

  return { ok: true as const, reason: "valid" as const, coupon }
}

/** Atomic single-use redemption. Concurrent scans → exactly one success. */
export async function redeemCoupon(businessId: string, codeOrToken: string, staffUserId: string) {
  const signed = verifyQrPayload(codeOrToken)
  const code = signed?.code ?? codeOrToken.trim().toUpperCase()

  const coupon = await prisma.coupon.findUnique({ where: { code } })
  if (!coupon || coupon.businessId !== businessId) {
    return { ok: false as const, reason: "wrong_business" as const }
  }

  const updated = await prisma.coupon.updateMany({
    where: { id: coupon.id, status: "issued" },
    data: {
      status: "redeemed",
      redeemedAt: new Date(),
      redeemedByUserId: staffUserId,
    },
  })

  if (updated.count === 0) {
    const current = await prisma.coupon.findUnique({ where: { id: coupon.id } })
    await prisma.redemptionEvent.create({
      data: {
        businessId,
        couponId: coupon.id,
        staffUserId,
        result: current?.status === "redeemed" ? "already_redeemed" : current?.status === "expired" ? "expired" : "void",
      },
    })
    return {
      ok: false as const,
      reason: (current?.status === "redeemed" ? "already_redeemed" : current?.status === "expired" ? "expired" : "void") as
        | "already_redeemed"
        | "expired"
        | "void",
    }
  }

  await prisma.redemptionEvent.create({
    data: { businessId, couponId: coupon.id, staffUserId, result: "redeemed" },
  })

  await processReferralConversion({ businessId, friendCustomerId: coupon.customerId })

  return { ok: true as const, reason: "redeemed" as const, couponId: coupon.id }
}
