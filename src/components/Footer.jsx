import Logo from "./Logo.jsx"

export default function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <Logo />

        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Product</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a className="text-white/75 hover:text-white" href="#features">
                Features
              </a>
            </li>
            <li>
              <a className="text-white/75 hover:text-white" href="#how-it-works">
                How it works
              </a>
            </li>
            <li>
              <a className="text-white/75 hover:text-white" href="#pricing">
                Pricing
              </a>
            </li>
            <li>
              <a className="text-white/75 hover:text-white" href="#faq">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div id="company">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a className="text-white/75 hover:text-white" href="#top">
                Devotly
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <p className="shell py-6 text-sm text-muted">© 2026 Devotly</p>
      </div>
    </footer>
  )
}
