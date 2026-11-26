"use client"

import { useEffect, useRef } from "react"

export default function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (!document.documentElement.classList.contains("motion")) {
      node.classList.add("is-in")
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-in")
            observer.disconnect()
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
