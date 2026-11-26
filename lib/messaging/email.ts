import { hasSendGrid } from "@/lib/config"
import type { EmailPayload, EmailProvider, SendResult } from "@/lib/messaging/types"

class DryRunEmailProvider implements EmailProvider {
  configured = false

  async send(payload: EmailPayload): Promise<SendResult> {
    console.info("[email:dry-run]", { to: payload.to, subject: payload.subject })
    return { provider: "dry-run", providerMessageId: null, status: "dry_run" }
  }
}

class SendGridEmailProvider implements EmailProvider {
  configured = true

  async send(payload: EmailPayload): Promise<SendResult> {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: process.env.SENDGRID_FROM_NAME || "Devotly Coupon Book",
        },
        subject: payload.subject,
        content: [
          { type: "text/plain", value: payload.text },
          { type: "text/html", value: payload.html },
        ],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("[email:sendgrid:fail]", { to: payload.to, error: text.slice(0, 200) })
      return { provider: "sendgrid", providerMessageId: null, status: "failed", error: text.slice(0, 200) }
    }

    return {
      provider: "sendgrid",
      providerMessageId: res.headers.get("x-message-id"),
      status: "sent",
    }
  }
}

export function getEmailProvider(): EmailProvider {
  return hasSendGrid() ? new SendGridEmailProvider() : new DryRunEmailProvider()
}
