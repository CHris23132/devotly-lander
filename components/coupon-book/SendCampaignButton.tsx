"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function SendCampaignButton({ eligibleCount }: { eligibleCount: number }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function send() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/coupon-book/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "first_send", confirm: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Send failed")
      setMessage(
        `Done. Eligible ${data.eligible}. Sent ${data.results.sent}, dry-run ${data.results.dryRun}, failed ${data.results.failed}, quiet-queued ${data.results.queuedQuiet}.`,
      )
      setOpen(false)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Send failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Send first book / blast</Button>
      {open ? (
        <div className="card mt-4 p-5">
          <p className="text-sm">
            Confirm send to <strong>{eligibleCount}</strong> eligible recipients (after consent + suppression). Exact
            first-send copy uses the default SMS template with STOP language.
          </p>
          <div className="mt-4 flex gap-3">
            <Button onClick={send} disabled={loading || eligibleCount === 0}>
              {loading ? "Sending…" : "Confirm send"}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </div>
  )
}
