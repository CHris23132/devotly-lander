import Reveal from "./Reveal.jsx"

const POINTS = [
  "A native app with your icon, name, and listing.",
  "Wallet, points, referrals, and VIP tiers inside.",
  "Your customers, your brand, your data.",
]

export default function YourApp() {
  return (
    <section id="your-app" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <h2 className="max-w-xl font-serif text-4xl tracking-tight text-white sm:text-5xl">Your app, your brand</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {POINTS.map((point, index) => (
            <Reveal key={point} delay={index * 80}>
              <article className="card lift h-full p-6">
                <p className="text-lg leading-snug text-white">{point}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
