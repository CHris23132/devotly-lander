"use client"

import dynamic from "next/dynamic"
import TrustedBy from "@/components/lander/TrustedBy.jsx"

const RetentionViz = dynamic(() => import("@/components/lander/viz/RetentionViz"), {
  ssr: false,
  loading: () => (
    <div className="retention-viz" aria-label="Loading customer growth visualization">
      <div className="retention-viz-loading">
        <span className="retention-loader" aria-hidden="true" />
      </div>
    </div>
  ),
})

export default function Hero() {
  return (
    <>
      <section className="hero-saas" aria-labelledby="hero-title">
        <div className="hero-saas-orb hero-saas-orb-a" aria-hidden="true" />
        <div className="hero-saas-orb hero-saas-orb-b" aria-hidden="true" />

        <div className="shell hero-saas-shell">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-mark" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Intelligent customer retention
            </div>

            <h1 id="hero-title" className="hero-headline">
              <span>
                Win back customers.
                <svg className="hero-sparkles" viewBox="0 0 56 48" aria-hidden="true">
                  <path d="M10 29 6 11" />
                  <path d="m25 29 8-19" />
                  <path d="m39 36 12-8" />
                </svg>
              </span>
              <span className="hero-headline-accent">
                <em className="hero-increase">Increase</em> <span>repeat purchase rate.</span>
              </span>
            </h1>

            <p className="hero-lede">
              Turn one-time shoppers into lifelong customers with intelligent, automated retention campaigns.
            </p>

            <div className="hero-actions">
              <a href="#get-started" className="hero-primary-cta">
                Install on Shopify
                <span aria-hidden="true">→</span>
              </a>
              <a href="#how-it-works" className="hero-text-link">
                <span className="hero-play-icon" aria-hidden="true">▶</span>
                See how it works
              </a>
            </div>

            <div className="hero-trust-line" aria-label="Product benefits">
              <span><i aria-hidden="true" /> Personalized campaigns</span>
              <span><i aria-hidden="true" /> You stay in control</span>
            </div>
          </div>

          <div className="hero-visual">
            <RetentionViz />
          </div>
        </div>
      </section>
      <TrustedBy />
    </>
  )
}
