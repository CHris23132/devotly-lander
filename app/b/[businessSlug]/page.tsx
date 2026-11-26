import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CouponBookView } from "@/components/coupon-book/CouponBookView"

export default async function PublicBookPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    include: {
      offers: {
        where: { status: "active" },
        orderBy: { expiresAt: "asc" },
      },
    },
  })
  if (!business) notFound()

  const now = new Date()
  const offers = business.offers
    .filter((o) => !o.expiresAt || o.expiresAt > now)
    .map((o) => ({
      id: o.id,
      title: o.title,
      valueLabel: o.valueLabel,
      terms: o.terms,
      imageUrl: o.imageUrl,
      expiresAt: o.expiresAt,
      type: o.type,
    }))

  return (
    <CouponBookView
      business={{
        name: business.name,
        slug: business.slug,
        address: business.address,
        phone: business.phone,
        logoUrl: business.logoUrl,
        brandColor: business.brandColor,
      }}
      offers={offers}
    />
  )
}
