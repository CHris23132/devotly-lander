"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function PhysicalBookForm() {
  const [quantity, setQuantity] = useState(100)
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  async function submit() {
    const res = await fetch("/api/coupon-book/physical-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, notes }),
    })
    const data = await res.json()
    setMessage(res.ok ? "Request submitted — we'll quote print + delivery." : data.error || "Failed")
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        Quantity
        <input
          type="number"
          min={25}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <label className="block text-sm">
        Notes
        <textarea
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <Button onClick={submit}>Request quote</Button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  )
}
