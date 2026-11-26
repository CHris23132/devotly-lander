import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ReferralsAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const referrals = await prisma.referral.findMany({
    where: { businessId: business.id },
    include: { referrer: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div>
      <h1 className="font-serif text-4xl">Referrals</h1>
      <p className="mt-2 text-sm text-muted">
        Reward trigger: {business.referralTrigger}. Set a referral reward offer id in the database/settings when ready.
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-muted">
            <tr className="border-b border-white/10">
              <th className="py-2">Referrer</th>
              <th className="py-2">Friend</th>
              <th className="py-2">Status</th>
              <th className="py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id} className="border-b border-white/8">
                <td className="py-3">{r.referrer.firstName || "***" + r.referrer.phone.slice(-4)}</td>
                <td className="py-3">
                  {r.friendName} · ***{r.friendPhone.slice(-4)}
                </td>
                <td className="py-3">{r.status}</td>
                <td className="py-3 text-muted">{r.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
