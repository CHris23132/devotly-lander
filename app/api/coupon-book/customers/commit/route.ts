import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { refreshConsentFromPurchase } from "@/lib/consent"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const rowSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  lastPurchaseAt: z.string(),
  totalSpentCents: z.number().nullable().optional(),
  tags: z.array(z.string()).optional(),
})

const schema = z.object({
  fileName: z.string(),
  attestation: z.literal(true),
  rows: z.array(rowSchema).min(1),
})

const ATTESTATION =
  "These are my customers, the purchase dates are accurate to my records, and I obtained these numbers in the course of doing business with them."

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    const body = schema.parse(await req.json())

    await prisma.consentAttestation.create({
      data: {
        businessId: business.id,
        userId: user.id,
        fileName: body.fileName,
        statement: ATTESTATION,
      },
    })

    let upserted = 0
    for (const row of body.rows) {
      const lastPurchaseAt = new Date(row.lastPurchaseAt)
      const consent = refreshConsentFromPurchase(lastPurchaseAt)
      await prisma.customer.upsert({
        where: { businessId_phone: { businessId: business.id, phone: row.phone } },
        update: {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email || null,
          lastPurchaseAt,
          totalSpentCents: row.totalSpentCents ?? undefined,
          tags: row.tags ?? [],
          ...consent,
        },
        create: {
          businessId: business.id,
          firstName: row.firstName,
          lastName: row.lastName,
          phone: row.phone,
          email: row.email || null,
          lastPurchaseAt,
          totalSpentCents: row.totalSpentCents ?? undefined,
          tags: row.tags ?? [],
          ...consent,
        },
      })
      upserted += 1
    }

    return jsonOk({ upserted })
  } catch (error) {
    return handleRouteError(error)
  }
}
