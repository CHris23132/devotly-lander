"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function ClaimClient() {
  const params = useParams<{ businessSlug: string }>()
  const search = useSearchParams()
  const offerId = search.get("offer") || ""
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "verify" | "done">("phone")
  const [result, setResult] = useState<{ couponCode?: string; bookUrl?: string; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function requestCode() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/coupon-book/claim/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug: params.businessSlug,
          phone,
          email: email || undefined,
          offerId: offerId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setStep("verify")
      if (data.devCode) setCode(data.devCode)
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "Failed" })
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/coupon-book/claim/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug: params.businessSlug,
          phone,
          email: email || undefined,
          code,
          offerId: offerId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setResult({ couponCode: data.couponCode, bookUrl: data.bookUrl })
      setStep("done")
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "Failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-midnight px-4 py-10 text-white">
      <h1 className="font-serif text-3xl">Claim your coupon</h1>
      <p className="mt-3 text-sm text-muted">
        By entering your number you agree to receive texts and emails from this business about once a month. Reply STOP
        or unsubscribe anytime.
      </p>

      {step === "phone" ? (
        <div className="mt-8 space-y-4">
          <label className="block text-sm">
            Mobile number
            <input
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 416 555 0100"
            />
          </label>
          <label className="block text-sm">
            Email (optional)
            <input
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </label>
          <Button className="w-full" onClick={requestCode} disabled={loading || !phone}>
            {loading ? "Sending…" : "Send verification code"}
          </Button>
        </div>
      ) : null}

      {step === "verify" ? (
        <div className="mt-8 space-y-4">
          <label className="block text-sm">
            Verification code
            <input
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 tracking-[0.3em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <Button className="w-full" onClick={verify} disabled={loading || code.length < 4}>
            {loading ? "Verifying…" : "Verify & claim"}
          </Button>
        </div>
      ) : null}

      {step === "done" && result?.couponCode ? (
        <div className="card card-glass mt-8 p-6 text-center">
          <p className="text-sm text-muted">Your unique code</p>
          <p className="mt-3 font-mono text-3xl tracking-widest text-lime">{result.couponCode}</p>
          {result.bookUrl ? (
            <Button href={result.bookUrl} className="mt-6 w-full">
              Open my book
            </Button>
          ) : null}
          <p className="mt-4 text-xs text-muted">
            Add this page to your Home Screen to keep your book handy. Wallet buttons appear when pass signing is
            configured.
          </p>
        </div>
      ) : null}

      {result?.error ? <p className="mt-4 text-sm text-red-300">{result.error}</p> : null}
    </div>
  )
}
