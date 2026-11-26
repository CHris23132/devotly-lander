import { describe, expect, it, beforeAll } from "vitest"
import { generateCouponCode, signQrPayload, verifyQrPayload, hashToken } from "@/lib/codes"

beforeAll(() => {
  process.env.CUSTOMER_LINK_SECRET = "test-secret-for-codes"
})

describe("coupon codes", () => {
  it("generates unique-looking codes from the unambiguous alphabet", () => {
    const a = generateCouponCode(10)
    const b = generateCouponCode(10)
    expect(a).toHaveLength(10)
    expect(a).not.toMatch(/[01IOL]/)
    expect(a).not.toBe(b)
  })

  it("signs and verifies QR payloads", () => {
    const token = signQrPayload("coupon1", "ABC123XYZ9", "biz1")
    expect(verifyQrPayload(token)).toEqual({
      businessId: "biz1",
      couponId: "coupon1",
      code: "ABC123XYZ9",
    })
    expect(verifyQrPayload(token + "tamper")).toBeNull()
  })

  it("hashes tokens stably", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"))
    expect(hashToken("abc")).not.toBe(hashToken("abd"))
  })
})
