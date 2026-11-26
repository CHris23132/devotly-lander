import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SendCampaignButton } from "@/components/coupon-book/SendCampaignButton"
import { filterEligibleRecipients } from "@/lib/consent"

export default async function CampaignsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const campaigns = await prisma.campaign.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  const { eligible } = await filterEligibleRecipients(business.id)

  return (
    <div>
      <h1 className="font-serif text-4xl">Campaigns</h1>
      <p className="mt-2 text-sm text-muted">{eligible.length} customers currently eligible after consent + suppression filter.</p>

      <div className="mt-6">
        <SendCampaignButton eligibleCount={eligible.length} />
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-muted">
            <tr className="border-b border-white/10">
              <th className="py-2">Type</th>
              <th className="py-2">Recipients</th>
              <th className="py-2">Sent</th>
              <th className="py-2">Copy</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-white/8 align-top">
                <td className="py-3">{c.type}</td>
                <td className="py-3">{c.recipientCount}</td>
                <td className="py-3 text-muted">{c.sentAt ? c.sentAt.toLocaleString() : "—"}</td>
                <td className="py-3 text-xs text-muted">{c.templateSms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
