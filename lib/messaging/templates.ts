export type MergeFields = {
  first_name?: string | null
  business_name: string
  book_url: string
  top_offer: string
  expiry_date?: string | null
}

export function mergeTemplate(template: string, fields: MergeFields): string {
  return template
    .replaceAll("{first_name}", fields.first_name?.trim() || "")
    .replaceAll("{business_name}", fields.business_name)
    .replaceAll("{book_url}", fields.book_url)
    .replaceAll("{top_offer}", fields.top_offer)
    .replaceAll("{expiry_date}", fields.expiry_date || "")
    .replace(/\s{2,}/g, " ")
    .replace(/Hi ,/g, "Hi,")
    .trim()
}

export const DEFAULT_SMS_FIRST =
  "{business_name}: your coupon book is ready — deals picked for you, incl. {top_offer}. Open your book: {book_url} Reply STOP to end"

export const DEFAULT_SMS_MONTHLY =
  "Hi {first_name}, it's {business_name} — new month, your coupons are waiting, and {top_offer} ends {expiry_date}: {book_url} Reply STOP to end"

export const DEFAULT_SMS_MONTHLY_NO_NAME =
  "It's {business_name} — new month, your coupons are waiting, and {top_offer} ends {expiry_date}: {book_url} Reply STOP to end"

export function monthlySmsTemplate(hasName: boolean): string {
  return hasName ? DEFAULT_SMS_MONTHLY : DEFAULT_SMS_MONTHLY_NO_NAME
}

export function emailSubject(businessName: string): string {
  return `Your ${businessName} coupon book — this month's deals`
}

export function emailHtml(fields: MergeFields): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;background:#0B0B0C;color:#fff;padding:24px">
    <h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 12px">Your ${fields.business_name} coupon book</h1>
    <p style="color:#A1A1AA">This month's deals are ready${fields.first_name ? `, ${fields.first_name}` : ""}.</p>
    <p style="margin:20px 0"><strong>${fields.top_offer}</strong>${fields.expiry_date ? ` — ends ${fields.expiry_date}` : ""}</p>
    <a href="${fields.book_url}" style="display:inline-block;background:#C6F432;color:#0B0B0C;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:600">Open your book</a>
    <p style="color:#A1A1AA;font-size:12px;margin-top:28px">You can unsubscribe anytime: ${fields.book_url.replace("/my-book/", "/unsubscribe?token=")}</p>
  </div>`
}
