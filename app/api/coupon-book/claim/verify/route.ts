import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { createPersonalBookToken, hashToken } from "@/lib/codes"
import { issueCoupon } from "@/lib/coupons"
import { appConfig } from "@/lib/config"
import { rateLimit } from "@/lib/rate-limit"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"
import { getOtpStore } from "@/lib/otp-store"
import { getSmsProvider } from "@/lib/messaging/sms"

const schema = z.object({
  businessSlug: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  code: z.string().min(4),
  offerId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const phone = normalizePhone(body.phone)
    if (!phone) return jsonError("Invalid phone number")

    const ip = req.headers.get("x-forwarded-for") || "local"
    const limited = rateLimit(`verify:${ip}:${phone}`, 10, 10 * 60 * 1000)
    if (!limited.ok) return jsonError("Too many attempts. Try again later.", 429)

    const business = await prisma.business.findUnique({ where: { slug: body.businessSlug } })
    if (!business) return jsonError("Business not found", 404)

    const otp = getOtpStore().get(`${business.id}:${phone}`)
    if (!otp || otp.expiresAt < Date.now() || otp.codeHash !== hashToken(body.code)) {
      return jsonError("Invalid or expired verification code", 401)
    }
    getOtpStore().delete(`${business.id}:${phone}`)

    const { token, hash } = createPersonalBookToken()
    const customer = await prisma.customer.upsert({
      where: { businessId_phone: { businessId: business.id, phone } },
      update: {
        email: body.email,
        consentType: "express",
        consentSource: "claim",
        consentCopyVersion: appConfig.consentCopyVersion,
        consentIp: ip,
        consentedAt: new Date(),
        consentExpiresAt: null,
        personalBookTokenHash: hash,
        optedOutAt: null,
      },
      create: {
        businessId: business.id,
        phone,
        email: body.email,
        consentType: "express",
        consentSource: "claim",
        consentCopyVersion: appConfig.consentCopyVersion,
        consentIp: ip,
        consentedAt: new Date(),
        personalBookTokenHash: hash,
      },
    })

    let couponCode: string | undefined
    if (body.offerId) {
      const issued = await issueCoupon({
        businessId: business.id,
        offerId: body.offerId,
        customerId: customer.id,
      })
      couponCode = issued.coupon.code
    } else {
      const offer = await prisma.offer.findFirst({
        where: { businessId: business.id, status: "active" },
        orderBy: { createdAt: "asc" },
      })
      if (offer) {
        const issued = await issueCoupon({
          businessId: business.id,
          offerId: offer.id,
          customerId: customer.id,
        })
        couponCode = issued.coupon.code
      }
    }

    const bookUrl = `${appConfig.appUrl}/my-book/${token}`
    const sms = getSmsProvider()
    await sms.send({
      to: phone,
      body: `${business.name}: your coupon book is ready${couponCode ? ` — code ${couponCode}` : ""}. Open: ${bookUrl} Reply STOP to end`,
    })

    return jsonOk({ couponCode, bookUrl })
  } catch (error) {
    return handleRouteError(error)
  }
}
