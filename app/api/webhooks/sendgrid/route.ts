import { prisma } from "@/lib/prisma"
import { optOutCustomer } from "@/lib/consent"
import { jsonOk } from "@/lib/api"

type SgEvent = { event?: string; email?: string }

export async function POST(req: Request) {
  // Signature verification should use SENDGRID webhook verification key when configured.
  const events = (await req.json()) as SgEvent[]
  for (const event of events) {
    if (!event.email) continue
    if (event.event === "unsubscribe" || event.event === "spamreport" || event.event === "bounce") {
      const customers = await prisma.customer.findMany({
        where: { email: { equals: event.email, mode: "insensitive" } },
      })
      for (const customer of customers) {
        if (event.event === "unsubscribe" || event.event === "spamreport") {
          await optOutCustomer(customer.businessId, customer.phone, "unsubscribe")
        }
        await prisma.suppression.create({
          data: {
            businessId: customer.businessId,
            email: event.email.toLowerCase(),
            reason:
              event.event === "bounce" ? "bounce" : event.event === "spamreport" ? "spam_report" : "unsubscribe",
          },
        })
      }
    }
  }
  return jsonOk({ ok: true })
}
