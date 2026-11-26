import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-midnight px-4 py-12 text-white">
      <Link href="/coupon-book" className="text-sm text-lime">
        ← Coupon Book
      </Link>
      <h1 className="mt-6 font-serif text-4xl">Privacy — Coupon Book</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          We collect name, phone, email, and last purchase date to run your business&apos;s coupon book program — sending
          offers, verifying claims, and redeeming single-use codes.
        </p>
        <p>Customer data is never sold, shared, or used for another business.</p>
        <p>
          You can opt out anytime by replying STOP to SMS or using the unsubscribe link in emails. Merchants can delete
          a customer or export their list from admin.
        </p>
      </div>
    </div>
  )
}
