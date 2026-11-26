import { z } from "zod"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { normalizePhone } from "@/lib/phone"
import { jsonError, jsonOk, handleRouteError } from "@/lib/api"

const schema = z.object({
  csv: z.string().min(1),
})

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0]!.split(",").map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? ""
    })
    return row
  })
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return jsonError("Unauthorized", 401)
    const business = await getPrimaryBusinessForUser(user.id)
    if (!business) return jsonError("No business", 400)
    const body = schema.parse(await req.json())

    const rows = parseCsv(body.csv)
    const preview = {
      parsed: 0,
      accepted: [] as object[],
      rejected: [] as { row: number; reason: string }[],
    }

    const seen = new Set<string>()
    rows.forEach((row, index) => {
      preview.parsed += 1
      const phone = normalizePhone(row.phone || row.mobile || "")
      if (!phone) {
        preview.rejected.push({ row: index + 2, reason: "bad phone" })
        return
      }
      if (seen.has(phone)) {
        preview.rejected.push({ row: index + 2, reason: "duplicate phone in file" })
        return
      }
      seen.add(phone)
      const lastPurchase = row.last_purchase_date || row.lastpurchase || ""
      if (!lastPurchase) {
        preview.rejected.push({ row: index + 2, reason: "missing last_purchase_date" })
        return
      }
      const lastPurchaseAt = new Date(lastPurchase)
      if (Number.isNaN(lastPurchaseAt.getTime())) {
        preview.rejected.push({ row: index + 2, reason: "bad last_purchase_date" })
        return
      }
      preview.accepted.push({
        firstName: row.first_name || row.firstname || "",
        lastName: row.last_name || row.lastname || "",
        phone,
        email: row.email || "",
        lastPurchaseAt: lastPurchaseAt.toISOString(),
        totalSpentCents: row.total_spent ? Math.round(Number(row.total_spent) * 100) : null,
        tags: row.tags ? row.tags.split("|") : [],
      })
    })

    return jsonOk(preview)
  } catch (error) {
    return handleRouteError(error)
  }
}
