import Reveal from "./Reveal.jsx"

const CAMPAIGNS = [
  {
    title: "Bring customers back",
    line: "Win back lost shoppers and wake dormant members.",
  },
  {
    title: "Make more money per order",
    line: "Grow the basket, swap discounts for points.",
  },
  {
    title: "Stop losing carts",
    line: "Recover abandoned checkouts.",
  },
  {
    title: "Get customers to bring friends",
    line: "Referrals and reviews.",
  },
  {
    title: "Own your audience",
    line: "Grow your own list, not rented reach.",
  },
  {
    title: "Build recurring revenue",
    line: "Turn repeat buyers into subscribers.",
  },
  {
    title: "Make loyalty pay for itself",
    line: "Tune tiers so rewards cost less than they earn.",
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">What it does</h2>
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
