"use client"

import Reveal from "@/components/lander/Reveal.jsx"

const STEPS = [
  "Welcome — what you get with Devotly",
  "Audit — find dormant, conversion, and AOV opportunity",
  "Campaign — create the first campaign from a ranked opportunity",
  "Guardrails — discount cap, message cap, channels",
  "Rewards — points, referrals, welcome offer",
  "Mobile App — native iOS + Android build for the store",
]

export default function Onboarding() {
  return (
    <section id="onboarding" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
      <div id="get-started" className="scroll-mt-[5rem]" />
      <div className="shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="kicker">Get live</p>
          <h2 className="section-title mt-4">One guided setup. Six linear steps.</h2>
          <p className="lede mt-4">
            During setup you move forward in order. After go-live, revisit any step — re-run audits, toggle campaigns,
            and keep guardrails honest.
          </p>
        </Reveal>

        <Reveal className="brutal-card p-2 sm:p-3">
          <ol className="divide-y divide-[var(--dev-ink)]">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-4 px-3 py-4 sm:px-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-[var(--dev-ink)] bg-[var(--dev-accent)] text-sm font-extrabold text-white shadow-[3px_3px_0_var(--dev-ink)]">
                  {index + 1}
                </span>
                <p className="pt-1.5 text-sm font-semibold leading-snug text-[var(--dev-ink)] sm:text-base">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
