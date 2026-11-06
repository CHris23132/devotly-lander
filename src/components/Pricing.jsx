import Reveal from "./Reveal.jsx"

// PLACEHOLDER: do not publish a price. The page must keep showing "$— /mo".
// Current list is $399/mo. The main tier is under review toward $199/mo.
// Confirm the real price before publishing.
// PLACEHOLDER: tier packaging was not supplied. Each list repeats known product capabilities only.
const CAPABILITIES = [
  "Branded native app",
  "Points, rewards, referrals, and VIP tiers",
  "Shopify and Square, online and in-store",
  "AI offers you approve before they go live",
]

const TIERS = ["Starter", "Pro", "Team"]

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">Pricing</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier, index) => (
            <Reveal key={tier} delay={index * 80}>
              <article className="card lift flex h-full flex-col p-6">
                <h3 className="font-serif text-3xl text-white">{tier}</h3>
                <p className="mt-5 flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-medium tracking-tight">$—</span>
                  <span className="text-sm text-muted">/mo</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/90">
                  {CAPABILITIES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* PLACEHOLDER: per-tier checkout URL was not supplied. */}
                <a href="#get-started" className="btn btn-lime mt-8 w-full">
                  Book your free pilot
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
