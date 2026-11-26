import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser, requireBusinessAccess } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { importWebsite } from "@/lib/import/website"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  websiteUrl: z.string().url(),
  businessId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const body = schema.parse(await req.json())
    const business = body.businessId
      ? (await requireBusinessAccess(body.businessId)).business
      : await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)

    const job = await prisma.importJob.create({
      data: {
        businessId: business.id,
        sourceUrl: body.websiteUrl,
        status: "running",
      },
    })

    const result = await importWebsite(body.websiteUrl, business.industry)

    if (result.businessName && !business.name) {
      await prisma.business.update({
        where: { id: business.id },
        data: { name: result.businessName, logoUrl: result.logoUrl ?? undefined },
      })
    } else if (result.logoUrl) {
      await prisma.business.update({
        where: { id: business.id },
        data: { logoUrl: result.logoUrl },
      })
    }

    for (const item of result.items) {
      await prisma.catalogItem.create({
        data: {
          businessId: business.id,
          source: "website_import",
          name: item.name,
          description: item.description,
          priceCents: item.priceCents,
          imageUrl: item.imageUrl,
          sourceUrl: item.sourceUrl,
        },
      })
    }

    for (const draft of result.draftOffers) {
      await prisma.offer.create({
        data: {
          businessId: business.id,
          type: draft.type,
          title: draft.title,
          terms: draft.terms,
          valueLabel: draft.valueLabel,
          percentOff: draft.percentOff,
          amountOffCents: draft.amountOffCents,
          status: "draft",
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      })
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: result.error && result.items.length === 0 ? "failed" : "completed",
        pagesCrawled: result.pagesCrawled,
        itemsFound: result.items.length,
        error: result.error,
        rawResult: result as object,
      },
    })

    return jsonOk({ jobId: job.id, ...result })
  } catch (error) {
    return handleRouteError(error)
  }
}
