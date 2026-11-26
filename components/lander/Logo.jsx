"use client"

export default function Logo({ className = "", invert = false }) {
  return (
    <a href="/" className={`inline-flex items-center ${className}`} aria-label="Devotly, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/exec-9e96665c-3fde-4718-9b7b-7d99fa863738.png"
        alt="Devotly"
        className={`h-8 w-auto object-contain sm:h-9 ${invert ? "brightness-0 invert" : ""}`}
      />
    </a>
  )
}
