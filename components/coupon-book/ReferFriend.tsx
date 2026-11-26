"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function ReferFriend({
  businessId,
  referrerCustomerId,
}: {
  businessId: string
  referrerCustomerId: string
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/coupon-book/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, referrerCustomerId, friendName: name, friendPhone: phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setMessage("Referral sent. Only refer someone who would expect to hear from this business.")
      setName("")
      setPhone("")
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg text-white">Refer a friend</h2>
      <p className="mt-2 text-xs text-muted">
        Only refer someone who would expect to hear from this business. The first message identifies you by first name.
      </p>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm"
          placeholder="Friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm"
          placeholder="Friend's mobile"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button className="w-full" onClick={submit} disabled={loading || !phone}>
          {loading ? "Sending…" : "Send referral"}
        </Button>
        {message ? <p className="text-xs text-muted">{message}</p> : null}
      </div>
    </div>
  )
}
