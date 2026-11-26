"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function UnsubscribePage() {
  const [phone, setPhone] = useState("")
  const [businessSlug, setBusinessSlug] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  async function submit() {
    const res = await fetch("/api/coupon-book/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, businessSlug }),
    })
    const data = await res.json()
    setMessage(res.ok ? "You are unsubscribed from marketing messages for this business." : data.error || "Failed")
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-midnight px-4 py-12 text-white">
      <h1 className="font-serif text-4xl">Unsubscribe</h1>
      <p className="mt-3 text-sm text-muted">Opt out of marketing SMS and email for one business.</p>
      <div className="mt-8 space-y-4">
        <input
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
          placeholder="Business slug (e.g. demo)"
          value={businessSlug}
          onChange={(e) => setBusinessSlug(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={submit}>Confirm unsubscribe</Button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  )
}
