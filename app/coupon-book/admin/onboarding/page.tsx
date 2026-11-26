"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { INDUSTRY_LABELS } from "@/lib/industry-templates"

const industries = Object.entries(INDUSTRY_LABELS)

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    businessName: "",
    industry: "restaurant",
    address: "",
    phone: "",
    websiteUrl: "",
    timezone: "America/Toronto",
    brandColor: "#C6F432",
  })

  async function createAccount() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coupon-book/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  async function login() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coupon-book/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      router.push("/coupon-book/admin")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  async function runImport(skip = false) {
    if (skip) {
      setStep(3)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coupon-book/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: form.websiteUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Import failed")
      setStep(3)
      router.push("/coupon-book/admin/import")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed")
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-4xl">Merchant onboarding</h1>
      <p className="mt-2 text-sm text-muted">Step {step} of 6 · progress saves as you go</p>

      <div className="mt-8 space-y-4">
        {step === 1 ? (
          <>
            <Field label="Work email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
            />
            <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field
              label="Business name"
              value={form.businessName}
              onChange={(v) => setForm({ ...form, businessName: v })}
            />
            <label className="block text-sm">
              Industry
              <select
                className="mt-2 w-full rounded-xl border border-white/15 bg-[#141414] px-3 py-3"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              >
                {industries.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field
              label="Website URL"
              value={form.websiteUrl}
              onChange={(v) => setForm({ ...form, websiteUrl: v })}
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={createAccount} disabled={loading}>
                {loading ? "Saving…" : "Create account & business"}
              </Button>
              <Button variant="ghost" onClick={login} disabled={loading}>
                I already have an account — sign in
              </Button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p className="text-sm text-muted">
              Plug in your website and we&apos;ll draft offers from what&apos;s on the site. Nothing goes live until you
              approve it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => runImport(false)} disabled={loading || !form.websiteUrl}>
                {loading ? "Importing…" : "Import website"}
              </Button>
              <Button variant="ghost" onClick={() => runImport(true)}>
                Skip — build manually
              </Button>
            </div>
          </>
        ) : null}

        {step >= 3 ? (
          <div className="card p-5">
            <p className="text-sm text-muted">
              Next: review your book, upload customers, complete billing, then launch.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href="/coupon-book/admin/book">Open book builder</Button>
              <Button href="/coupon-book/admin/customers" variant="ghost">
                Customers
              </Button>
              <Button href="/coupon-book/admin/settings" variant="ghost">
                Billing & settings
              </Button>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        type={type}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
