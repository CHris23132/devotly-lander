import { describe, expect, it } from "vitest"
import { normalizePhone, maskPhone } from "@/lib/phone"

describe("phone", () => {
  it("normalizes CA/US numbers to E.164", () => {
    expect(normalizePhone("(416) 555-0100")).toBe("+14165550100")
    expect(normalizePhone("1-416-555-0100")).toBe("+14165550100")
    expect(normalizePhone("+1 416 555 0100")).toBe("+14165550100")
  })

  it("masks to last 4", () => {
    expect(maskPhone("+14165550100")).toBe("***0100")
  })
})
