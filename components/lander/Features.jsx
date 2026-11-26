"use client"
import Reveal from "@/components/lander/Reveal.jsx"

const CAMPAIGNS = [
  {
    title: "Make rewards easy to find",
    line: "Keep points, offers, and member status visible in a wallet card, app, or coupon book.",
  },
  {
    title: "Stay useful between visits",
    line: "Reach members through SMS and email with offers that give them a reason to return.",
  },
  {
    title: "Keep the brand in their pocket",
    line: "Put your name, icon, and rewards experience on customers’ phones.",
  },
  {
    title: "Connect online and in-store",
    line: "For Shopify brands, carry loyalty from the storefront into POS and checkout.",
  },
  {
    title: "Give staff a clear experience",
    line: "Build around the POS workflow your team already understands.",
  },
  {
    title: "Own the customer relationship",
    line: "Create a direct, branded channel instead of depending only on rented reach.",
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">The connected experience</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl tracking-tight text-white sm:text-5xl">One relationship. Every touchpoint.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGNS.map((item, index) => (
            <Reveal key={item.title} delay={index * 50} className="h-full">
              <article className="card lift h-full p-5">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.line}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
