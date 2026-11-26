"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"

type ValidateResult = {
  ok: boolean
  reason: string
  coupon?: {
    code: string
    offer: { title: string; expiresAt?: string }
    customer: { firstName?: string; lastName?: string }
    redeemedAt?: string
  }
  redeemedAt?: string
  redeemedBy?: string | null
}

export default function RedeemPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<ValidateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [today, setToday] = useState<{ code: string; result: string; createdAt: string }[]>([])

  async function refreshToday() {
    const res = await fetch("/api/coupon-book/business/redemptions-today")
    if (res.ok) setToday(await res.json())
  }

  useEffect(() => {
    void refreshToday()
  }, [])

  async function validate() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/coupon-book/redeem/${encodeURIComponent(code)}`)
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  async function redeem() {
    setLoading(true)
    try {
      const res = await fetch(`/api/coupon-book/redeem/${encodeURIComponent(code)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      })
      const data = await res.json()
      setResult(data)
      await refreshToday()
    } finally {
      setLoading(false)
    }
  }

  const valid = result?.ok && result.reason === "valid"

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-serif text-4xl">Redeem</h1>
      <p className="mt-2 text-sm text-muted">Scan or enter a code. Validity is decided on the server.</p>

      <div className="mt-8 space-y-4">
        <input
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-center font-mono text-2xl tracking-[0.2em]"
          placeholder="CODE"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <Button className="w-full py-4 text-base" onClick={validate} disabled={!code || loading}>
          {loading ? "Checking…" : "Validate"}
        </Button>
      </div>

      {result ? (
        <div
          className={`mt-6 rounded-2xl border p-6 ${
            valid ? "border-lime/40 bg-lime/10" : "border-red-400/30 bg-red-500/10"
          }`}
        >
          <p className="text-2xl font-semibold">{valid ? "VALID" : result.reason.replaceAll("_", " ").toUpperCase()}</p>
          {result.coupon ? (
            <div className="mt-3 text-sm text-white/90">
              <p>{result.coupon.offer?.title}</p>
              <p className="text-muted">
                {[result.coupon.customer?.firstName, result.coupon.customer?.lastName].filter(Boolean).join(" ") ||
                  "Customer"}
              </p>
              {result.reason === "already_redeemed" ? (
                <p className="mt-2 text-muted">
                  Redeemed {result.redeemedAt ? new Date(result.redeemedAt).toLocaleString() : ""}
                  {result.redeemedBy ? ` by ${result.redeemedBy}` : ""}
                </p>
              ) : null}
            </div>
          ) : null}
          {valid ? (
            <Button className="mt-5 w-full py-4 text-base" onClick={redeem} disabled={loading}>
              Redeem now
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-10">
        <h2 className="text-lg">Today&apos;s redemptions</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {today.length === 0 ? <li>None yet</li> : null}
          {today.map((row, i) => (
            <li key={`${row.code}-${i}`} className="flex justify-between border-b border-white/8 py-2">
              <span className="font-mono text-white">{row.code}</span>
              <span>
                {row.result} · {new Date(row.createdAt).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
