import { hasTwilio } from "@/lib/config"
import { maskPhone } from "@/lib/phone"
import type { SendResult, SmsPayload, SmsProvider } from "@/lib/messaging/types"

class DryRunSmsProvider implements SmsProvider {
  configured = false

  async send(payload: SmsPayload): Promise<SendResult> {
    console.info("[sms:dry-run]", { to: maskPhone(payload.to), bodyPreview: payload.body.slice(0, 80) })
    return { provider: "dry-run", providerMessageId: null, status: "dry_run" }
  }
}

class TwilioSmsProvider implements SmsProvider {
  configured = true

  async send(payload: SmsPayload): Promise<SendResult> {
    const sid = process.env.TWILIO_ACCOUNT_SID!
    const token = process.env.TWILIO_AUTH_TOKEN!
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID
    const from = process.env.TWILIO_FROM_NUMBER

    const body = new URLSearchParams({ To: payload.to, Body: payload.body })
    if (messagingServiceSid) body.set("MessagingServiceSid", messagingServiceSid)
    else if (from) body.set("From", from)
    else throw new Error("Twilio from number or messaging service required")

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    const data = (await res.json()) as { sid?: string; message?: string }
    if (!res.ok) {
      console.error("[sms:twilio:fail]", { to: maskPhone(payload.to), error: data.message })
      return { provider: "twilio", providerMessageId: null, status: "failed", error: data.message }
    }

    return { provider: "twilio", providerMessageId: data.sid ?? null, status: "sent" }
  }
}

export function getSmsProvider(): SmsProvider {
  return hasTwilio() ? new TwilioSmsProvider() : new DryRunSmsProvider()
}
