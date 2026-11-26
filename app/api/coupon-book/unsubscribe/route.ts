import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { optOutCustomer } from "@/lib/consent"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  businessSlug: z.string(),
  phone: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const phone = normalizePhone(body.phone)
    if (!phone) return jsonError("Invalid phone")
    const business = await prisma.business.findUnique({ where: { slug: body.businessSlug } })
    if (!business) return jsonError("Business not found", 404)
    await optOutCustomer(business.id, phone, "unsubscribe")
    return jsonOk({ ok: true })
  } catch (error) {
    return handleRouteError(error)
  }
}
