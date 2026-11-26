import { createHash, randomBytes, createHmac } from "node:crypto"
import { requireEnv } from "@/lib/config"

/** Unambiguous alphabet — no 0/O, 1/I/L */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

export function generateCouponCode(length = 10): string {
  const bytes = randomBytes(length)
  let code = ""
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[bytes[i]! % ALPHABET.length]
  }
  return code
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function signQrPayload(couponId: string, code: string, businessId: string): string {
  const secret = requireEnv("CUSTOMER_LINK_SECRET")
  const payload = `${businessId}.${couponId}.${code}`
  const sig = createHmac("sha256", secret).update(payload).digest("base64url")
  return `${payload}.${sig}`
}

export function verifyQrPayload(token: string): { businessId: string; couponId: string; code: string } | null {
  const parts = token.split(".")
  if (parts.length !== 4) return null
  const [businessId, couponId, code, sig] = parts
  if (!businessId || !couponId || !code || !sig) return null
  const secret = requireEnv("CUSTOMER_LINK_SECRET")
  const expected = createHmac("sha256", secret).update(`${businessId}.${couponId}.${code}`).digest("base64url")
  if (sig !== expected) return null
  return { businessId, couponId, code }
}

export function createPersonalBookToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString("base64url")
  return { token, hash: hashToken(token) }
}

export function createVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
