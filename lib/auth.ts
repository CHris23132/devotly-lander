import { cookies } from "next/headers"
import { createHash, randomBytes } from "node:crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireEnv } from "@/lib/config"

const SESSION_COOKIE = "devotly_session"
const SESSION_DAYS = 30

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url")
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  })

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })

  // Touch SESSION_SECRET so deployers know it must be set even though we hash the cookie value.
  void requireEnv("SESSION_SECRET")

  return token
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } })
  }
  jar.delete(SESSION_COOKIE)
}

export async function getCurrentUser() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: {
      user: {
        include: {
          memberships: {
            include: { business: true },
          },
        },
      },
    },
  })

  if (!session || session.expiresAt.getTime() < Date.now()) {
    if (session) await prisma.session.delete({ where: { id: session.id } })
    return null
  }

  return session.user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error("UNAUTHORIZED")
  return user
}

export async function requireBusinessAccess(businessId: string) {
  const user = await requireUser()
  const membership = user.memberships.find((m) => m.businessId === businessId)
  if (!membership) throw new Error("FORBIDDEN")
  return { user, membership, business: membership.business }
}

export async function getPrimaryBusinessForUser(userId: string) {
  const membership = await prisma.businessMember.findFirst({
    where: { userId },
    include: { business: true },
    orderBy: { createdAt: "asc" },
  })
  return membership?.business ?? null
}
