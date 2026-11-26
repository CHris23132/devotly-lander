import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser, getPrimaryBusinessForUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ActivateOfferButton } from "@/components/coupon-book/ActivateOfferButton"

export default async function BookAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/coupon-book/admin/onboarding")
  const business = await getPrimaryBusinessForUser(user.id)
  if (!business) redirect("/coupon-book/admin/onboarding")

  const offers = await prisma.offer.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Coupon book</h1>
          <p className="mt-2 text-sm text-muted">Approve drafts before they go live.</p>
        </div>
        <Link href={`/b/${business.slug}`} className="btn btn-ghost">
          Preview public book
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {offers.map((offer) => (
          <article key={offer.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-white">{offer.title}</p>
              <p className="mt-1 text-xs text-muted">
                {offer.status} · {offer.type}
                {offer.expiresAt ? ` · expires ${offer.expiresAt.toLocaleDateString("en-CA")}` : ""}
              </p>
            </div>
            {offer.status === "draft" ? <ActivateOfferButton offerId={offer.id} /> : null}
          </article>
        ))}
      </div>
    </div>
  )
}
