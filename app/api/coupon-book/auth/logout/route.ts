import { destroySession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  await destroySession()
  return NextResponse.redirect(new URL("/coupon-book", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
}
