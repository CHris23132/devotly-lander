"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function BillingActions({ hasCustomer }: { hasCustomer: boolean }) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function checkout() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/coupon-book/billing/checkout", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")
      if (data.url) window.location.href = data.url
      else setMessage(data.message || "Checkout session created")
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  async function portal() {
    setLoading(true)
    try {
      const res = await fetch("/api/coupon-book/billing/portal", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Portal failed")
      if (data.url) window.location.href = data.url
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Portal failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={checkout} disabled={loading}>
        {loading ? "Loading…" : "Subscribe — $149/mo"}
      </Button>
      {hasCustomer ? (
        <Button variant="ghost" onClick={portal} disabled={loading}>
          Manage / cancel
        </Button>
      ) : null}
      {message ? <p className="w-full text-sm text-muted">{message}</p> : null}
    </div>
  )
}
