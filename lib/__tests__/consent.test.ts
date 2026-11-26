import { describe, expect, it } from "vitest"
import { computeImpliedExpiry, getConsentLabel, isConsentEligible, refreshConsentFromPurchase } from "@/lib/consent"

describe("consent engine", () => {
  it("gives implied consent for 24 months from last purchase", () => {
    const last = new Date("2024-01-15T00:00:00.000Z")
    const refreshed = refreshConsentFromPurchase(last)
    expect(refreshed.consentType).toBe("implied_purchase")
    expect(computeImpliedExpiry(last).getTime()).toBe(refreshed.consentExpiresAt.getTime())
  })

  it("treats 23 months as eligible and 25 months as expired for implied consent", () => {
    const now = new Date("2026-01-15T00:00:00.000Z")
    const months23 = new Date("2024-02-20T00:00:00.000Z")
    const months25 = new Date("2023-12-01T00:00:00.000Z")

    const eligible = {
      consentType: "implied_purchase" as const,
      consentExpiresAt: computeImpliedExpiry(months23),
      optedOutAt: null,
      phone: "+14165550101",
    }
    const expired = {
      consentType: "implied_purchase" as const,
      consentExpiresAt: computeImpliedExpiry(months25),
      optedOutAt: null,
      phone: "+14165550102",
    }

    expect(isConsentEligible(eligible, now)).toBe(true)
    expect(isConsentEligible(expired, now)).toBe(false)
    expect(getConsentLabel(expired, now)).toBe("expired")
  })

  it("blocks opted-out customers even with express consent", () => {
    expect(
      isConsentEligible({
        consentType: "express",
        consentExpiresAt: null,
        optedOutAt: new Date(),
        phone: "+14165550103",
      }),
    ).toBe(false)
  })
})
