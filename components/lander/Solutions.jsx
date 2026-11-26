"use client"

import { useState } from "react"
import Reveal from "@/components/lander/Reveal.jsx"

const SOLUTIONS = [
  {
    id: "shopify",
    eyebrow: "POS + online store",
    name: "Shopify",
    headline: "One loyalty program from storefront to checkout.",
    description:
      "Connect online and in-store purchases, then keep the relationship going through the channels your customers already use.",
    accent: "Full commerce stack",
    features: [
      { icon: "message", title: "SMS + email coupon book", text: "Send timely offers and keep every available reward easy to find." },
      { icon: "wallet", title: "Apple + Google Wallet", text: "Put a branded digital rewards card one tap away—no app download required." },
      { icon: "points", title: "Member points + rewards", text: "Reward purchases across online and in-store journeys." },
      { icon: "phone", title: "Native iOS + Android app", text: "Give your best customers a branded home for rewards, offers, and referrals." },
      { icon: "plugin", title: "Native Shopify plugin", text: "Bring member status and rewards into the Shopify experience." },
      { icon: "checkout", title: "Checkout upsell extension", text: "Present relevant add-ons and reward moments before the order is complete." },
    ],
  },
  {
    id: "square",
    eyebrow: "POS",
    name: "Square",
    headline: "Turn every counter visit into the next one.",
    description:
      "Layer a branded loyalty experience onto your Square workflow without asking staff to manage a disconnected program.",
    accent: "In-store + mobile",
    features: [
      { icon: "message", title: "SMS + email coupon book", text: "Bring guests back with a clear, mobile-friendly place for every offer." },
      { icon: "wallet", title: "Apple + Google Wallet", text: "Keep a digital reward card beside the cards customers already carry." },
      { icon: "points", title: "Member points + rewards", text: "Make each purchase count toward something worth returning for." },
      { icon: "phone", title: "Native iOS + Android app", text: "Create a lasting branded channel beyond the register." },
    ],
  },
  {
    id: "other",
    eyebrow: "No online store required",
    name: "Any other POS",
    headline: "Modern loyalty without replacing your register.",
    description:
      "Start with simple customer-facing tools that work around the POS you already use—ideal for local and service-based businesses.",
    accent: "Flexible essentials",
    features: [
      { icon: "message", title: "SMS + email coupon book", text: "Give customers a single link for current offers and timely reminders." },
      { icon: "wallet", title: "Apple + Google Wallet", text: "Make the rewards card digital, branded, and always close at hand." },
      { icon: "points", title: "Member points + rewards", text: "Build a repeat-visit habit with a program designed around your business." },
    ],
  },
]

function FeatureIcon({ type }) {
  const paths = {
    message: <><path d="M5 7.5h14v9H9l-4 3v-12Z" /><path d="M8.5 11h7M8.5 14h4" /></>,
    wallet: <><rect x="4" y="6" width="16" height="12" rx="3" /><path d="M15 10h5v4h-5a2 2 0 0 1 0-4Z" /></>,
    points: <><circle cx="12" cy="12" r="7" /><path d="m9.5 12 1.7 1.7 3.6-4" /></>,
    phone: <><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M10.5 6h3M11 18h2" /></>,
    plugin: <><path d="M8 4v4H4v8h4v4h8v-4h4V8h-4V4H8Z" /><path d="M10 11h4M12 9v4" /></>,
    checkout: <><path d="M4 5h2l2 10h8l2-7H7" /><circle cx="10" cy="19" r="1" /><circle cx="16" cy="19" r="1" /><path d="M11 11h4M13 9v4" /></>,
  }

  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-lime/20 bg-lime/8 text-lime">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[type]}
      </svg>
    </span>
  )
}

function JourneyPreview({ solution }) {
  return (
    <div className="solution-preview relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f100e] p-5 sm:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgb(198_244_50_/_0.16),transparent_28%)]" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">{solution.accent}</p>
          <p className="mt-2 text-sm text-white/55">A connected customer journey</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70">{solution.name}</span>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="text-xs text-white/45">01 · JOIN</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white/8 text-lime">+</span>
            <div>
              <p className="text-sm font-medium text-white">Customer joins</p>
              <p className="mt-1 text-xs text-white/45">At checkout or by link</p>
            </div>
          </div>
        </div>
        <span className="hidden h-px w-5 bg-lime/35 sm:block" />
        <div className="rounded-2xl border border-lime/25 bg-lime/[0.07] p-4">
          <span className="text-xs text-lime/70">02 · REWARD</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-lime text-midnight">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 12 4 4 8-8" /></svg>
            </span>
            <div>
              <p className="text-sm font-medium text-white">Points update</p>
              <p className="mt-1 text-xs text-white/45">Member progress stays clear</p>
            </div>
          </div>
        </div>
        <span className="hidden h-px w-5 bg-lime/35 sm:block" />
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <span className="text-xs text-white/45">03 · RETURN</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white/8 text-lime">↻</span>
            <div>
              <p className="text-sm font-medium text-white">Offer arrives</p>
              <p className="mt-1 text-xs text-white/45">SMS, email, wallet or app</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {solution.features.map((feature) => (
          <span key={feature.title} className="rounded-full border border-white/8 bg-black/25 px-3 py-1.5 text-xs text-white/60">
            {feature.title.replace("Native ", "")}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Solutions() {
  const [selected, setSelected] = useState("shopify")
  const solution = SOLUTIONS.find((item) => item.id === selected) ?? SOLUTIONS[0]

  return (
    <section id="solutions" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">Solutions by setup</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-6xl">Start with how you sell.</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Your loyalty system should fit your commerce stack—not force you into a new one. Choose your setup to see the right path.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2 lg:grid-cols-3" role="tablist" aria-label="Commerce platform">
            {SOLUTIONS.map((item) => {
              const isSelected = selected === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="solution-panel"
                  className={`rounded-xl px-4 py-4 text-left transition-colors ${isSelected ? "bg-lime text-midnight" : "text-white hover:bg-white/[0.05]"}`}
                  onClick={() => setSelected(item.id)}
                >
                  <span className={`block text-xs font-semibold uppercase tracking-[0.14em] ${isSelected ? "text-midnight/60" : "text-white/40"}`}>{item.eyebrow}</span>
                  <span className="mt-1.5 block text-base font-semibold">{item.name}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div id="solution-panel" role="tabpanel" className="mt-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-lime">{solution.eyebrow}</p>
              <h3 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-white sm:text-5xl">{solution.headline}</h3>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{solution.description}</p>
              <a href="#get-started" className="btn btn-lime mt-7">Build my loyalty setup</a>
            </div>
            <JourneyPreview solution={solution} />
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {solution.features.map((feature) => (
              <article key={feature.title} className="card lift flex gap-4 p-5">
                <FeatureIcon type={feature.icon} />
                <div>
                  <h4 className="text-base font-semibold text-white">{feature.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
