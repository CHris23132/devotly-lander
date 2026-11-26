import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(["draft", "active", "paused", "expired"]).optional(),
  title: z.string().optional(),
  terms: z.string().optional(),
})

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    const body = patchSchema.parse(await req.json())

    const existing = await prisma.offer.findFirst({ where: { id: body.id, businessId: business.id } })
    if (!existing) return jsonError("Not found", 404)

    const offer = await prisma.offer.update({
      where: { id: body.id },
      data: {
        status: body.status,
        title: body.title,
        terms: body.terms,
      },
    })
    return jsonOk(offer)
  } catch (error) {
    return handleRouteError(error)
  }
}
