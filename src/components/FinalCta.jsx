import Beams from "./Beams.jsx"
import Reveal from "./Reveal.jsx"

export default function FinalCta() {
  return (
    <section id="get-started" className="relative overflow-hidden border-t border-white/8 py-24 sm:py-32">
      <Beams quiet />
      <div className="shell relative">
        <Reveal>
          <h2 className="display mx-auto max-w-4xl text-center text-white">
            <span className="block">Turn one-time shoppers</span>
            <span className="mt-1 block">
              into <span className="italic text-lime">regulars.</span>
            </span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* PLACEHOLDER: pilot booking URL was not supplied. */}
            <a href="#get-started" className="btn btn-lime">
              Book your free pilot
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
