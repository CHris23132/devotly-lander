import type { Metadata } from "next"
import Footer from "@/components/lander/Footer.jsx"
import Nav from "@/components/lander/Nav.jsx"

export const metadata: Metadata = {
  title: "About Us — Devotly",
  description: "Meet the co-founders building Devotly — intelligent customer retention for Shopify.",
}

const FOUNDERS = [
  {
    name: "Duncan Hui",
    role: "Co-Founder & CEO",
    image: "/dh2.png",
    phone: "+1 (647) 548-9736",
    phoneHref: "tel:+16475489736",
    alt: "Duncan Hui, Co-Founder and CEO of Devotly",
  },
  {
    name: "Christopher Walsh",
    role: "Co-Founder & CTO",
    image: "/ce2.png",
    phone: "+1 905 979 8389",
    phoneHref: "tel:+19059798389",
    alt: "Christopher Walsh, Co-Founder and CTO of Devotly",
  },
] as const

export default function AboutPage() {
  return (
    <div id="top" className="lander-page min-h-screen antialiased">
      <Nav />
      <main id="main">
        <section className="border-b border-[var(--dev-ink)] bg-[var(--dev-paper)]">
          <div className="shell py-14 sm:py-16 lg:py-20">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
              Company
            </p>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold tracking-[-0.05em] text-[var(--dev-ink)]">
              About us
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--dev-muted)] sm:text-lg">
              Devotly helps Shopify brands win customers back with intelligent retention — built by operators who care
              about repeat purchase rate, not vanity dashboards.
            </p>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:max-w-3xl">
              {FOUNDERS.map((person) => (
                <li key={person.name}>
                  <div className="overflow-hidden rounded-[14px] border border-[var(--dev-ink)] bg-white shadow-[6px_6px_0_var(--dev-ink)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.image}
                      alt={person.alt}
                      className="aspect-[4/5] w-full object-cover grayscale"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-[var(--dev-ink)]">
                    {person.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--dev-muted)]">{person.role}</p>
                  <a
                    href={person.phoneHref}
                    className="mt-2 inline-block text-sm font-semibold text-[var(--dev-accent)] hover:underline"
                  >
                    {person.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
