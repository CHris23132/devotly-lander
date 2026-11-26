import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  quantity: z.number().int().min(25).max(10000),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    const body = schema.parse(await req.json())
    const row = await prisma.physicalBookRequest.create({
      data: {
        businessId: business.id,
        quantity: body.quantity,
        notes: body.notes,
        status: "requested",
      },
    })
    return jsonOk(row)
  } catch (error) {
    return handleRouteError(error)
  }
}
