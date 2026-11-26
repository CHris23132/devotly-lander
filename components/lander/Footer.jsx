"use client"

import Logo from "@/components/lander/Logo.jsx"

export default function Footer() {
  return (
    <footer className="border-t border-[var(--dev-ink)]">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--dev-muted)]">
            AI Operator for Shopify — retention campaigns, loyalty, and a done-for-you native app.
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-ink)]">Product</h2>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="#pillars">
                Pillars
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="#how-it-works">
                How it works
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="#goals">
                Campaign goals
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="#native-app">
                Native app
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="/coupon-book">
                Coupon Book
              </a>
            </li>
          </ul>
        </div>

        <div id="company">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-ink)]">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="/about">
                About us
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="#top">
                Devotly
              </a>
            </li>
            <li>
              <a className="text-[var(--dev-muted)] hover:text-[var(--dev-ink)]" href="/privacy">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--dev-ink)]">
        <p className="shell py-6 text-sm text-[var(--dev-muted)]">© 2026 Devotly</p>
      </div>
    </footer>
  )
}
