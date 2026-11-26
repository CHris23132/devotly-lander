import Link from "next/link"
import { WalletButtons } from "@/components/coupon-book/WalletButtons"

export type BookOffer = {
  id: string
  title: string
  valueLabel: string | null
  terms: string | null
  imageUrl: string | null
  expiresAt: Date | null
  type: string
}

export type BookBusiness = {
  name: string
  slug: string
  address: string | null
  phone: string | null
  logoUrl: string | null
  brandColor: string
}

function daysLeft(expiresAt: Date | null) {
  if (!expiresAt) return null
  return Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
}

function formatExpiry(expiresAt: Date) {
  return expiresAt.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  })
}

export function CouponBookView({
  business,
  offers,
}: {
  business: BookBusiness
  offers: BookOffer[]
}) {
  const accent = business.brandColor || "#C41E3A"

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

          {offers.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-[#5c5348]">No active offers right now.</p>
          ) : (
            <div className="coupon-ticket-grid">
              {offers.map((offer, index) => {
                const left = daysLeft(offer.expiresAt)
                const claimHref = `/b/${business.slug}/claim?offer=${offer.id}`
                return (
                  <article key={offer.id} className="coupon-ticket group">
                    <div className="coupon-ticket-notch coupon-ticket-notch-l" aria-hidden />
                    <div className="coupon-ticket-notch coupon-ticket-notch-r" aria-hidden />

                    <div className="coupon-ticket-inner">
                      <div className="coupon-ticket-photo">
                        {offer.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={offer.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#ddd2c3] text-xs text-[#6b6258]">
                            Offer
                          </div>
                        )}
                        <span className="coupon-ticket-badge" style={{ background: accent }}>
                          Coupon {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="coupon-ticket-copy">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a3b2c]">
                          Limited time
                        </p>
                        <h2 className="coupon-ticket-title mt-1 font-serif tracking-tight text-[#1a1410]">
                          {offer.title}
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-[#8a3b2c]">
                          {offer.valueLabel ?? offer.title}
                        </p>
                        {offer.terms ? (
                          <p className="coupon-ticket-terms mt-2 leading-relaxed text-[#5c5348]">{offer.terms}</p>
                        ) : null}

                        <div className="coupon-ticket-meta mt-3 flex items-end justify-between gap-3 border-t border-dashed border-[#c9baa8] pt-3">
                          <div className="min-w-0">
                            {offer.expiresAt ? (
                              <p className="text-[11px] font-medium text-[#1a1410] sm:text-xs">
                                Expires {formatExpiry(offer.expiresAt)}
                                {left != null ? (
                                  <span className="text-[#8a3b2c]">
                                    {" "}
                                    · {left} day{left === 1 ? "" : "s"} left
                                  </span>
                                ) : null}
                              </p>
                            ) : null}
                            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[#7a7166]">
                              ▮▮▮▮▮▮▮▮▮ SAMPLE
                            </p>
                          </div>
                          <Link
                            href={claimHref}
                            className="coupon-claim-btn shrink-0 rounded-full px-3.5 py-2.5 text-xs font-semibold text-white sm:px-4 sm:text-sm"
                            style={{ background: accent }}
                          >
                            Claim
                          </Link>
                        </div>

                        <div className="mt-3">
                          <WalletButtons claimHref={claimHref} />
                        </div>
                      </div>
                    </div>

                    <div className="coupon-ticket-perf" aria-hidden />
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="coupon-book-footer">
        <div className="coupon-book-footer-inner">
          <Link
            href={`/b/${business.slug}/claim`}
            className="flex-1 rounded-full py-3.5 text-center text-sm font-semibold text-white"
            style={{ background: accent }}
          >
            Save my book
          </Link>
          <Link
            href="/coupon-book"
            className="flex-1 rounded-full border border-[#1a1410]/15 bg-white/80 py-3.5 text-center text-sm font-semibold text-[#1a1410]"
          >
            About Devotly
          </Link>
        </div>
      </div>
    </div>
  )
}
