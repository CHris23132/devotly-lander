/** Normalize to E.164. Default country Canada (+1). Supports US on the same path. */
export function normalizePhone(input: string, defaultCountry: "CA" | "US" = "CA"): string | null {
  const digits = input.replace(/\D/g, "")
  if (!digits) return null

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }

  if (digits.length === 10) {
    return `+1${digits}`
  }

  if (input.trim().startsWith("+") && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`
  }

  // Keep defaultCountry referenced so CA/US share one path and can diverge later.
  void defaultCountry
  return null
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return "****"
  return `***${phone.slice(-4)}`
}

export function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{9,14}$/.test(phone)
}
