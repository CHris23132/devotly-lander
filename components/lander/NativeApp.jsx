"use client"

import Reveal from "@/components/lander/Reveal.jsx"

export default function NativeApp() {
  return (
    <section id="native-app" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
      <div className="shell grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="kicker">Native app</p>
          <h2 className="section-title mt-4">An owned storefront channel — with push and rewards on the home screen.</h2>
          <p className="lede mt-4 max-w-xl">
            Optional, done-for-you iOS and Android. Use it as the push + rewards channel that sits alongside email and
            SMS inside your guardrails.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-[var(--dev-ink)]">
            <li className="flex gap-3">
              <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[var(--dev-accent)]" />
              Benchmarks used in-product: ~5× push click vs email
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[var(--dev-accent)]" />
              ~75% higher conversion in-app vs mobile web
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[var(--dev-accent)]" />
              Up to ~15% higher AOV / ~20% less cart abandonment vs mobile web
            </li>
          </ul>
          <p className="mt-4 text-xs text-[var(--dev-muted)]">
            Treat as marketing/benchmark claims from the product, not guarantees for every store.
          </p>
        </Reveal>

        <Reveal className="brutal-card overflow-hidden bg-[var(--dev-mint)] p-4 sm:p-5">
          <div className="mx-auto w-full max-w-[280px] rounded-[18px] border border-[var(--dev-ink)] bg-white p-3 shadow-[7px_7px_0_var(--dev-ink)]">
            <div className="rounded-[12px] border border-[var(--dev-ink)] bg-[var(--dev-paper)] p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-muted)]">
                Home screen
              </p>
              <p className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">Rewards ready</p>
              <p className="mt-2 text-sm text-[var(--dev-muted)]">Points, VIP progress, and a welcome offer — visible without opening email.</p>
              <div className="mt-4 grid gap-2">
                <div className="rounded-[10px] border border-[var(--dev-ink)] bg-white px-3 py-2 text-sm font-bold">
                  1,240 points
                </div>
                <div className="rounded-[10px] border border-[var(--dev-ink)] bg-[var(--dev-accent)] px-3 py-2 text-sm font-bold text-white">
                  Push: your offer expires tonight
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
