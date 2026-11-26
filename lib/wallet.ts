import { hasAppleWallet, hasGoogleWallet } from "@/lib/config"

export type WalletPassInput = {
  businessName: string
  logoUrl?: string | null
  offerTitle: string
  expiry?: Date | null
  customerName?: string | null
  code: string
  qrPayload: string
}

export type WalletPassResult = {
  appleUrl?: string
  googleUrl?: string
  unavailableReason?: string
}

export interface WalletProvider {
  configured: boolean
  createPass(input: WalletPassInput): Promise<WalletPassResult>
  voidPass?(passId: string): Promise<void>
}

class FallbackWalletProvider implements WalletProvider {
  configured = false

  async createPass(): Promise<WalletPassResult> {
    console.info("[wallet:unconfigured] hiding wallet buttons; use /my-book home-screen fallback")
    return { unavailableReason: "Wallet credentials are not configured" }
  }
}

class PlatformWalletProvider implements WalletProvider {
  configured = hasAppleWallet() || hasGoogleWallet()

  async createPass(input: WalletPassInput): Promise<WalletPassResult> {
    // Full PassKit / Google Wallet JWT signing requires live certificates.
    // When credentials exist, wire the official flows here. Until then, degrade safely.
    if (!this.configured) return new FallbackWalletProvider().createPass()

    console.info("[wallet] credentials present — pass generation placeholder for certificate-backed signing", {
      offer: input.offerTitle,
      codeTail: input.code.slice(-4),
    })

    return {
      unavailableReason:
        "Wallet credentials detected but pass signing is not fully wired in this environment. Use Add to Home Screen.",
    }
  }
}

export function getWalletProvider(): WalletProvider {
  if (hasAppleWallet() || hasGoogleWallet()) return new PlatformWalletProvider()
  return new FallbackWalletProvider()
}

export function walletButtonsEnabled(): boolean {
  // Only show buttons when a real pass URL can be produced.
  // Credentials alone are not enough until signing is complete.
  return false
}
