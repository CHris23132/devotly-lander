import Link from "next/link"
import { Button } from "@/components/ui/Button"
import Logo from "@/components/lander/Logo.jsx"
import { INDUSTRY_LABELS, INDUSTRY_TEMPLATES } from "@/lib/industry-templates"
import type { Industry } from "@prisma/client"

const STEPS = [
  "Upload your customer book",
  "Plug in your website — we build your book instantly",
  "Customers get it by text and save it to Apple / Google Wallet",
  "We text them monthly, personalized, linking their book",
  "You scan or enter the code in-store — every coupon is single-use",
]

const INDUSTRIES: Industry[] = [
  "restaurant",
  "salon",
  "med_spa",
  "golf_entertainment",
  "retail",
  "services",
]

const COMPARISON = [
  ["Print + delivery", "Up to ~$1/copy + delivery — 200 flyers is $200+ before delivery", "$0 print/delivery"],
  ["Tracking", "No tracking", "Every open and redeem tracked"],
  ["Copying", "Anyone can photocopy", "Unique single-use codes"],
  ["Follow-up", "One drop", "Monthly automated re-sends"],
]

const FAQ = [
  {
    q: "Can I text past customers?",
    a: "In Canada, if someone bought from you in the last 2 years, you generally have implied consent to message them about your business until that window ends or they opt out. Claiming a book creates express consent. This product helps you apply those rules — it does not guarantee compliance. Confirm your list practices.",
  },
  {
    q: "What if I have no website?",
    a: "Skip import and build offers manually from industry templates.",
  },
  {
    q: "What if I have no customer list?",
    a: "Publish your public book and collect claims in-store via QR. Upload a CSV later when you’re ready.",
  },
  {
    q: "How does redemption work?",
    a: "Staff open the phone-friendly redeem screen, scan the QR or type the code. The server enforces single-use — a second scan shows already redeemed with date and time.",
  },
  {
    q: "How does cancelling work?",
    a: "Cancel anytime in the billing portal. Access continues through the paid period. New coupon issuance stops after that; already-issued unexpired coupons stay redeemable until they expire. Your data is retained.",
  },
]

