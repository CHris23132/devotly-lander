"use client"
import Reveal from "@/components/lander/Reveal.jsx"

const TIERS = [
  {
    title: "Shopify Growth",
    label: "POS + online store",
    capabilities: ["SMS + email coupon book", "Apple + Google Wallet card", "Member points + rewards", "Native iOS + Android app", "Shopify plugin + checkout upsells"],
  },
  {
    title: "Square Growth",
    label: "POS + mobile loyalty",
    capabilities: ["SMS + email coupon book", "Apple + Google Wallet card", "Member points + rewards", "Native iOS + Android app"],
  },
  {
    title: "Loyalty Essentials",
    label: "Any other POS",
    capabilities: ["SMS + email coupon book", "Apple + Google Wallet card", "Member points + rewards", "No online store required"],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">Plans by setup</p>
          <h2 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Start with the package that fits.</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">We’ll confirm pricing and implementation details around your POS, locations, and customer experience.</p>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier, index) => (
            <Reveal key={tier.title} delay={index * 80}>
              <article className="card lift flex h-full flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lime">{tier.label}</p>
                <h3 className="mt-3 font-serif text-3xl text-white">{tier.title}</h3>
                <p className="mt-4 text-sm text-muted">Custom-fit to your setup</p>
                <ul className="mt-6 space-y-3 text-sm text-white/90">
                  {tier.capabilities.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* PLACEHOLDER: per-tier checkout URL was not supplied. */}
                <a href="#get-started" className="btn btn-lime mt-8 w-full">
                  Talk through my setup
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
