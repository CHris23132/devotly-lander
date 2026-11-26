"use client"
import { useState } from "react"
import Reveal from "@/components/lander/Reveal.jsx"

const QUESTIONS = [
  {
    q: "Do I need my own Apple Developer account?",
    a: "Yes — you own the listing; we build it, you submit it.",
  },
  {
    q: "Does it work with my POS?",
    a: "Yes. Devotly has dedicated paths for Shopify POS + online store, Square POS, and businesses using another POS without an online store.",
  },
  {
    q: "Do offers go live automatically?",
    a: "No — you approve every offer first.",
  },
  {
    q: "Do customers need to download an app?",
    a: "Not necessarily. You can start with SMS, email, and a digital rewards card for Apple or Google Wallet. Native iOS and Android apps are available for Shopify and Square packages.",
  },
  {
    q: "Is my customer data shared or sold?",
    a: "No — your data is processed to run your program, never sold.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="border-t border-white/8 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">FAQ</h2>
        </Reveal>
        <div className="mt-10 max-w-3xl border-t border-white/10">
          {QUESTIONS.map((item, index) => {
            const isOpen = open === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`
            return (
              <div key={item.q} className="border-b border-white/10">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-white sm:text-lg"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    {item.q}
                    <span aria-hidden="true" className="font-serif text-2xl leading-none text-lime">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <p id={panelId} role="region" aria-labelledby={buttonId} className="max-w-2xl pb-5 text-sm leading-relaxed text-muted sm:text-base">
                    {item.a}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
