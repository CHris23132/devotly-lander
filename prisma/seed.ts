import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("demo-password-change-me", 12)

  const user = await prisma.user.upsert({
    where: { email: "demo@devotly.app" },
    update: {},
    create: {
      email: "demo@devotly.app",
      name: "Demo Owner",
      passwordHash,
    },
  })

  const business = await prisma.business.upsert({
    where: { slug: "demo" },
    update: {
      name: "Harbor Burger Co.",
      subscriptionStatus: "active",
      industry: "restaurant",
      address: "100 King St W, Toronto, ON",
      phone: "+14165550100",
      timezone: "America/Toronto",
      brandColor: "#C41E3A",
      logoUrl: null,
    },
    create: {
      name: "Harbor Burger Co.",
      slug: "demo",
      industry: "restaurant",
      address: "100 King St W, Toronto, ON",
      phone: "+14165550100",
      websiteUrl: "https://example.com",
      timezone: "America/Toronto",
      brandColor: "#C41E3A",
      subscriptionStatus: "active",
    },
  })

  await prisma.businessMember.upsert({
    where: { businessId_userId: { businessId: business.id, userId: user.id } },
    update: { role: "owner" },
    create: { businessId: business.id, userId: user.id, role: "owner" },
  })

  await prisma.offer.deleteMany({ where: { businessId: business.id } })

  const offers = [
    {
      type: "buy_x_get_y" as const,
      title: "Buy one burger, get one free",
      terms: "Equal or lesser value. Dine-in or takeout. One coupon per visit. Not valid with other offers.",
      valueLabel: "BOGO Burger",
      buyX: 1,
      getY: 1,
      imageUrl: "/demo/burger.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      type: "free_item" as const,
      title: "Free medium fries with any sandwich",
      terms: "With purchase of any sandwich or burger. Present before ordering.",
      valueLabel: "Free fries",
      imageUrl: "/demo/fries.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      type: "two_person_deal" as const,
      title: "2 can breakfast for $12.99",
      terms: "Includes two breakfast sandwiches + two coffees. Before 11am. Bring a friend.",
      valueLabel: "Breakfast for two",
      imageUrl: "/demo/breakfast.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    },
    {
      type: "free_item" as const,
      title: "Free coffee with any breakfast",
      terms: "Any size hot coffee with a breakfast item. One per customer.",
      valueLabel: "Free coffee",
      imageUrl: "/demo/coffee.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    },
    {
      type: "amount_off" as const,
      title: "$2 off any dessert",
      terms: "Valid on soft serve, cookies, or pie. Cannot combine with combo pricing.",
      valueLabel: "$2 off dessert",
      amountOffCents: 200,
      imageUrl: "/demo/dessert.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    },
    {
      type: "percent_off" as const,
      title: "20% off salads & wraps",
      terms: "Valid on menu salads and wraps. Excludes combos.",
      valueLabel: "20% off",
      percentOff: 20,
      imageUrl: "/demo/salad.jpg",
      status: "active" as const,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const offer of offers) {
    await prisma.offer.create({
      data: {
        businessId: business.id,
        ...offer,
      },
    })
  }

  console.log("Seeded demo coupon book at /b/demo")
  console.log("Merchant login: demo@devotly.app / demo-password-change-me")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
