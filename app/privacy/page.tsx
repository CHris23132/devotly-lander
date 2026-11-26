import type { Metadata } from "next"
import Footer from "@/components/lander/Footer.jsx"
import Nav from "@/components/lander/Nav.jsx"

export const metadata: Metadata = {
  title: "Privacy Policy — Devotly",
  description:
    "How Devotly collects, uses, shares, and retains information for Shopify merchants and their shoppers.",
}

export default function PrivacyPage() {
  return (
    <div id="top" className="lander-page min-h-screen antialiased">
      <Nav />
      <main id="main">
        <article className="border-b border-[var(--dev-ink)] bg-[var(--dev-paper)]">
          <div className="shell max-w-3xl py-14 sm:py-16 lg:py-20">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--dev-accent)]">
              Legal
            </p>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold tracking-[-0.05em] text-[var(--dev-ink)]">
              Devotly Privacy Policy
            </h1>
            <p className="mt-4 text-sm font-semibold text-[var(--dev-muted)]">
              Last updated: November 25, 2026 · Devotly is operated by Play 3D Inc. ·{" "}
              <a href="https://devotly.app" className="text-[var(--dev-accent)] hover:underline">
                devotly.app
              </a>
            </p>

            <div className="privacy-prose mt-10 space-y-6 text-[15px] leading-relaxed text-[var(--dev-muted)]">
              <p>
                Devotly is a loyalty app for Shopify merchants. It runs a merchant’s loyalty program (points, rewards,
                referrals, and welcome offers), its AI Operator campaigns (personalized offers such as win-back,
                order-value, and first-purchase campaigns), and its done-for-you mobile app. This policy explains what
                information Devotly collects, how it is used, who it is shared with, how long it is kept, and the
                choices you have.
              </p>
              <p>
                This policy covers the Devotly Shopify app, the merchant admin, the customer-facing loyalty surfaces on
                a merchant’s store (including the welcome offer and loyalty launcher), the merchant’s Devotly mobile
                app, and the Devotly pixel.
              </p>

              <section className="space-y-4 pt-4">
                <h2>1. Information we collect</h2>

                <h3>From merchants (shop owners)</h3>
                <ul>
                  <li>
                    <strong>Shop identity and settings:</strong> shop domain, store name, currency, and the settings the
                    merchant configures in Devotly (loyalty rules, campaign guardrails, offer caps, and mobile-app
                    settings).
                  </li>
                  <li>
                    <strong>Store data read through Shopify:</strong> products, orders, checkouts, customers, discounts,
                    and reports — only what the merchant authorizes Devotly to access when they install the app.
                  </li>
                  <li>
                    <strong>Contact and account information</strong> the merchant provides to Devotly (for example, an
                    email address for support and billing).
                  </li>
                  <li>
                    <strong>Billing:</strong> subscription charges are billed by Shopify on the merchant’s Shopify
                    invoice. Devotly does not collect or store the merchant’s payment card details.
                  </li>
                </ul>

                <h3>From shoppers (a merchant’s customers)</h3>
                <ul>
                  <li>
                    <strong>When a shopper joins a merchant’s loyalty program or opts in:</strong> name, email address,
                    phone number, and address, as provided by the shopper. This is the information needed to run the
                    program — to enroll the shopper, track points, issue rewards and single-use codes, and send the
                    offers the shopper asked for.
                  </li>
                  <li>
                    <strong>Order history:</strong> the shopper’s orders with that merchant, used to calculate points,
                    measure repeat purchases, and personalize offers (for example, a win-back offer after a long gap
                    since the last order).
                  </li>
                  <li>
                    <strong>Loyalty activity:</strong> points earned and redeemed, referrals sent and completed, rewards
                    claimed, and welcome-offer participation.
                  </li>
                </ul>

                <h3>Automatically, through the Devotly pixel (with consent)</h3>
                <p>
                  When a merchant has Devotly installed, the Devotly pixel observes storefront activity so the
                  merchant’s loyalty program and campaigns can respond to what shoppers actually do. It collects only
                  the following events, and only when the shopper’s consent permits it (see Section 3):{" "}
                  <em>
                    page_viewed, product_viewed, collection_viewed, search_submitted, product_added_to_cart,
                    product_removed_from_cart, cart_viewed, checkout_started, and checkout_completed
                  </em>
                  .
                </p>
                <p>
                  Each event carries an opaque visitor identifier (a random identifier, not derived from the shopper’s
                  device or address), a session identifier, the page address, the referring page, and a general
                  device/browser class. The pixel does not collect payment information, checkout contact or address
                  details, form contents, keystrokes, or anything typed into a page. It does not fingerprint devices,
                  does not track IP addresses for identification, does not join activity across different shops, and
                  does not sell data.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>2. How we use the information</h2>
                <ul>
                  <li>
                    <strong>Run the loyalty program:</strong> enroll members, track points, issue and redeem rewards and
                    single-use codes, run referrals and welcome offers, and show rewards and campaigns in the merchant’s
                    mobile app.
                  </li>
                  <li>
                    <strong>Personalize offers and campaigns (AI Operator):</strong> decide which offer to show a
                    shopper and when, within the caps the merchant sets. The AI works from minimized, de-identified
                    inputs — purchase patterns and opaque customer identifiers — not from shoppers’ names or email
                    addresses.
                  </li>
                  <li>
                    <strong>Analytics and the store audit:</strong> measure repeat-purchase rate, conversion rate, and
                    average order value for the merchant, and benchmark them against published industry references.
                  </li>
                  <li>
                    <strong>Send messages the shopper asked for:</strong> email, SMS, and push notifications for loyalty
                    and campaign purposes, only where the shopper has opted in (see Section 3). Email is delivered
                    through SendGrid and SMS through Twilio.
                  </li>
                  <li>
                    <strong>Support, security, and legal compliance:</strong> respond to merchant and shopper requests,
                    prevent fraud and abuse, enforce the merchant’s guardrails, and comply with legal obligations.
                  </li>
                </ul>
                <p>
                  We do not use personal information for any purpose other than the ones listed here, and we do not sell
                  personal information.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>3. Consent and choice</h2>
                <ul>
                  <li>
                    <strong>Pixel consent:</strong> the Devotly pixel respects the consent a shopper gives through the
                    store’s consent controls, as enforced by Shopify. Consent is checked at the time an event is sent,
                    separately for analytics and for marketing purposes. If a shopper declines, the pixel does not send
                    data for the declined purpose.
                  </li>
                  <li>
                    <strong>Email and SMS:</strong> marketing email and SMS are opt-in only. SMS opt-in includes the
                    disclosure required by law (including the TCPA disclosure shown on the welcome-offer SMS step). A
                    shopper can opt out at any time by using the unsubscribe link in an email or by replying STOP to an
                    SMS.
                  </li>
                  <li>
                    <strong>Loyalty membership:</strong> shoppers opt in to join a merchant’s loyalty program and can
                    leave it at any time by contacting the merchant or Devotly (see Section 9).
                  </li>
                  <li>
                    <strong>Push notifications:</strong> a shopper can turn off push notifications in their device
                    settings or in the merchant’s mobile app.
                  </li>
                </ul>
              </section>

              <section className="space-y-4 pt-4">
                <h2>4. Who we share information with</h2>
                <p>
                  Devotly shares information only as needed to provide the service, with the following service providers
                  (sub-processors):
                </p>
                <ul>
                  <li>
                    <strong>Shopify Inc.</strong> — the commerce platform Devotly runs on. Devotly reads store data
                    through Shopify’s Admin API with only the permissions the merchant approves, and Shopify bills the
                    merchant for their Devotly subscription.
                  </li>
                  <li>
                    <strong>Google Cloud / Firebase</strong> — hosting, database, and backend functions for the Devotly
                    app.
                  </li>
                  <li>
                    <strong>SendGrid (Twilio SendGrid)</strong> — email delivery for loyalty and campaign messages.
                  </li>
                  <li>
                    <strong>Twilio</strong> — SMS delivery for loyalty and campaign messages.
                  </li>
                  <li>
                    <strong>OpenAI</strong> — the AI provider for the AI Operator. It receives only minimized,
                    de-identified inputs (purchase patterns and opaque customer identifiers, not names or email
                    addresses). It is a paid API service, which does not train on API inputs by default.
                  </li>
                </ul>
                <p>
                  We do not sell personal information, we do not share it for third-party advertising, and we do not join
                  a shopper’s activity across different merchants’ shops. Information may also be disclosed if required
                  by law or to protect the safety and security of Devotly, a merchant, or a shopper.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>5. Data retention and deletion</h2>
                <ul>
                  <li>
                    <strong>Pixel/event data:</strong> raw event records are kept for 13 months. Aggregated counts
                    derived from events (for example, product view counts) are kept while the merchant remains
                    subscribed to Devotly.
                  </li>
                  <li>
                    <strong>Loyalty and customer data:</strong> kept while the merchant uses Devotly and the shopper
                    remains enrolled in that merchant’s loyalty program.
                  </li>
                  <li>
                    <strong>On uninstall:</strong> when a merchant uninstalls Devotly from their Shopify store, the
                    merchant’s Devotly data is deleted, including through Shopify’s data-erasure and uninstall
                    processes.
                  </li>
                  <li>
                    <strong>On an erasure request:</strong> when a shopper or merchant asks for their personal
                    information to be deleted, Devotly deletes or redacts it, including from the service providers
                    listed in Section 4 where applicable.
                  </li>
                </ul>
              </section>

              <section className="space-y-4 pt-4">
                <h2>6. Data security</h2>
                <p>
                  Devotly collects only the information needed to run the service and minimizes personal information
                  wherever possible (for example, the AI Operator works from patterns and opaque identifiers, not names
                  or email addresses). Access tokens and credentials are encrypted at rest, access to personal
                  information is limited to what each function needs, and data is transmitted over encrypted
                  connections. No method of transmission or storage is completely secure, and Devotly cannot guarantee
                  absolute security, but it takes reasonable administrative, technical, and physical measures to protect
                  the information it holds.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>7. International transfers</h2>
                <p>
                  Devotly and its service providers may process information in the United States and Canada, including
                  through Google Cloud/Firebase, SendGrid, Twilio, and OpenAI. Where information is transferred across
                  borders, Devotly relies on the safeguards provided by those providers and by applicable law.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>8. Your rights</h2>
                <p>
                  Depending on where you live, you may have the right to access, correct, delete, or receive a copy of
                  your personal information; to opt out of marketing; to withdraw consent; and to limit or object to
                  certain processing. These rights apply under, among others, Canada’s PIPEDA and CASL, the EU/UK GDPR,
                  and California’s CCPA/CPRA.
                </p>
                <ul>
                  <li>
                    <strong>Shoppers:</strong> to exercise your rights over information held in a merchant’s loyalty
                    program (including deletion and opting out of marketing), contact the merchant directly, or contact
                    Devotly using the details in Section 9 and Devotly will pass the request to the merchant and action
                    what it holds.
                  </li>
                  <li>
                    <strong>Merchants:</strong> to exercise your rights over your shop’s Devotly data, or to request
                    deletion of your shop’s data, contact Devotly using the details in Section 9. Uninstalling Devotly
                    from your Shopify store also triggers deletion of your shop’s Devotly data (see Section 5).
                  </li>
                </ul>
                <p>Devotly will respond to a verifiable request within the timeframe required by applicable law.</p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>9. Contact us</h2>
                <p>If you have questions about this policy, or wish to exercise your rights, contact Devotly:</p>
                <ul>
                  <li>
                    <strong>Email:</strong> [FILL IN — privacy contact email]
                  </li>
                  <li>
                    <strong>Mailing address:</strong> [FILL IN — business mailing address]
                  </li>
                  <li>
                    <strong>Website:</strong>{" "}
                    <a href="https://devotly.app" className="text-[var(--dev-accent)] hover:underline">
                      devotly.app
                    </a>
                  </li>
                </ul>
              </section>

              <section className="space-y-4 pt-4">
                <h2>10. Children</h2>
                <p>
                  Devotly is a service for businesses (merchants) and is not directed at children. Devotly does not
                  knowingly collect personal information from children under 13 (or under 16 where that threshold
                  applies). If a merchant’s store serves children, the merchant is responsible for ensuring it has the
                  necessary consents for any information it collects through Devotly. If you believe Devotly has
                  collected information from a child, contact Devotly using the details in Section 9 and it will be
                  deleted.
                </p>
              </section>

              <section className="space-y-4 pt-4">
                <h2>11. Changes to this policy</h2>
                <p>
                  Devotly may update this policy from time to time, for example when the service changes or the law
                  changes. The updated policy will be posted on this page with a new “Last updated” date, and material
                  changes will be notified to merchants through the Devotly admin or by email where appropriate.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
