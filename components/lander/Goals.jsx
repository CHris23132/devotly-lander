"use client"

import Reveal from "@/components/lander/Reveal.jsx"

const GOALS = [
  {
    title: "Bring customers back",
    label: "Retention / win-back",
    body: "Reach dormant shoppers with personalized offers across the channels your guardrails allow.",
  },
  {
    title: "Convert first-time buyers",
    label: "Conversion / welcome",
    body: "Turn visitors into buyers with a personalized welcome offer tied to your loyalty setup.",
  },
  {
    title: "Make more per order",
    label: "AOV / flash deals",
    body: "Lift order value with personalized flash-sale and checkout surfaces — still inside discount caps.",
  },
]

export default function Goals() {
  return (
    <section id="goals" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <p className="kicker">Campaign goals</p>
          <h2 className="section-title mt-4 max-w-3xl">Campaigns come from audit findings — not a blank canvas.</h2>
          <p className="lede mt-4 max-w-2xl">
            For every goal family, the Operator can create personalized offers, reach allowed channels, and attach
            rewards based on your loyalty program configuration.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {GOALS.map((goal, index) => (
            <Reveal key={goal.title} delay={index * 80} className="brutal-card flex flex-col p-5 sm:p-6">
              <span className="pill w-fit">{goal.label}</span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.035em]">{goal.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--dev-muted)]">{goal.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="brutal-card mt-6 bg-[var(--dev-mint)] p-5 sm:p-6">
          <h3 className="text-lg font-extrabold tracking-[-0.03em]">What merchants use day to day</h3>
          <ul className="mt-4 grid gap-3 text-sm text-[var(--dev-ink)] sm:grid-cols-2">
            <li>
              <strong>Overview</strong> — members, campaign value, referrals, welcome offer, points, opportunity
            </li>
            <li>
              <strong>Campaign Manager</strong> — live campaigns, audits, guardrails (AI audit → create/approve)
            </li>
            <li>
              <strong>Rewards Program</strong> — member CRM, points, referrals, welcome offer, message templates
            </li>
            <li>
              <strong>Mobile App + Settings</strong> — DFY app status, brand/storefront appearance, delivery settings
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
