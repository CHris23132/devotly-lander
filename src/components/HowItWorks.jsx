import Reveal from "./Reveal.jsx"

const STEPS = [
  {
    n: "01",
    title: "Connect your store",
    line: "Shopify or Square, your data stays yours.",
  },
  {
    n: "02",
    title: "Launch your branded app",
    line: "We build it from your brand; you own the listing and submit it under your own developer account.",
  },
  {
    n: "03",
    title: "Approve the offers",
    line: "AI finds the win-backs and upsells; nothing goes live until you say yes.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">How it works</h2>
        </Reveal>
        <ol className="mt-12 grid list-none gap-10 p-0 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.n}>
              <Reveal delay={index * 80}>
                <div className="border-t border-white/10 pt-6">
                  <p className="font-serif text-4xl italic text-lime">{step.n}</p>
                  <h3 className="mt-4 text-xl text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.line}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
