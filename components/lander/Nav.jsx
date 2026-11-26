"use client"

import { useEffect, useState } from "react"
import Logo from "@/components/lander/Logo.jsx"

const LINKS = [
  { href: "#pillars", id: "pillars", label: "Product" },
  { href: "#how-it-works", id: "how-it-works", label: "How it works" },
  { href: "#goals", id: "goals", label: "Campaigns" },
  { href: "#onboarding", id: "onboarding", label: "Setup" },
  { href: "#native-app", id: "native-app", label: "Native app" },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + 96
      const ids = LINKS.map((l) => l.id)
      let current = ""
      for (const id of ids) {
        const top = document.getElementById(id)?.offsetTop ?? Infinity
        if (marker >= top) current = id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--dev-ink)] bg-[rgb(240_247_255_/_92%)] backdrop-blur-xl">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="shell flex h-[4.75rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "true" : undefined}
              className={`rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                active === link.id
                  ? "bg-[var(--dev-mint)] text-[var(--dev-ink)]"
                  : "text-[var(--dev-muted)] hover:text-[var(--dev-ink)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="/coupon-book" className="text-[13px] font-semibold text-[var(--dev-muted)] hover:text-[var(--dev-ink)]">
            Coupon Book
          </a>
          <a href="#get-started" className="btn btn-primary btn-shopify px-4">
            Install on Shopify
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-[10px] border border-[var(--dev-ink)] bg-white text-[var(--dev-ink)] shadow-[3px_3px_0_var(--dev-ink)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[var(--dev-ink)] bg-[var(--dev-paper)] lg:hidden">
          <nav className="shell flex flex-col py-3" aria-label="Mobile">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--dev-line)] py-3 text-base font-semibold text-[var(--dev-ink)]"
              >
                {link.label}
              </a>
            ))}
            <a href="/coupon-book" onClick={() => setOpen(false)} className="border-b border-[var(--dev-line)] py-3 text-base font-semibold">
              Coupon Book
            </a>
            <a href="#get-started" onClick={() => setOpen(false)} className="btn btn-primary btn-shopify mt-4">
              Install on Shopify
              <span aria-hidden="true">→</span>
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
