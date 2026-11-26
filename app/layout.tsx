import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Devotly — AI Operator for Shopify retention",
  description:
    "Devotly finds revenue left on the table, runs personalized retention campaigns within your guardrails, and layers on loyalty plus a done-for-you native app.",
  icons: {
    icon: [{ url: "/exec-041ce204-f4b5-4fd7-8227-6b8a0188fffc.png", type: "image/png" }],
    apple: [{ url: "/exec-041ce204-f4b5-4fd7-8227-6b8a0188fffc.png" }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
