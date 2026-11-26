"use client"

import Reveal from "@/components/lander/Reveal.jsx"

const STORIES = [
  {
    image: "/lander/reward-at-checkout.webp",
    label: "Fashion + specialty retail",
    title: "Make the reward feel like part of the brand.",
    text: "A wallet card, native app, and thoughtful follow-up turn a checkout moment into an ongoing customer relationship.",
    chips: ["Digital wallet", "Branded app", "Member rewards"],
    position: "center",
  },
  {
    image: "/lander/team-at-pos.webp",
    label: "Cafés + quick service",
    title: "Keep loyalty simple for the team behind the counter.",
    text: "Connect the customer experience to the tools staff already use, then bring guests back with relevant offers.",
    chips: ["POS-friendly", "SMS + email", "Repeat visits"],
    position: "center",
  },
]

export default function MerchantStories() {
  return (
    <section id="experience" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">Built for real relationships</p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl tracking-tight text-white sm:text-6xl">Good for the brand. Better for the customer.</h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:justify-self-end">
              Devotly gives independent brands the loyalty experience customers expect from bigger names—without losing the human side of the business.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {STORIES.map((story, index) => (
            <Reveal key={story.title} delay={index * 90}>
              <article className="group overflow-hidden rounded-2xl border border-white/10 bg-card">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" style={{ objectPosition: story.position }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">{story.label}</span>
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="font-serif text-3xl leading-tight text-white">{story.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{story.text}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {story.chips.map((chip) => <span key={chip} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65">{chip}</span>)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
