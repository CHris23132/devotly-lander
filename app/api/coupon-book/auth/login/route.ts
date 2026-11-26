import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession, verifyPassword } from "@/lib/auth"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("Invalid email or password", 401)
    }
    await createSession(user.id)
    return jsonOk({ ok: true })
  } catch (error) {
    return handleRouteError(error)
  }
}
