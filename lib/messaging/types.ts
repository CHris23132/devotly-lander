export type SmsPayload = {
  to: string
  body: string
}

export type EmailPayload = {
  to: string
  subject: string
  html: string
  text: string
}

export type SendResult = {
  provider: string
  providerMessageId: string | null
  status: "sent" | "dry_run" | "failed"
  error?: string
}

export interface SmsProvider {
  send(payload: SmsPayload): Promise<SendResult>
  configured: boolean
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<SendResult>
  configured: boolean
}
