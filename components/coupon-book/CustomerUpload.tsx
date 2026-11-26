"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export function CustomerUpload() {
  const [csv, setCsv] = useState("")
  const [fileName, setFileName] = useState("customers.csv")
  const [preview, setPreview] = useState<{ accepted: object[]; rejected: object[] } | null>(null)
  const [attested, setAttested] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onFile(file: File) {
    setFileName(file.name)
    setCsv(await file.text())
  }

  async function runPreview() {
    const res = await fetch("/api/coupon-book/customers/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error || "Preview failed")
      return
    }
    setPreview(data)
    setMessage(`Parsed ${data.parsed}: ${data.accepted.length} accepted, ${data.rejected.length} rejected`)
  }

  async function commit() {
    if (!preview || !attested) return
    const res = await fetch("/api/coupon-book/customers/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, attestation: true, rows: preview.accepted }),
    })
    const data = await res.json()
    setMessage(res.ok ? `Imported ${data.upserted} customers` : data.error || "Import failed")
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg">CSV upload</h2>
      <p className="mt-2 text-xs text-muted">
        Columns: first_name, last_name, phone, email, last_purchase_date, total_spent (optional), tags (optional)
      </p>
      <input
        className="mt-4 block w-full text-sm"
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={runPreview} disabled={!csv}>
          Preview
        </Button>
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} />
          These are my customers, the purchase dates are accurate to my records, and I obtained these numbers in the
          course of doing business with them.
        </label>
      </div>
      <Button className="mt-4" onClick={commit} disabled={!preview || !attested || preview.accepted.length === 0}>
        Commit import
      </Button>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </div>
  )
}
