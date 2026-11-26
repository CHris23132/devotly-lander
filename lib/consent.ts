import type { ConsentType, Customer, Suppression } from "@prisma/client"
import { prisma } from "@/lib/prisma"

const TWO_YEARS_MS = 24 * 30 * 24 * 60 * 60 * 1000 // ~24 months

export type ConsentStatusLabel = "eligible" | "expiring" | "expired" | "opted_out" | "none"

export function computeImpliedExpiry(lastPurchaseAt: Date): Date {
  return new Date(lastPurchaseAt.getTime() + TWO_YEARS_MS)
}

export function refreshConsentFromPurchase(lastPurchaseAt: Date): {
  consentType: ConsentType
  consentExpiresAt: Date
  consentSource: string
} {
  return {
    consentType: "implied_purchase",
    consentExpiresAt: computeImpliedExpiry(lastPurchaseAt),
    consentSource: "purchase_history",
  }
}

export function getConsentLabel(customer: Pick<Customer, "consentType" | "consentExpiresAt" | "optedOutAt">, now = new Date()): ConsentStatusLabel {
  if (customer.optedOutAt) return "opted_out"
  if (customer.consentType === "none") return "none"
  if (customer.consentType === "express") return "eligible"
  if (!customer.consentExpiresAt) return "none"
  if (customer.consentExpiresAt.getTime() <= now.getTime()) return "expired"
  const sixtyDays = 60 * 24 * 60 * 60 * 1000
  if (customer.consentExpiresAt.getTime() - now.getTime() <= sixtyDays) return "expiring"
  return "eligible"
}

export function isConsentEligible(
  customer: Pick<Customer, "consentType" | "consentExpiresAt" | "optedOutAt" | "phone">,
  now = new Date(),
): boolean {
  if (customer.optedOutAt) return false
  if (!customer.phone) return false
  if (customer.consentType === "none") return false
  if (customer.consentType === "express") return true
  if (customer.consentType === "implied_purchase") {
    return Boolean(customer.consentExpiresAt && customer.consentExpiresAt.getTime() > now.getTime())
  }
  return false
}

/**
 * Shared send filter — used by first send, monthly job, blasts, referrals, reminders.
 * No send path may bypass this.
 */
export async function filterEligibleRecipients(businessId: string, customerIds?: string[]) {
  const customers = await prisma.customer.findMany({
    where: {
      businessId,
      ...(customerIds ? { id: { in: customerIds } } : {}),
    },
  })

  const suppressions = await prisma.suppression.findMany({
    where: {
      OR: [{ businessId }, { businessId: null }],
    },
  })

  const suppressedPhones = new Set(
    suppressions.filter((s): s is Suppression & { phone: string } => Boolean(s.phone)).map((s) => s.phone),
  )
  const suppressedEmails = new Set(
    suppressions.filter((s): s is Suppression & { email: string } => Boolean(s.email)).map((s) => s.email.toLowerCase()),
  )

  const now = new Date()
  const eligible = customers.filter((c) => {
    if (!isConsentEligible(c, now)) return false
    if (suppressedPhones.has(c.phone)) return false
    if (c.email && suppressedEmails.has(c.email.toLowerCase())) return false
    return true
  })

  return {
    eligible,
    suppressed: customers.length - eligible.length,
    total: customers.length,
  }
}

export async function optOutCustomer(businessId: string, phone: string, reason: "stop" | "unsubscribe" = "stop") {
  const customer = await prisma.customer.findUnique({
    where: { businessId_phone: { businessId, phone } },
  })

  if (customer && !customer.optedOutAt) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { optedOutAt: new Date() },
    })
  }

  await prisma.suppression.create({
    data: {
      businessId,
      phone,
      reason,
    },
  })
}
