import { useState } from "react"
import Beams from "./Beams.jsx"

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"]

function RisingChart({ id, label, line, fill }) {
  return (
    <div className="mt-2 flex min-h-24 flex-1 flex-col justify-end">
      {/* SAMPLE SHAPE: illustrative rising line, not measured results. No per-day values were supplied. */}
      <svg viewBox="0 0 280 88" className="h-full max-h-28 w-full" role="img" aria-label={label}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C6F432" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C6F432" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="chart-fill" d={fill} fill={`url(#${id})`} />
        <path
          className="chart-line"
          d={line}
          fill="none"
          stroke="#C6F432"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength="1"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] font-medium tracking-[0.14em] text-muted">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  )
}

function ShopperWallet() {
  return (
    <article className="card card-glass lift flex h-full flex-col p-4">
      <div className="card-wash" />
      <div className="relative flex h-full flex-col">
        <h2 className="text-[13px] font-medium text-white/85">Shopper wallet</h2>
        {/* SAMPLE DATA: illustrative product UI, not a customer result.
            Supplied sample: "Sample member", "1,240 points", "Gold member", "$10 reward ready". */}
        <p className="mt-4 text-sm text-muted">Sample member</p>
        <p className="mt-2 text-[2.35rem] font-medium leading-none tracking-tight text-white">
          1,240 <span className="text-base font-normal text-muted">points</span>
        </p>
        <RisingChart
          id="points-fill"
          label="Sample points trend rising through the week"
          line="M6 70 C 36 68, 52 58, 70 60 C 96 63, 112 48, 136 50 C 162 52, 178 40, 204 34 C 228 28, 248 18, 274 12"
          fill="M6 70 C 36 68, 52 58, 70 60 C 96 63, 112 48, 136 50 C 162 52, 178 40, 204 34 C 228 28, 248 18, 274 12 V 88 H 6 Z"
        />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-semibold text-midnight">Gold member</span>
          <p className="text-sm text-white">$10 reward ready</p>
        </div>
      </div>
    </article>
  )
}

function CampaignCard() {
  const [choice, setChoice] = useState("")

  return (
    <article className="card card-glass lift flex h-full flex-col p-4">
      <div className="card-wash" />
      <div className="relative flex h-full flex-col">
        <h2 className="text-[13px] font-medium text-white/85">AI campaign awaiting approval</h2>
        {/* SAMPLE DATA: illustrative campaign UI, not a live offer and not a customer result. */}
        <p className="mt-4 text-lg leading-snug text-white">Win-back campaign</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Bring back customers who haven't visited in 90&nbsp;days
        </p>
        <RisingChart
          id="winback-fill"
          label="Sample win-back trend rising through the week"
          line="M6 74 C 32 72, 48 62, 64 64 C 88 68, 104 56, 128 52 C 154 48, 170 58, 194 42 C 216 28, 240 22, 274 10"
          fill="M6 74 C 32 72, 48 62, 64 64 C 88 68, 104 56, 128 52 C 154 48, 170 58, 194 42 C 216 28, 240 22, 274 10 V 88 H 6 Z"
        />
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            className={`btn px-4 btn-lime ${choice === "approve" ? "ring-2 ring-white/50" : ""}`}
            aria-pressed={choice === "approve"}
            onClick={() => setChoice(choice === "approve" ? "" : "approve")}
          >
            Approve
          </button>
          <button
            type="button"
            className={`btn btn-ghost px-4 ${choice === "edit" ? "border-lime text-lime" : ""}`}
            aria-pressed={choice === "edit"}
            onClick={() => setChoice(choice === "edit" ? "" : "edit")}
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  )
}

function BrandedApp() {
  return (
    <article className="card card-glass lift flex h-full flex-col p-4">
      <div className="card-wash" />
      <div className="relative flex h-full flex-col">
        <h2 className="text-[13px] font-medium text-white/85">Your branded app</h2>
        {/* SAMPLE DATA: "Your Store" phone UI. Points and reward reuse the supplied wallet sample.
            No referral code was supplied — the code field reads SAMPLE, not a real code. */}
        <div className="mx-auto mt-3 w-[168px] rounded-[1.5rem] border border-white/15 bg-midnight p-1.5 shadow-[0_20px_40px_-24px_rgb(0_0_0_/_0.8)]">
          <div className="rounded-[1.15rem] border border-white/8 bg-[#101011] px-3 pb-3 pt-2.5">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-lg bg-lime text-[11px] font-bold text-midnight"
              >
                Y
              </span>
              <p className="text-sm font-medium text-white">Your Store</p>
            </div>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Points balance</p>
            <p className="mt-1 text-2xl font-medium leading-none tracking-tight text-white">1,240</p>
            <div className="mt-2 rounded-xl border border-white/8 bg-white/4 px-2.5 py-1.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Rewards</p>
              <p className="mt-1 text-xs text-white">$10 reward ready</p>
            </div>
            <div className="mt-1.5 rounded-xl border border-white/8 bg-white/4 px-2.5 py-1.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted">Referral code</p>
              <p className="mt-1 text-xs font-medium tracking-[0.14em] text-lime">SAMPLE</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Hero() {
  return (
    <section className="hero-stage relative overflow-hidden pb-6 pt-6 sm:pb-8 sm:pt-7 lg:pb-7 lg:pt-6">
      <Beams />
      <div className="shell relative z-10">
        <div className="hero-rise mx-auto max-w-4xl text-center">
          <h1 className="display text-white">
            <span className="block">Turn one-time shoppers</span>
            <span className="mt-1 block">
              into <span className="italic text-lime">regulars.</span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-muted">
            A branded loyalty app for your store — points, rewards, and AI-powered offers that bring customers back. On
            Shopify and Square, in an app with your name on it.
          </p>
        </div>

        <div className="hero-rise relative z-10 mt-5 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.12s" }}>
          {/* PLACEHOLDER: pilot booking URL was not supplied. */}
          <a href="#get-started" className="btn btn-lime">
            Book your free pilot
          </a>
          <a href="#how-it-works" className="btn btn-ghost">
            See how it works
          </a>
        </div>

        <p
          className="hero-rise mx-auto mt-3 max-w-2xl text-balance text-center text-sm leading-relaxed text-[#A1A1AA]"
          style={{ animationDelay: "0.16s" }}
        >
          Free pilot for independent retailers · You approve every offer before it goes live
        </p>
        <p className="hero-rise mt-2 text-center text-sm text-[#A1A1AA]" style={{ animationDelay: "0.18s" }}>
          Works with Shopify and Square
        </p>

        <div className="hero-rise mt-5 grid items-stretch gap-4 lg:mt-6 lg:grid-cols-3" style={{ animationDelay: "0.22s" }}>
          <div className="hero-slot-left">
            <ShopperWallet />
          </div>
          <div className="hero-slot-center">
            <CampaignCard />
          </div>
          <div className="hero-slot-right">
            <BrandedApp />
          </div>
        </div>
      </div>
    </section>
  )
}
