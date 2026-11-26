import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getConsentLabel } from "@/lib/consent"
import { CustomerUpload } from "@/components/coupon-book/CustomerUpload"

export default async function CustomersPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const customers = await prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return (
    <div>
      <h1 className="font-serif text-4xl">Customers</h1>
      <p className="mt-2 text-sm text-muted">CSV upload requires attestation. Lists are never shared across businesses.</p>

      <div className="mt-8">
        <CustomerUpload />
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted">
            <tr className="border-b border-white/10">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Consent</th>
              <th className="py-2">Last purchase</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-white/8">
                <td className="py-3">
                  {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="py-3 font-mono text-xs">***{c.phone.slice(-4)}</td>
                <td className="py-3 capitalize">{getConsentLabel(c).replace("_", " ")}</td>
                <td className="py-3 text-muted">
                  {c.lastPurchaseAt ? c.lastPurchaseAt.toLocaleDateString("en-CA") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
