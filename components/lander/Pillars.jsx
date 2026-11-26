"use client"

import Reveal from "@/components/lander/Reveal.jsx"

const PILLARS = [
  {
    kicker: "AI Operator",
    title: "Audit, propose, execute",
    body: "Sets up campaigns from store data, segments shoppers, and delivers personalized offers at the right moment — only after you approve, and only inside your guardrails.",
  },
  {
    kicker: "Native App",
    title: "Own the mobile channel",
    body: "A done-for-you iOS/Android storefront with push and rewards on the home screen. Built as an owned channel beyond email and SMS.",
  },
  {
    kicker: "Loyalty Rewards",
    title: "Turn buyers into regulars",
    body: "Points, referrals, VIP tiers, and welcome offers that feed the Operator with a real loyalty program — not a set-and-forget badge.",
  },
]

export default function Pillars() {
  return (
    <section id="pillars" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <p className="kicker">Three pillars</p>
          <h2 className="section-title mt-4 max-w-3xl">
            An AI Operator, a native app, and loyalty — working as one system.
          </h2>
          <p className="lede mt-4 max-w-2xl">
            Not “set up loyalty and forget it.” Devotly continuously uses your store data, loyalty setup, and channels
            while you stay in control.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.kicker} delay={index * 80} className="brutal-card p-5 sm:p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
                {pillar.kicker}
              </p>
              <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-[var(--dev-ink)]">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--dev-muted)]">{pillar.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "More return purchases",
            "Higher average order value",
            "First-time buyer conversion",
            "Personalized audit recommendations",
            "More reviews & credibility",
            "More customer referrals",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[12px] border border-[var(--dev-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--dev-ink)] shadow-[4px_4px_0_var(--dev-line)]"
            >
              {item}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
