import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { hasSendGrid, hasTwilio } from "@/lib/config"

const LINKS = [
  { href: "/coupon-book/admin", label: "Dashboard" },
  { href: "/coupon-book/admin/book", label: "Book" },
  { href: "/coupon-book/admin/customers", label: "Customers" },
  { href: "/coupon-book/admin/campaigns", label: "Campaigns" },
  { href: "/coupon-book/admin/redeem", label: "Redeem" },
  { href: "/coupon-book/admin/referrals", label: "Referrals" },
  { href: "/coupon-book/admin/settings", label: "Settings" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  // Allow onboarding/login pages without auth via nested routes checking themselves.
  const messagingNote = !hasTwilio() || !hasSendGrid()

  return (
    <div className="min-h-screen bg-midnight text-white">
      <header className="border-b border-white/8">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/coupon-book" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Devotly" className="h-7 w-auto brightness-0 invert" />
            <span className="text-sm font-semibold text-white/70">Admin</span>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm text-white/70">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            {user ? (
              <form action="/api/coupon-book/auth/logout" method="post">
                <button className="hover:text-white" type="submit">
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/coupon-book/admin/onboarding" className="text-lime">
                Sign in / Start
              </Link>
            )}
          </nav>
        </div>
        {messagingNote ? (
          <div className="border-t border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-100">
            Messaging is not configured — SMS/email run in dry-run mode. No messages are delivered.
          </div>
        ) : null}
      </header>
      <div className="shell py-8">{children}</div>
    </div>
  )
}
