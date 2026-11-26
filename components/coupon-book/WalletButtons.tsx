"use client"

type Props = {
  claimHref: string
  className?: string
}

/** Official-looking wallet CTAs. On the public book they route through claim first. */
export function WalletButtons({ claimHref, className = "" }: Props) {
  return (
    <div className={`wallet-btn-row ${className}`}>
      <a href={claimHref} className="wallet-btn" aria-label="Add to Apple Wallet">
        <AppleWalletGlyph />
        <span className="leading-tight text-left">
          <span className="block text-[9px] font-normal opacity-80">Add to</span>
          Apple Wallet
        </span>
      </a>
      <a href={claimHref} className="wallet-btn" aria-label="Add to Google Wallet">
        <GoogleWalletGlyph />
        <span className="leading-tight text-left">
          <span className="block text-[9px] font-normal opacity-80">Add to</span>
          Google Wallet
        </span>
      </a>
    </div>
  )
}

function AppleWalletGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#fff" />
      <path d="M2 9h20" stroke="#111" strokeWidth="1.2" />
      <path
        d="M6 14.5c1.2-1.6 3.2-1.6 4.2 0 1-1.6 3-1.6 4.2 0"
        stroke="#111"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="6.8" r="0.9" fill="#111" />
    </svg>
  )
}

function GoogleWalletGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v2.2l-8.2 2.7L3 8.3V7.5Z" />
      <path fill="#34A853" d="M3 8.5 12 12l9-3v8.5A2.5 2.5 0 0 1 18.5 20H5.5A2.5 2.5 0 0 1 3 17.5V8.5Z" />
      <path fill="#FBBC04" d="M12 12 3 8.5v9A2.5 2.5 0 0 0 5.5 20H12V12Z" opacity=".9" />
      <path fill="#EA4335" d="M12 12v8h6.5A2.5 2.5 0 0 0 21 17.5v-9L12 12Z" opacity=".95" />
    </svg>
  )
}
