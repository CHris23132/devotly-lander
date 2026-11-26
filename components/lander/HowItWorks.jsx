"use client"

import Reveal from "@/components/lander/Reveal.jsx"

const STEPS = [
  {
    n: "01",
    title: "Install on Shopify",
    body: "Open the embedded admin and start from Overview — store health, campaign value, and opportunity in one place.",
  },
  {
    n: "02",
    title: "Run a store audit",
    body: "Devotly ranks win-back, conversion, and AOV opportunities from your order history with modelled monthly opportunity.",
  },
  {
    n: "03",
    title: "Create a campaign",
    body: "Pick a ranked opportunity. The Operator proposes the campaign — you turn it on. No free-form manual builder.",
  },
  {
    n: "04",
    title: "Set guardrails",
    body: "Discount cap, max messages per shopper per month, and allowed channels. AI never exceeds the stricter limit.",
  },
  {
    n: "05",
    title: "Turn on loyalty levers",
    body: "Points, referrals, and a welcome offer (scratch, wheel, or mystery-box style) so rewards fuel retention.",
  },
  {
    n: "06",
    title: "Operate",
    body: "Approve and toggle campaigns, re-run audits, tweak guardrails and rewards. Optional native app for push + home-screen rewards.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <p className="kicker">How it works</p>
          <h2 className="section-title mt-4 max-w-3xl">Audit → campaign → guardrails → rewards → app.</h2>
          <p className="lede mt-4 max-w-2xl">
            Merchants approve what goes live. The Operator personalizes offers and messaging inside the rules you set.
          </p>
        </Reveal>

        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.n} delay={index * 60} className="brutal-card p-5">
              <p className="font-extrabold tracking-[-0.04em] text-[var(--dev-accent)] text-3xl">{step.n}</p>
              <h3 className="mt-3 text-xl font-extrabold tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--dev-muted)]">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
