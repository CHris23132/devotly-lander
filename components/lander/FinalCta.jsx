"use client"

import Reveal from "@/components/lander/Reveal.jsx"

export default function FinalCta() {
  return (
    <section id="get-started" className="py-16 sm:py-20">
      <div className="shell">
        <Reveal className="brutal-card bg-[var(--dev-accent)] p-7 text-white sm:p-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">Get started</p>
          <h2 className="mt-4 max-w-3xl text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.02] tracking-[-0.045em]">
            Install Devotly. Run an audit. Approve what the Operator sends — inside your guardrails.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/85">
            Built for Shopify merchants who want more return purchases, higher AOV, and first-time conversion without
            standing up a retention team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#get-started"
              className="btn border-[var(--dev-ink)] bg-white text-[var(--dev-ink)] shadow-[4px_4px_0_var(--dev-ink)] hover:bg-[var(--dev-mint)]"
            >
              Install on Shopify
            </a>
            <a
              href="#how-it-works"
              className="btn border-white bg-transparent text-white shadow-[4px_4px_0_rgba(255,255,255,0.35)] hover:bg-white/10"
            >
              See how the audit works
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
