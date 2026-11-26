"use client"

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { RetentionCanvas } from "@/components/lander/viz/RetentionScene"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}

function useAnimatedNumber(value: number, decimals = 0) {
  const [display, setDisplay] = useState(value)
  const current = useRef(value)
  const frame = useRef(0)

  useEffect(() => {
    const startValue = current.current
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 720)
      const eased = 1 - Math.pow(1 - progress, 4)
      const next = startValue + (value - startValue) * eased
      current.current = next
      setDisplay(next)
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value])

  return display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function Sparkline({ variant = 0 }: { variant?: number }) {
  const paths = [
    "M1 30 C9 28 13 25 20 26 S31 18 38 20 S49 12 57 14 S68 5 79 7",
    "M1 31 C8 30 12 26 20 27 S30 22 38 23 S48 14 56 17 S67 9 79 5",
    "M1 30 C8 26 13 29 20 24 S31 20 38 21 S49 15 56 13 S68 10 79 4",
  ]

  return (
    <svg viewBox="0 0 80 36" className="metric-sparkline" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-fill-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563EB" stopOpacity=".25" />
          <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${paths[variant]} L79 36 L1 36 Z`} fill={`url(#spark-fill-${variant})`} />
      <path d={paths[variant]} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delta,
  variant,
  active,
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  delta: string
  variant: number
  active: boolean
}) {
  const animated = useAnimatedNumber(value, decimals)

  return (
    <div className={`retention-metric-card retention-metric-card-${variant} ${active ? "is-updating" : ""}`}>
      <div className="retention-metric-topline">
        <span>{label}</span>
        <span className="retention-metric-delta">{delta}</span>
      </div>
      <div className="retention-metric-content">
        <p className="retention-metric-value" key={`${Math.round(value * 10)}-${active}`}>
          {prefix}{animated}{suffix}
        </p>
        <Sparkline variant={variant} />
      </div>
    </div>
  )
}

function StaticFallback() {
  return (
    <div className="retention-static-fallback" role="img" aria-label="Customer retention loop around an online store">
      <div className="static-loop static-loop-out" />
      <div className="static-loop static-loop-back" />
      <div className="static-store">
        <span>YOUR STORE</span>
        <div className="static-store-window" />
      </div>
      <i className="static-customer static-customer-a" />
      <i className="static-customer static-customer-b" />
      <i className="static-customer static-customer-c" />
      <div className="static-offer"><span>PERSONALIZED OFFER</span>Your reward is waiting</div>
    </div>
  )
}

export default function RetentionViz() {
  const reduced = usePrefersReducedMotion()
  const [ltv, setLtv] = useState(68)
  const [repeatRate, setRepeatRate] = useState(24.6)
  const [revenue, setRevenue] = useState(12480)
  const [active, setActive] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastUpdate = useRef(0)

  const onWinBack = useCallback((amount: number) => {
    const now = performance.now()
    if (now - lastUpdate.current < 1600) return
    lastUpdate.current = now
    setLtv((value) => (value >= 94 ? 68 : value + amount * 0.025))
    setRepeatRate((value) => (value >= 31.8 ? 24.6 : value + 0.18))
    setRevenue((value) => (value >= 14200 ? 12480 : value + amount))
    setActive(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setActive(false), 720)
  }, [])

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current)
  }, [])

  return (
    <div className="retention-viz" aria-label="Animated customer growth loop">
      <div className="retention-viz-stage">
        {reduced ? <StaticFallback /> : <RetentionCanvas onWinBack={onWinBack} />}
      </div>

      {!reduced ? (
        <svg className="retention-flow-svg" viewBox="0 0 800 600" aria-hidden="true">
          <defs>
            <filter id="token-shadow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0b1f3b" floodOpacity=".16" />
            </filter>
            <linearGradient id="return-line-blue" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2563EB" stopOpacity=".38" />
              <stop offset=".58" stopColor="#1764FF" stopOpacity=".95" />
              <stop offset="1" stopColor="#2563EB" stopOpacity=".42" />
            </linearGradient>
            <linearGradient id="return-line-orange" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF7900" stopOpacity=".4" />
              <stop offset=".58" stopColor="#F04A00" stopOpacity=".94" />
              <stop offset="1" stopColor="#FF7900" stopOpacity=".42" />
            </linearGradient>
            <marker id="arrow-neutral" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#8f9b93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="arrow-out" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#94A0B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="arrow-return-blue" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="arrow-return-orange" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#F04A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          <path id="flow-in-a" className="flow-line flow-line-neutral" markerEnd="url(#arrow-neutral)" d="M8 188 C126 188 190 218 302 274" />
          <path id="flow-in-b" className="flow-line flow-line-neutral" markerEnd="url(#arrow-neutral)" d="M8 292 C132 292 206 292 302 292" />
          <path id="flow-in-c" className="flow-line flow-line-neutral" markerEnd="url(#arrow-neutral)" d="M8 402 C132 400 206 354 302 314" />
          <path id="flow-out-a" className="flow-line flow-line-out" markerEnd="url(#arrow-out)" d="M497 270 C575 218 676 184 792 180" />
          <path id="flow-out-b" className="flow-line flow-line-out" markerEnd="url(#arrow-out)" d="M497 292 C600 292 690 292 792 292" />
          <path id="flow-out-c" className="flow-line flow-line-out" markerEnd="url(#arrow-out)" d="M497 314 C582 368 676 420 792 430" />
          <path id="flow-return-a" className="flow-line flow-line-return flow-line-return-orange" markerEnd="url(#arrow-return-orange)" d="M780 36 C628 16 458 54 350 252" />
          <path id="flow-return-c" className="flow-line flow-line-return flow-line-return-blue flow-line-return-soft" markerEnd="url(#arrow-return-blue)" d="M780 88 C650 66 505 98 360 266" />
          <path id="flow-return-e" className="flow-line flow-line-return flow-line-return-blue flow-line-return-push" markerEnd="url(#arrow-return-blue)" d="M780 140 C658 120 528 146 370 280" />
          <path id="flow-return-d" className="flow-line flow-line-return flow-line-return-blue flow-line-return-soft" markerEnd="url(#arrow-return-blue)" d="M780 482 C654 510 510 474 370 320" />
          <path id="flow-return-b" className="flow-line flow-line-return flow-line-return-orange" markerEnd="url(#arrow-return-orange)" d="M780 550 C624 582 462 536 354 336" />

          {[
            { x: 24, y: 160, width: 48, text: "SEO", kind: "incoming", mobileShift: 0 },
            { x: 24, y: 268, width: 78, text: "Paid ads", kind: "incoming", mobileShift: 0 },
            { x: 24, y: 382, width: 124, text: "Organic content", kind: "incoming", mobileShift: 0 },
            { x: 526, y: 194, width: 132, text: "Happy customer  →", kind: "outbound", mobileShift: 88 },
            { x: 532, y: 278, width: 162, text: "Very happy customer  →", kind: "outbound", mobileShift: 74 },
            { x: 532, y: 394, width: 210, text: "Likely to recommend a friend  →", kind: "outbound", mobileShift: 52 },
            { x: 494, y: 25, width: 142, text: "Win-back campaign", kind: "campaign-orange", mobileShift: 0 },
            { x: 472, y: 548, width: 140, text: "Referral campaign", kind: "campaign-orange", mobileShift: 0 },
            { x: 552, y: 75, width: 136, text: "In-app only offers", kind: "campaign-blue", mobileShift: 0 },
            { x: 584, y: 126, width: 174, text: "In-app push notifications", kind: "campaign-blue", mobileShift: 0 },
            { x: 564, y: 474, width: 118, text: "Custom upsells", kind: "campaign-blue", mobileShift: 0 },
          ].map(({ x, y, width, text: label, kind, mobileShift }) => (
            <g key={label} transform={`translate(${x} ${y})`}>
              <g
                className={`flow-path-label flow-path-label-${kind}`}
                style={{ "--mobile-label-shift": `${mobileShift}px` } as CSSProperties}
              >
                <rect width={width} height="26" rx="13" />
                <text x={width / 2} y="17" textAnchor="middle">{label}</text>
              </g>
            </g>
          ))}

          {[
            ["flow-in-a", "0s"], ["flow-in-b", "-2.1s"], ["flow-in-c", "-4.3s"],
          ].map(([path, begin]) => (
            <circle key={`${path}-${begin}`} r="5.5" className="flow-token flow-token-neutral" filter="url(#token-shadow)">
              <animateMotion dur="6.4s" begin={begin} repeatCount="indefinite"><mpath href={`#${path}`} /></animateMotion>
            </circle>
          ))}
          {[
            ["flow-out-a", "-1.2s"], ["flow-out-b", "-3.4s"], ["flow-out-c", "-5.5s"],
          ].map(([path, begin]) => (
            <circle key={`${path}-${begin}`} r="5.5" className="flow-token flow-token-out" filter="url(#token-shadow)">
              <animateMotion dur="6.4s" begin={begin} repeatCount="indefinite"><mpath href={`#${path}`} /></animateMotion>
            </circle>
          ))}
          {[
            ["flow-return-a", "-1s", "orange"],
            ["flow-return-b", "-4.1s", "orange"],
            ["flow-return-c", "-2.6s", "blue"],
            ["flow-return-d", "-5.2s", "blue"],
            ["flow-return-e", "-3.4s", "blue"],
          ].map(([path, begin, tone]) => (
            <g key={`${path}-${begin}`} className={`flow-dollar flow-dollar-${tone}`} filter="url(#token-shadow)">
              <circle r="18" />
              <text x="0" y="7" textAnchor="middle">$</text>
              <animateMotion dur="6.8s" begin={begin} repeatCount="indefinite"><mpath href={`#${path}`} /></animateMotion>
            </g>
          ))}
        </svg>
      ) : null}

      {!reduced ? (
        <div className="friendly-store-dom" role="img" aria-label="A clean modern online storefront">
          <div className="store-dom-roof" />
          <div className="store-dom-sign">
            <strong>Your Store</strong>
            <em><i /> Open</em>
          </div>
          <div className="store-dom-awning" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="store-dom-showcase store-type-modern">
            <div className="store-showcase-lights" aria-hidden="true"><i /><i /><i /></div>
            <div className="store-frosted-doors" aria-hidden="true">
              <span className="store-frosted-door store-frosted-door-left"><i /></span>
              <span className="store-frosted-door store-frosted-door-right"><i /></span>
            </div>
            <span className="store-door-threshold" aria-hidden="true" />
          </div>
          <div className="store-dom-base" aria-hidden="true" />
        </div>
      ) : null}

      <div className="retention-metrics" aria-label="Illustrative retention metrics">
        <MetricCard label="Repeat purchase rate" value={repeatRate} suffix="%" decimals={1} delta="+8.1%" variant={0} active={active} />
        <MetricCard label="Customer lifetime value" value={ltv} prefix="$" delta="+12.4%" variant={1} active={active} />
        <MetricCard label="Total revenue" value={revenue} prefix="$" delta="+18.7%" variant={2} active={active} />
      </div>

      <p className="retention-demo-note">Illustrative metrics</p>
    </div>
  )
}
