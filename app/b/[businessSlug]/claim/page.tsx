import { Suspense } from "react"
import ClaimClient from "./ClaimClient"

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="bg-midnight p-8 text-white">Loading…</div>}>
      <ClaimClient />
    </Suspense>
  )
}