export default function CouponBookLanderPage() {
  return (
    <div className="lander-page min-h-screen antialiased">
      <header className="sticky top-0 z-50 border-b border-[var(--dev-ink)] bg-[rgb(240_247_255_/_92%)] backdrop-blur-xl">
        <div className="shell flex h-[4.25rem] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 rounded-[12px] border border-[var(--dev-ink)] bg-white p-1 shadow-[3px_3px_0_var(--dev-ink)] md:flex" aria-label="Primary">
            {[
              ["#how", "How it works"],
              ["#industries", "Industries"],
              ["#pricing", "Pricing"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-[8px] px-3 py-1.5 text-[13px] font-semibold text-[var(--dev-muted)] hover:text-[var(--dev-ink)]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/coupon-book/admin"
              className="hidden text-[13px] font-semibold text-[var(--dev-muted)] hover:text-[var(--dev-ink)] sm:inline"
            >
              Sign in
            </Link>
            <Button href="/coupon-book/admin/onboarding">Start — $149/mo</Button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell mx-auto max-w-3xl text-center">
            <p className="kicker">Digital Coupon Book</p>
            <h1 className="display mt-5">
              Win back past customers with a digital coupon book, sent by text.
            </h1>
            <p className="lede mx-auto mt-5 max-w-2xl">
              Upload your customer list, we build the book from your website, your customers save it to their phone
              wallet and come back in.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/coupon-book/admin/onboarding">Start — $149/month, cancel anytime</Button>
              <Button href="/b/demo" variant="secondary">
                See a sample book
              </Button>
            </div>
          </div>
        </section>

        <section id="how" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell">
            <p className="kicker">How it works</p>
            <h2 className="section-title mt-4 max-w-3xl">From upload to in-store redeem — five steps.</h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {STEPS.map((step, i) => (
                <li key={step} className="brutal-card p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
                    Step 0{i + 1}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--dev-ink)]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell">
            <p className="kicker">Compare</p>
            <h2 className="section-title mt-4 max-w-3xl">Why digital beats physical</h2>
            <div className="brutal-card mt-10 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--dev-ink)] bg-[var(--dev-mint)]">
                    <th className="px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[11px] text-[var(--dev-muted)]">
                      {" "}
                    </th>
                    <th className="px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[11px] text-[var(--dev-muted)]">
                      Physical book
                    </th>
                    <th className="px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[11px] text-[var(--dev-accent)]">
                      Digital coupon book
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(([label, physical, digital]) => (
                    <tr key={label} className="border-b border-[var(--dev-line)] align-top last:border-b-0">
                      <td className="px-5 py-4 font-semibold text-[var(--dev-ink)]">{label}</td>
                      <td className="px-5 py-4 text-[var(--dev-muted)]">{physical}</td>
                      <td className="px-5 py-4 font-semibold text-[var(--dev-ink)]">{digital}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="industries" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell">
            <p className="kicker">Industries</p>
            <h2 className="section-title mt-4 max-w-3xl">Works for your industry</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((industry) => {
                const example = INDUSTRY_TEMPLATES[industry][0]!
                return (
                  <article key={industry} className="brutal-card p-5 sm:p-6">
                    <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--dev-ink)]">
                      {INDUSTRY_LABELS[industry]}
                    </h3>
                    <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
                      Example deal
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--dev-muted)]">{example.title}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell max-w-3xl">
            <p className="kicker">Referrals</p>
            <h2 className="section-title mt-4">Referral plugin</h2>
            <p className="lede mt-4">
              Customers refer a friend by text. When the friend books or redeems, both get rewarded by SMS.
            </p>
          </div>
        </section>

        <section id="pricing" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell">
            <p className="kicker">Pricing</p>
            <h2 className="section-title mt-4 max-w-3xl">Simple monthly pricing</h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <article className="brutal-card p-7 sm:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
                  Included
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-[var(--dev-ink)]">
                  Digital Coupon Book
                </h3>
                <p className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-[var(--dev-ink)]">
                  $149<span className="text-base font-semibold text-[var(--dev-muted)]">/mo</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--dev-muted)]">Cancel anytime</p>
                <ul className="mt-6 space-y-3 text-sm font-semibold text-[var(--dev-ink)]">
                  {[
                    "Hosted coupon book",
                    "Monthly SMS + email campaign",
                    "Redemption app",
                    "Referral plugin",
                    "Wallet passes (when configured)",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[var(--dev-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/coupon-book/admin/onboarding" className="mt-8 w-full">
                  Start — $149/month, cancel anytime
                </Button>
              </article>
              <article className="brutal-card-soft p-7 sm:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-muted)]">
                  Add-on
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-[var(--dev-ink)]">
                  Printed physical book
                </h3>
                <p className="mt-4 text-lg font-semibold text-[var(--dev-muted)]">Quoted separately</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--dev-muted)]">
                  Available but costlier — print + delivery. Digital is included in the $149 plan and is the default
                  flow. Request a quote from settings after you subscribe.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell max-w-3xl">
            <p className="kicker">FAQ</p>
            <h2 className="section-title mt-4">Common questions</h2>
            <div className="mt-10 space-y-4">
              {FAQ.map((item) => (
                <article key={item.q} className="brutal-card p-5 sm:p-6">
                  <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[var(--dev-ink)]">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--dev-muted)]">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--dev-ink)] py-16 sm:py-20">
          <div className="shell">
            <div className="brutal-card bg-[var(--dev-accent)] p-7 text-white sm:p-10">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">Get started</p>
              <h2 className="mt-4 max-w-3xl text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.02] tracking-[-0.045em]">
                Start your digital coupon book for $149/month
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href="/coupon-book/admin/onboarding"
                  className="border-[var(--dev-ink)] bg-white text-[var(--dev-ink)] shadow-[4px_4px_0_var(--dev-ink)] hover:bg-[var(--dev-mint)]"
                >
                  Start — $149/month, cancel anytime
                </Button>
                <Button href="/b/demo" variant="secondary" className="border-white bg-transparent text-white shadow-[4px_4px_0_rgba(255,255,255,0.35)] hover:bg-white/10 hover:text-white">
                  See a sample book
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/80">
                <Link href="/privacy" className="underline hover:text-white">
                  Privacy
                </Link>{" "}
                · Terms
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--dev-ink)]">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
          <Logo />
          <p className="text-sm text-[var(--dev-muted)]">© 2026 Devotly</p>
        </div>
      </footer>
    </div>
  )
}
