import { useEffect, useState } from "react"
import Logo from "./Logo.jsx"

const LINKS = [
  { href: "#features", id: "features", label: "Features" },
  { href: "#how-it-works", id: "how-it-works", label: "How it works" },
  { href: "#pricing", id: "pricing", label: "Pricing" },
  { href: "#faq", id: "faq", label: "FAQ" },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")

  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + 96
      const how = document.getElementById("how-it-works")?.offsetTop ?? Infinity
      const features = document.getElementById("features")?.offsetTop ?? Infinity
      const pricing = document.getElementById("pricing")?.offsetTop ?? Infinity
      const faq = document.getElementById("faq")?.offsetTop ?? Infinity

      if (marker >= faq) setActive("faq")
      else if (marker >= pricing) setActive("pricing")
      else if (marker >= features) setActive("features")
      else if (marker >= how) setActive("how-it-works")
      else setActive("")
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

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-midnight/75 backdrop-blur-xl">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "true" : undefined}
              className={`inline-flex items-center gap-2 text-sm transition-colors ${
                active === link.id ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {active === link.id ? (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-lime shadow-[0_0_8px_#c6f432]" />
              ) : null}
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {/* PLACEHOLDER: sign-in URL was not supplied. */}
          <a href="#get-started" className="text-sm text-white/85 hover:text-white">
            Sign in
          </a>
          {/* PLACEHOLDER: pilot booking URL was not supplied. */}
          <a href="#get-started" className="btn btn-lime px-4">
            Book a free pilot
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-white/15 text-white lg:hidden"
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
        <div id="mobile-nav" className="border-t border-white/8 bg-midnight/95 backdrop-blur-xl lg:hidden">
          <nav className="shell flex flex-col py-3" aria-label="Mobile">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={close}
                className="border-b border-white/8 py-3 text-base text-white/90"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col items-start gap-3 pt-4 pb-2">
              {/* PLACEHOLDER: sign-in URL was not supplied. */}
              <a href="#get-started" onClick={close} className="px-1 py-2 text-sm text-white/85">
                Sign in
              </a>
              {/* PLACEHOLDER: pilot booking URL was not supplied. */}
              <a href="#get-started" onClick={close} className="btn btn-lime">
                Book a free pilot
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
