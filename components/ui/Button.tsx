import Link from "next/link"

type Props = {
  href?: string
  children: React.ReactNode
  variant?: "lime" | "ghost" | "white" | "primary" | "secondary"
  className?: string
  type?: "button" | "submit"
  onClick?: () => void
  disabled?: boolean
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: Props) {
  const mapped =
    variant === "lime" || variant === "primary"
      ? "btn-primary"
      : variant === "ghost" || variant === "secondary"
        ? "btn-secondary"
        : "btn-white"
  const cls = `btn ${mapped} ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
