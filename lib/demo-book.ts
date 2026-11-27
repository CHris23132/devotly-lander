import type { BookBusiness, BookOffer } from "@/components/coupon-book/CouponBookView"

const day = 24 * 60 * 60 * 1000

export const DEMO_BUSINESS: BookBusiness = {
  name: "Harbor Burger Co.",
  slug: "demo",
  address: "100 King St W, Toronto, ON",
  phone: "+14165550100",
  logoUrl: null,
  brandColor: "#C41E3A",
}

export const DEMO_OFFERS: BookOffer[] = [
  {
    id: "demo-burger",
    title: "Buy one burger, get one free",
    terms: "Equal or lesser value. Dine-in or takeout. One coupon per visit. Not valid with other offers.",
    valueLabel: "BOGO Burger",
    imageUrl: "/demo/burger.jpg",
    expiresAt: new Date(Date.now() + 45 * day),
    type: "buy_x_get_y",
  },
  {
    id: "demo-fries",
    title: "Free medium fries with any sandwich",
    terms: "With purchase of any sandwich or burger. Present before ordering.",
    valueLabel: "Free fries",
    imageUrl: "/demo/fries.jpg",
    expiresAt: new Date(Date.now() + 30 * day),
    type: "free_item",
  },
  {
    id: "demo-breakfast",
    title: "2 can breakfast for $12.99",
    terms: "Includes two breakfast sandwiches + two coffees. Before 11am. Bring a friend.",
    valueLabel: "Breakfast for two",
    imageUrl: "/demo/breakfast.jpg",
    expiresAt: new Date(Date.now() + 40 * day),
    type: "two_person_deal",
  },
  {
    id: "demo-coffee",
    title: "Free coffee with any breakfast",
    terms: "Any size hot coffee with a breakfast item. One per customer.",
    valueLabel: "Free coffee",
    imageUrl: "/demo/coffee.jpg",
    expiresAt: new Date(Date.now() + 35 * day),
    type: "free_item",
  },
  {
    id: "demo-dessert",
    title: "$2 off any dessert",
    terms: "Valid on soft serve, cookies, or pie. Cannot combine with combo pricing.",
    valueLabel: "$2 off dessert",
    imageUrl: "/demo/dessert.jpg",
    expiresAt: new Date(Date.now() + 50 * day),
    type: "amount_off",
  },
  {
    id: "demo-salad",
    title: "20% off salads & wraps",
    terms: "Valid on menu salads and wraps. Excludes combos.",
    valueLabel: "20% off",
    imageUrl: "/demo/salad.jpg",
    expiresAt: new Date(Date.now() + 60 * day),
    type: "percent_off",
  },
]

export function getStaticDemoBook() {
  return { business: DEMO_BUSINESS, offers: DEMO_OFFERS }
}
