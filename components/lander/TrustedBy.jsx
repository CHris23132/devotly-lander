export default function TrustedBy() {
  return (
    <section className="trusted-by" aria-label="Trusted by e-commerce brands">
      <div className="shell trusted-by-inner">
        <p className="trusted-by-label">Designed for Shopify merchants</p>
        <div className="trusted-by-row">
          <span>Built for retention</span>
          <span>Native customer journeys</span>
          <span>Actionable growth insights</span>
        </div>

        <div className="trusted-goals" aria-label="Devotly outcomes">
          <article className="trusted-goal">
            <span className="trusted-goal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M19 7v5h-5M5 17v-5h5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.2 8.1A6.5 6.5 0 0 1 18.6 11M16.8 15.9A6.5 6.5 0 0 1 5.4 13" strokeLinecap="round" />
              </svg>
            </span>
            <div><h3>Increase Retention</h3><p>Automatically bring customers back with targeted campaigns.</p></div>
          </article>

          <article className="trusted-goal">
            <span className="trusted-goal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3.5 5h2l1.8 10.1h10.5l2-7.2H6.1M9 19.2h.1M17 19.2h.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div><h3>Grow Order Value</h3><p>Drive higher AOV with bundles, rewards, and exclusive offers.</p></div>
          </article>

          <article className="trusted-goal">
            <span className="trusted-goal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="13" width="3" height="7" rx="1" /><rect x="10.5" y="8" width="3" height="12" rx="1" /><rect x="17" y="3" width="3" height="17" rx="1" />
              </svg>
            </span>
            <div><h3>Turn Data Into Action</h3><p>See what works and keep improving.</p></div>
          </article>
        </div>
      </div>
    </section>
  )
}
