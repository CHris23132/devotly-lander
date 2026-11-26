import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getConsentLabel } from "@/lib/consent"
import { canPublishAndSend } from "@/lib/billing"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")

  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const customers = await prisma.customer.findMany({ where: { businessId: business.id } })
  const offers = await prisma.offer.count({ where: { businessId: business.id, status: "active" } })
  const issued = await prisma.coupon.count({ where: { businessId: business.id } })
  const redeemed = await prisma.coupon.count({ where: { businessId: business.id, status: "redeemed" } })
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const redeemedMonth = await prisma.coupon.count({
    where: { businessId: business.id, status: "redeemed", redeemedAt: { gte: monthStart } },
  })
  const referrals = await prisma.referral.groupBy({
    by: ["status"],
    where: { businessId: business.id },
    _count: true,
  })
  const lastCampaign = await prisma.campaign.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  })

  const counts = { eligible: 0, expiring: 0, expired: 0, opted_out: 0, none: 0 }
  for (const c of customers) {
    counts[getConsentLabel(c)] += 1
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">{business.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Public book:{" "}
            <Link className="text-lime" href={`/b/${business.slug}`}>
              /b/{business.slug}
            </Link>
          </p>
        </div>
        <p className="text-sm text-muted">
          Subscription: <span className="text-white">{business.subscriptionStatus}</span>
          {!canPublishAndSend(business) ? " — live sending gated until active" : ""}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Customers" value={String(customers.length)} detail={`${counts.eligible} eligible now`} />
        <Card title="Consent expiring" value={String(counts.expiring)} detail={`${counts.opted_out} opted out`} />
        <Card title="Active offers" value={String(offers)} detail={`${issued} coupons issued`} />
        <Card
          title="Redemptions"
          value={String(redeemedMonth)}
          detail={`${issued ? Math.round((redeemed / issued) * 100) : 0}% overall rate`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg">Messaging</h2>
          <p className="mt-3 text-sm text-muted">
            Last campaign: {lastCampaign ? `${lastCampaign.type} · ${lastCampaign.recipientCount} recipients` : "None yet"}
          </p>
        </div>
        <div className="card p-5">
          <h2 className="text-lg">Referrals</h2>
          <p className="mt-3 text-sm text-muted">
            {referrals.map((r) => `${r.status}: ${r._count}`).join(" · ") || "No referrals yet"}
          </p>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-3xl font-medium">{value}</p>
      <p className="mt-2 text-xs text-muted">{detail}</p>
    </div>
  )
}
