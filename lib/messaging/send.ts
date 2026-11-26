import type { CampaignType } from "@prisma/client"
import { appConfig } from "@/lib/config"
import { filterEligibleRecipients } from "@/lib/consent"
import { createPersonalBookToken, hashToken } from "@/lib/codes"
import { prisma } from "@/lib/prisma"
import { getEmailProvider } from "@/lib/messaging/email"
import { getSmsProvider } from "@/lib/messaging/sms"
import {
  DEFAULT_SMS_FIRST,
  emailHtml,
  emailSubject,
  mergeTemplate,
  monthlySmsTemplate,
} from "@/lib/messaging/templates"
import { isWithinQuietHours, nextQuietWindow } from "@/lib/messaging/quiet-hours"

async function ensurePersonalBookUrl(customerId: string, existingHash: string | null) {
  if (existingHash) {
    // Token is opaque to us once hashed; use a signed path via customer id for admin resends only when we rotate.
  }
  const { token, hash } = createPersonalBookToken()
  await prisma.customer.update({
    where: { id: customerId },
    data: { personalBookTokenHash: hash },
  })
  return `${appConfig.appUrl}/my-book/${token}`
}

export async function sendCampaignToEligible(params: {
  businessId: string
  type: CampaignType
  customerIds?: string[]
  templateSms?: string
  templateEmailSubject?: string
  dryRunForce?: boolean
}) {
  const business = await prisma.business.findUniqueOrThrow({ where: { id: params.businessId } })
  const { eligible } = await filterEligibleRecipients(params.businessId, params.customerIds)

  const topOffer = await prisma.offer.findFirst({
    where: { businessId: params.businessId, status: "active" },
    orderBy: { expiresAt: "asc" },
  })

  const campaign = await prisma.campaign.create({
    data: {
      businessId: params.businessId,
      type: params.type,
      templateSms: params.templateSms ?? DEFAULT_SMS_FIRST,
      templateEmail: params.templateEmailSubject ?? emailSubject(business.name),
      recipientCount: eligible.length,
      scheduledAt: new Date(),
    },
  })

  const sms = getSmsProvider()
  const email = getEmailProvider()
  const results = { sent: 0, dryRun: 0, suppressed: 0, failed: 0, queuedQuiet: 0 }

  for (const customer of eligible) {
    const uniqueSmsKey = `${campaign.id}:${customer.id}:sms`
    const uniqueEmailKey = `${campaign.id}:${customer.id}:email`

    const existing = await prisma.messageLog.findUnique({ where: { uniqueKey: uniqueSmsKey } })
    if (existing) continue

    if (!isWithinQuietHours(new Date(), business.timezone, business.quietHoursStart, business.quietHoursEnd)) {
      // Queue conceptually by scheduling at next window; for now mark queued and skip immediate send.
      await prisma.messageLog.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          campaignId: campaign.id,
          channel: "sms",
          provider: sms.configured ? "twilio" : "dry-run",
          status: "queued",
          uniqueKey: uniqueSmsKey,
          bodySnapshot: `queued until ${nextQuietWindow(new Date(), business.timezone, business.quietHoursStart).toISOString()}`,
        },
      })
      results.queuedQuiet += 1
      continue
    }

    const bookUrl = await ensurePersonalBookUrl(customer.id, customer.personalBookTokenHash)
    const fields = {
      first_name: customer.firstName,
      business_name: business.name,
      book_url: bookUrl,
      top_offer: topOffer?.title ?? "your deals",
      expiry_date: topOffer?.expiresAt?.toLocaleDateString("en-CA") ?? null,
    }

    const smsBody =
      params.type === "monthly"
        ? mergeTemplate(monthlySmsTemplate(Boolean(customer.firstName?.trim())), fields)
        : mergeTemplate(params.templateSms ?? DEFAULT_SMS_FIRST, fields)

    const smsResult = await sms.send({ to: customer.phone, body: smsBody })
    await prisma.messageLog.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        campaignId: campaign.id,
        channel: "sms",
        provider: smsResult.provider,
        providerMessageId: smsResult.providerMessageId,
        status: smsResult.status === "sent" ? "sent" : smsResult.status === "dry_run" ? "dry_run" : "failed",
        uniqueKey: uniqueSmsKey,
        bodySnapshot: smsBody,
      },
    })

    if (smsResult.status === "sent") results.sent += 1
    else if (smsResult.status === "dry_run") results.dryRun += 1
    else results.failed += 1

    if (customer.email) {
      const subject = emailSubject(business.name)
      const html = emailHtml(fields)
      const emailResult = await email.send({
        to: customer.email,
        subject,
        html,
        text: smsBody,
      })
      await prisma.messageLog.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          campaignId: campaign.id,
          channel: "email",
          provider: emailResult.provider,
          providerMessageId: emailResult.providerMessageId,
          status:
            emailResult.status === "sent" ? "sent" : emailResult.status === "dry_run" ? "dry_run" : "failed",
          uniqueKey: uniqueEmailKey,
          bodySnapshot: subject,
        },
      })
    }
  }

  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { sentAt: new Date(), recipientCount: eligible.length },
  })

  // Touch hashToken to keep import used if token rotation paths expand.
  void hashToken

  return { campaignId: campaign.id, eligible: eligible.length, results, messagingConfigured: sms.configured || email.configured }
}
