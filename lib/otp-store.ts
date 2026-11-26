type OtpEntry = { codeHash: string; expiresAt: number }

const otpStore = new Map<string, OtpEntry>()

export function getOtpStore() {
  return otpStore
}
