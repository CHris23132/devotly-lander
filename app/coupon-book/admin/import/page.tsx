import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ImportAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const jobs = await prisma.importJob.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })
  const drafts = await prisma.offer.findMany({
    where: { businessId: business.id, status: "draft" },
    orderBy: { createdAt: "desc" },
  })
  const items = await prisma.catalogItem.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <h1 className="font-serif text-4xl">Website import review</h1>
      <p className="mt-2 text-sm text-muted">
        Draft offers only — nothing is live until you approve in the{" "}
        <Link className="text-lime" href="/coupon-book/admin/book">
          book builder
        </Link>
        .
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg">Extracted items</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.length === 0 ? <li className="text-muted">No items — use manual templates.</li> : null}
            {items.map((item) => (
              <li key={item.id} className="border-b border-white/8 py-2">
                {item.name}
                {item.priceCents != null ? ` · $${(item.priceCents / 100).toFixed(2)}` : ""}
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="text-lg">Draft offers</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {drafts.map((offer) => (
              <li key={offer.id} className="border-b border-white/8 py-2">
                {offer.title}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 text-sm text-muted">
        Recent jobs:{" "}
        {jobs.map((j) => `${j.status} (${j.itemsFound} items)`).join(" · ") || "None"}
      </div>
    </div>
  )
}
