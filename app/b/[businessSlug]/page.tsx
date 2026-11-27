import { notFound } from "next/navigation"
import { CouponBookView } from "@/components/coupon-book/CouponBookView"
import { getStaticDemoBook } from "@/lib/demo-book"

async function loadBusinessBook(slug: string) {
  if (!process.env.DATABASE_URL) return null

  try {
    const { prisma } = await import("@/lib/prisma")
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        offers: {
          where: { status: "active" },
          orderBy: { expiresAt: "asc" },
        },
      },
    })
    if (!business) return null

    const now = new Date()
    return {
      business: {
        name: business.name,
        slug: business.slug,
        address: business.address,
        phone: business.phone,
        logoUrl: business.logoUrl,
        brandColor: business.brandColor,
      },
      offers: business.offers
        .filter((o) => !o.expiresAt || o.expiresAt > now)
        .map((o) => ({
          id: o.id,
          title: o.title,
          valueLabel: o.valueLabel,
          terms: o.terms,
          imageUrl: o.imageUrl,
          expiresAt: o.expiresAt,
          type: o.type,
        })),
    }
  } catch (error) {
    console.error("[public-book] database unavailable", error)
    return null
  }
}

export default async function PublicBookPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params
  const fromDb = await loadBusinessBook(businessSlug)
  const book = fromDb ?? (businessSlug === "demo" ? getStaticDemoBook() : null)
  if (!book) notFound()

  return <CouponBookView business={book.business} offers={book.offers} />
}
