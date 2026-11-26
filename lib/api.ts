import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init)
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status })
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError("Invalid request", 400, { issues: error.issues })
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return jsonError("Unauthorized", 401)
    if (error.message === "FORBIDDEN") return jsonError("Forbidden", 403)
    if (
      [
        "OFFER_NOT_FOUND",
        "LIMIT_REACHED",
        "INVALID_PHONE",
        "SELF_REFERRAL",
        "ALREADY_CUSTOMER",
        "DUPLICATE_REFERRAL",
        "MONTHLY_CAP",
        "STRIPE_NOT_CONFIGURED",
      ].includes(error.message)
    ) {
      return jsonError(error.message, 400)
    }
  }
  console.error(error)
  return jsonError("Internal server error", 500)
}
