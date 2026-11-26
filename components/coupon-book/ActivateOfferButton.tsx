"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function ActivateOfferButton({ offerId }: { offerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function activate() {
    setLoading(true)
    await fetch("/api/coupon-book/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, status: "active" }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button onClick={activate} disabled={loading}>
      {loading ? "Saving…" : "Approve"}
    </Button>
  )
}
