import * as cheerio from "cheerio"
import type { Industry } from "@prisma/client"
import { INDUSTRY_TEMPLATES } from "@/lib/industry-templates"

const MAX_PAGES = 15
const TIMEOUT_MS = 20_000
const USER_AGENT = "DevotlyCouponBookBot/1.0 (+https://devotly.app/coupon-book; website-import)"

export type ExtractedItem = {
  name: string
  description?: string
  priceCents?: number
  imageUrl?: string
  sourceUrl: string
}

export type ImportResult = {
  businessName?: string
  logoUrl?: string
  items: ExtractedItem[]
  pagesCrawled: number
  draftOffers: ReturnType<typeof draftsFromItems>
  error?: string
}

function absoluteUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).toString()
  } catch {
    return null
  }
}

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
    })
    if (!res.ok) return null
    const type = res.headers.get("content-type") || ""
    if (!type.includes("text/html") && !type.includes("application/xhtml")) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function robotsAllows(origin: string, path: string): Promise<boolean> {
  const robotsUrl = `${origin}/robots.txt`
  const text = await fetchText(robotsUrl)
  if (!text) return true
  // Minimal robots respect: if Disallow: / for * , skip.
  const lines = text.split("\n").map((l) => l.trim())
  let applies = false
  for (const line of lines) {
    if (/^user-agent:\s*\*/i.test(line)) applies = true
    else if (/^user-agent:/i.test(line)) applies = false
    else if (applies && /^disallow:\s*\/\s*$/i.test(line)) return path === "/" ? true : false
  }
  void path
  return true
}

function parsePriceToCents(text: string): number | undefined {
  const match = text.replace(",", "").match(/\$?\s*(\d+(?:\.\d{1,2})?)/)
  if (!match) return undefined
  return Math.round(Number(match[1]) * 100)
}

function extractFromHtml(url: string, html: string): { name?: string; logoUrl?: string; items: ExtractedItem[] } {
  const $ = cheerio.load(html)
  const items: ExtractedItem[] = []

  const jsonLd = $('script[type="application/ld+json"]')
  jsonLd.each((_, el) => {
    try {
      const data = JSON.parse($(el).text()) as Record<string, unknown> | Record<string, unknown>[]
      const nodes = Array.isArray(data) ? data : [data]
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue
        const type = String(node["@type"] ?? "")
        if (type.includes("Product") || type.includes("MenuItem") || type.includes("Service")) {
          const name = String(node.name ?? "")
          if (!name) continue
          const offers = node.offers as { price?: string | number } | undefined
          const price = offers?.price != null ? parsePriceToCents(String(offers.price)) : undefined
          items.push({
            name,
            description: node.description ? String(node.description) : undefined,
            priceCents: price,
            imageUrl: typeof node.image === "string" ? node.image : undefined,
            sourceUrl: url,
          })
        }
      }
    } catch {
      // ignore bad JSON-LD
    }
  })

  // Fallback: common menu/price patterns — only keep text that looks like a priced item.
  if (items.length === 0) {
    $("li, .menu-item, .product, article").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim()
      if (text.length < 4 || text.length > 120) return
      if (!/\$|\d+\.\d{2}/.test(text)) return
      const priceCents = parsePriceToCents(text)
      const name = text.replace(/\$?\s*\d+(?:\.\d{1,2})?/, "").trim()
      if (!name) return
      items.push({ name: name.slice(0, 80), priceCents, sourceUrl: url })
    })
  }

  const ogTitle = $('meta[property="og:title"]').attr("content") || $("title").first().text()
  const ogImage = $('meta[property="og:image"]').attr("content")
  const icon = $('link[rel="icon"]').attr("href") || $('link[rel="apple-touch-icon"]').attr("href")

  return {
    name: ogTitle?.trim() || undefined,
    logoUrl: ogImage || (icon ? absoluteUrl(url, icon) || undefined : undefined),
    items: items.slice(0, 40),
  }
}

function draftsFromItems(items: ExtractedItem[], industry: Industry) {
  const templates = INDUSTRY_TEMPLATES[industry] ?? INDUSTRY_TEMPLATES.other
  return items.slice(0, 8).map((item, index) => {
    const template = templates[index % templates.length]!
    return {
      ...template,
      title: template.type === "percent_off" ? `${template.percentOff ?? 10}% off ${item.name}` : `${template.title}: ${item.name}`,
      catalogName: item.name,
      sourceUrl: item.sourceUrl,
      priceCents: item.priceCents,
    }
  })
}

export async function importWebsite(sourceUrl: string, industry: Industry = "other"): Promise<ImportResult> {
  let start: URL
  try {
    start = new URL(sourceUrl)
  } catch {
    return { items: [], pagesCrawled: 0, draftOffers: [], error: "Invalid URL" }
  }

  if (!(await robotsAllows(start.origin, start.pathname))) {
    return {
      items: [],
      pagesCrawled: 0,
      draftOffers: [],
      error: "Crawl blocked by robots.txt — build your book manually with industry templates.",
    }
  }

  const queue = [start.toString()]
  const seen = new Set<string>()
  const allItems: ExtractedItem[] = []
  let businessName: string | undefined
  let logoUrl: string | undefined
  let pagesCrawled = 0

  while (queue.length && pagesCrawled < MAX_PAGES) {
    const url = queue.shift()!
    if (seen.has(url)) continue
    seen.add(url)

    const html = await fetchText(url)
    if (!html) {
      if (pagesCrawled === 0) {
        return {
          items: [],
          pagesCrawled: 0,
          draftOffers: [],
          error: "Site unreachable — build your book manually with industry templates.",
        }
      }
      continue
    }

    pagesCrawled += 1
    const extracted = extractFromHtml(url, html)
    businessName ||= extracted.name
    logoUrl ||= extracted.logoUrl
    allItems.push(...extracted.items)

    const $ = cheerio.load(html)
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")
      if (!href) return
      const abs = absoluteUrl(url, href)
      if (!abs || !abs.startsWith(start.origin)) return
      const lower = abs.toLowerCase()
      if (!/(menu|service|product|shop|treat|price|offer)/.test(lower) && pagesCrawled > 0) return
      if (!seen.has(abs) && queue.length + seen.size < MAX_PAGES * 2) queue.push(abs)
    })
  }

  // Deduplicate by name
  const unique = new Map<string, ExtractedItem>()
  for (const item of allItems) {
    const key = item.name.toLowerCase()
    if (!unique.has(key)) unique.set(key, item)
  }
  const items = [...unique.values()]

  if (items.length === 0) {
    return {
      businessName,
      logoUrl,
      items: [],
      pagesCrawled,
      draftOffers: [],
      error: "No extractable items found — build manually with industry templates.",
    }
  }

  return {
    businessName,
    logoUrl,
    items,
    pagesCrawled,
    draftOffers: draftsFromItems(items, industry),
  }
}
