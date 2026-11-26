import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { optOutCustomer } from "@/lib/consent"
import { jsonOk } from "@/lib/api"

const STOP_WORDS = new Set(["stop", "stopall", "unsubscribe", "end", "quit", "cancel"])

export async function POST(req: Request) {
  const form = await req.formData()
  const from = normalizePhone(String(form.get("From") || ""))
  const body = String(form.get("Body") || "").trim().toLowerCase()

  if (!from) return jsonOk({ ok: false })

  if (STOP_WORDS.has(body)) {
    const customers = await prisma.customer.findMany({ where: { phone: from } })
    for (const customer of customers) {
      await optOutCustomer(customer.businessId, from, "stop")
    }
    // Non-promotional confirmation is allowed.
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You are unsubscribed and will not receive more marketing texts from these businesses.</Message></Response>`,
      { headers: { "Content-Type": "text/xml" } },
    )
  }

  return jsonOk({ ok: true })
}
