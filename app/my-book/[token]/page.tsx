import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { hashToken } from "@/lib/codes"
import { ReferFriend } from "@/components/coupon-book/ReferFriend"
import { WalletButtons } from "@/components/coupon-book/WalletButtons"

export default async function MyBookPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const customer = await prisma.customer.findFirst({
    where: { personalBookTokenHash: hashToken(token) },
    include: {
      business: true,
      coupons: {
        include: { offer: true },
        orderBy: { issuedAt: "desc" },
      },
    },
  })
  if (!customer) notFound()

  const accent = customer.business.brandColor || "#C41E3A"
  const bookHref = `/my-book/${token}`

  return (
    <div className="coupon-book-page">
      <div className="coupon-book-stage">
        <div className="coupon-book-body relative">
          <div className="coupon-book-spine" aria-hidden />
          <div className="coupon-book-spiral" aria-hidden>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="coupon-book-masthead">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a3b2c]">Your book</p>
              <h1 className="mt-1 truncate font-serif text-xl leading-none text-[#1a1410] sm:text-2xl">
                Hi {customer.firstName || "there"} — {customer.business.name}
              </h1>
            </div>
          </div>

          {customer.coupons.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-[#5c5348]">
              No coupons yet. Claim one from the public book.
            </p>
          ) : (
            <div className="coupon-ticket-grid">
              {customer.coupons.map((coupon, index) => (
                <article key={coupon.id} className="coupon-ticket">
                  <div className="coupon-ticket-notch coupon-ticket-notch-l" aria-hidden />
                  <div className="coupon-ticket-notch coupon-ticket-notch-r" aria-hidden />
                  <div className="coupon-ticket-inner">
                    <div className="coupon-ticket-photo">
                      {coupon.offer.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coupon.offer.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#ddd2c3] text-xs text-[#6b6258]">
                          Offer
                        </div>
                      )}
                      <span className="coupon-ticket-badge" style={{ background: accent }}>
                        {coupon.status}
                      </span>
                    </div>
                    <div className="coupon-ticket-copy">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a3b2c]">
                        Coupon {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="coupon-ticket-title mt-1 font-serif text-[#1a1410]">{coupon.offer.title}</h2>
                      {coupon.status === "issued" ? (
                        <p className="mt-3 font-mono text-xl tracking-[0.18em] text-[#1a1410]">{coupon.code}</p>
                      ) : null}
                      {coupon.offer.expiresAt ? (
                        <p className="mt-2 text-[11px] text-[#5c5348]">
                          Expires {coupon.offer.expiresAt.toLocaleDateString("en-CA")}
                        </p>
                      ) : null}
                      {coupon.status === "issued" ? (
                        <div className="mt-3">
                          <WalletButtons claimHref={bookHref} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="coupon-ticket-perf" aria-hidden />
                </article>
              ))}
            </div>
          )}

          <div className="relative z-2 mt-6 px-1">
            <ReferFriend businessId={customer.businessId} referrerCustomerId={customer.id} />
          </div>

          <div className="relative z-2 mt-4 px-1 pb-2">
            <Link
              href={`/b/${customer.business.slug}`}
              className="block rounded-full border border-[#1a1410]/15 bg-white/70 py-3.5 text-center text-sm font-semibold text-[#1a1410]"
            >
              Browse all offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
