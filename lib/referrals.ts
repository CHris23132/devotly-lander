import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { issueCoupon } from "@/lib/coupons"
import { getSmsProvider } from "@/lib/messaging/sms"
import { filterEligibleRecipients } from "@/lib/consent"
import { appConfig } from "@/lib/config"
import { createPersonalBookToken } from "@/lib/codes"

const REFERRAL_COOLDOWN_DAYS = 90
const DEFAULT_MONTHLY_CAP = 10

export async function createReferral(params: {
  businessId: string
  referrerCustomerId: string
  friendName: string
  friendPhone: string
}) {
  const phone = normalizePhone(params.friendPhone)
  if (!phone) throw new Error("INVALID_PHONE")

  const referrer = await prisma.customer.findFirst({
    where: { id: params.referrerCustomerId, businessId: params.businessId },
  })
  if (!referrer) throw new Error("REFERRER_NOT_FOUND")
  if (referrer.phone === phone) throw new Error("SELF_REFERRAL")

  const existingCustomer = await prisma.customer.findUnique({
    where: { businessId_phone: { businessId: params.businessId, phone } },
  })
  if (existingCustomer) throw new Error("ALREADY_CUSTOMER")

  const recent = await prisma.referral.findFirst({
    where: {
      businessId: params.businessId,
      friendPhone: phone,
      createdAt: { gte: new Date(Date.now() - REFERRAL_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) },
    },
  })
  if (recent) throw new Error("DUPLICATE_REFERRAL")

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const sentThisMonth = await prisma.referral.count({
    where: {
      businessId: params.businessId,
      referrerCustomerId: params.referrerCustomerId,
      createdAt: { gte: monthStart },
    },
  })
  if (sentThisMonth >= DEFAULT_MONTHLY_CAP) throw new Error("MONTHLY_CAP")

  const business = await prisma.business.findUniqueOrThrow({ where: { id: params.businessId } })
  const referral = await prisma.referral.create({
    data: {
      businessId: params.businessId,
      referrerCustomerId: params.referrerCustomerId,
      friendName: params.friendName,
      friendPhone: phone,
      status: "sent",
    },
  })

  const claimUrl = `${appConfig.appUrl}/b/${business.slug}/claim?ref=${referral.id}`
  const body = `${referrer.firstName ?? "A friend"} thought you'd like ${business.name}. Claim your coupon book: ${claimUrl} Reply STOP to end`
  const sms = getSmsProvider()
  await sms.send({ to: phone, body })

  return referral
}

/** Idempotent: issues at most one reward pair when friend converts. */
export async function processReferralConversion(params: {
  businessId: string
  friendCustomerId: string
}) {
  const referral = await prisma.referral.findFirst({
    where: {
      businessId: params.businessId,
      friendCustomerId: params.friendCustomerId,
      status: { in: ["claimed", "converted", "sent"] },
    },
    orderBy: { createdAt: "desc" },
  })
  if (!referral) return null
  if (referral.status === "rewarded") return referral

  const business = await prisma.business.findUniqueOrThrow({ where: { id: params.businessId } })
  const rewardOfferId = business.referralRewardOfferId
  if (!rewardOfferId) return null

  await prisma.referral.update({
    where: { id: referral.id },
    data: { status: "converted", convertedAt: new Date(), friendCustomerId: params.friendCustomerId },
  })

  // Re-check after update to keep dual-issue idempotent under concurrency.
  const locked = await prisma.referral.findUnique({ where: { id: referral.id } })
  if (!locked || locked.status === "rewarded" || locked.rewardCouponIds.length > 0) return locked

  const friendCoupon = await issueCoupon({
    businessId: params.businessId,
    offerId: rewardOfferId,
    customerId: params.friendCustomerId,
  })
  const referrerCoupon = await issueCoupon({
    businessId: params.businessId,
    offerId: rewardOfferId,
    customerId: referral.referrerCustomerId,
  })

  const updated = await prisma.referral.update({
    where: { id: referral.id },
    data: {
      status: "rewarded",
      rewardCouponIds: [friendCoupon.coupon.id, referrerCoupon.coupon.id],
    },
  })

  const sms = getSmsProvider()
  const { eligible } = await filterEligibleRecipients(params.businessId, [
    referral.referrerCustomerId,
    params.friendCustomerId,
  ])
  const eligibleIds = new Set(eligible.map((c) => c.id))

  for (const customerId of [referral.referrerCustomerId, params.friendCustomerId]) {
    if (!eligibleIds.has(customerId)) continue
    const customer = await prisma.customer.findUnique({ where: { id: customerId } })
    if (!customer) continue
    let bookUrl = `${appConfig.appUrl}/b/${business.slug}`
    if (!customer.personalBookTokenHash) {
      const { token, hash } = createPersonalBookToken()
      await prisma.customer.update({ where: { id: customer.id }, data: { personalBookTokenHash: hash } })
      bookUrl = `${appConfig.appUrl}/my-book/${token}`
    }
    await sms.send({
      to: customer.phone,
      body: `${business.name}: your referral reward is ready. Open your book: ${bookUrl} Reply STOP to end`,
    })
  }

  return updated
}
