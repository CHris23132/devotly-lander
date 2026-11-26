import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { createVerificationCode, hashToken } from "@/lib/codes"
import { getSmsProvider } from "@/lib/messaging/sms"
import { rateLimit } from "@/lib/rate-limit"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"
import { appConfig } from "@/lib/config"
import { getOtpStore } from "@/lib/otp-store"

const schema = z.object({
  businessSlug: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  offerId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const phone = normalizePhone(body.phone)
    if (!phone) return jsonError("Invalid phone number")

    const ip = req.headers.get("x-forwarded-for") || "local"
    const limited = rateLimit(`claim:${ip}:${phone}`, 5, 10 * 60 * 1000)
    if (!limited.ok) return jsonError("Too many attempts. Try again later.", 429)

    const business = await prisma.business.findUnique({ where: { slug: body.businessSlug } })
    if (!business) return jsonError("Business not found", 404)

    const code = createVerificationCode()
    getOtpStore().set(`${business.id}:${phone}`, {
      codeHash: hashToken(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
    })

    const sms = getSmsProvider()
    await sms.send({
      to: phone,
      body: `${business.name}: your verification code is ${code}. It expires in 10 minutes.`,
    })

    return jsonOk({
      ok: true,
      // Dev convenience only when messaging is dry-run — never in production with live SMS.
      devCode: sms.configured ? undefined : code,
      consentCopyVersion: appConfig.consentCopyVersion,
    })
  } catch (error) {
    return handleRouteError(error)
  }
}
