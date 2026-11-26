import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createSession, hashPassword } from "@/lib/auth"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"
import { uniqueSlug } from "@/lib/slug"
import { INDUSTRY_TEMPLATES } from "@/lib/industry-templates"
import type { Industry } from "@prisma/client"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  businessName: z.string().min(2),
  industry: z.enum([
    "restaurant",
    "salon",
    "med_spa",
    "golf_entertainment",
    "retail",
    "services",
    "other",
  ]),
  address: z.string().optional(),
  phone: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  timezone: z.string().default("America/Toronto"),
  brandColor: z.string().default("#C6F432"),
})

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json())
    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
    if (existing) return jsonError("Account already exists — sign in instead", 409)

    const slug = await uniqueSlug(body.businessName, async (s) =>
      Boolean(await prisma.business.findUnique({ where: { slug: s } })),
    )

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        passwordHash: await hashPassword(body.password),
      },
    })

    const business = await prisma.business.create({
      data: {
        name: body.businessName,
        slug,
        industry: body.industry as Industry,
        address: body.address,
        phone: body.phone,
        websiteUrl: body.websiteUrl || null,
        timezone: body.timezone,
        brandColor: body.brandColor,
        members: { create: { userId: user.id, role: "owner" } },
      },
    })

    const templates = INDUSTRY_TEMPLATES[body.industry as Industry] ?? INDUSTRY_TEMPLATES.other
    for (const t of templates) {
      await prisma.offer.create({
        data: {
          businessId: business.id,
          type: t.type,
          title: t.title,
          terms: t.terms,
          valueLabel: t.valueLabel,
          percentOff: t.percentOff,
          amountOffCents: t.amountOffCents,
          buyX: "buyX" in t ? t.buyX : undefined,
          getY: "getY" in t ? t.getY : undefined,
          status: "draft",
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      })
    }

    await createSession(user.id)
    return jsonOk({ userId: user.id, businessId: business.id, slug: business.slug })
  } catch (error) {
    return handleRouteError(error)
  }
}
