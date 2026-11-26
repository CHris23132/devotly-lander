import type { Industry, OfferType } from "@prisma/client"

export type TemplateOffer = {
  type: OfferType
  title: string
  terms: string
  valueLabel: string
  percentOff?: number
  amountOffCents?: number
  buyX?: number
  getY?: number
}

export const INDUSTRY_LABELS: Record<Industry, string> = {
  restaurant: "Restaurant / cafe / bakery",
  salon: "Nail / hair salon / barber",
  med_spa: "Med spa / aesthetics",
  golf_entertainment: "Golf simulator / entertainment",
  retail: "Retail / products",
  services: "General services",
  other: "Other",
}

export const INDUSTRY_TEMPLATES: Record<Industry, TemplateOffer[]> = {
  restaurant: [
    {
      type: "two_person_deal",
      title: "2 can dine for $49",
      terms: "Valid for two guests. Dine-in only. Excludes alcohol. One per table.",
      valueLabel: "2 can dine for $49",
      amountOffCents: 0,
    },
    {
      type: "free_item",
      title: "Free appetizer with any entrée",
      terms: "One free appetizer with purchase of an entrée. Dine-in.",
      valueLabel: "Free appetizer",
    },
    {
      type: "percent_off",
      title: "15% off your next visit",
      terms: "Valid on food. Cannot combine with other offers.",
      valueLabel: "15% off",
      percentOff: 15,
    },
  ],
  salon: [
    {
      type: "two_person_deal",
      title: "Better price for two — bring a friend",
      terms: "Book two services together and save. New or existing clients.",
      valueLabel: "Bring a friend deal",
    },
    {
      type: "percent_off",
      title: "20% off your second visit",
      terms: "Valid within 60 days of first visit.",
      valueLabel: "20% off second visit",
      percentOff: 20,
    },
  ],
  med_spa: [
    {
      type: "percent_off",
      title: "15% off a treatment",
      terms: "Book any single treatment. Consultation required.",
      valueLabel: "15% off treatment",
      percentOff: 15,
    },
    {
      type: "free_item",
      title: "Free add-on with a booked service",
      terms: "Choose one eligible add-on with a paid service.",
      valueLabel: "Free add-on",
    },
  ],
  golf_entertainment: [
    {
      type: "buy_x_get_y",
      title: "Free hour with a booked hour",
      terms: "Book one hour, get the next free. Off-peak hours only.",
      valueLabel: "Buy 1 hour, get 1 free",
      buyX: 1,
      getY: 1,
    },
    {
      type: "amount_off",
      title: "Off-peak deal — $20 off",
      terms: "Valid Mon–Thu before 5pm.",
      valueLabel: "$20 off",
      amountOffCents: 2000,
    },
  ],
  retail: [
    {
      type: "percent_off",
      title: "15% off your next purchase",
      terms: "In-store only. Excludes sale items.",
      valueLabel: "15% off",
      percentOff: 15,
    },
    {
      type: "buy_x_get_y",
      title: "Buy 2 get 1",
      terms: "Lowest-priced item free. Same visit.",
      valueLabel: "Buy 2 get 1",
      buyX: 2,
      getY: 1,
    },
    {
      type: "free_item",
      title: "Gift with $75 purchase",
      terms: "Receive a complimentary gift when you spend $75+",
      valueLabel: "Gift with purchase",
    },
  ],
  services: [
    {
      type: "amount_off",
      title: "$25 off a service",
      terms: "Valid on services $100+. First-time or returning clients.",
      valueLabel: "$25 off",
      amountOffCents: 2500,
    },
    {
      type: "free_item",
      title: "Free consultation add-on",
      terms: "Complimentary consultation with a booked service.",
      valueLabel: "Free consultation",
    },
  ],
  other: [
    {
      type: "percent_off",
      title: "10% off your next visit",
      terms: "Valid for one visit. Cannot combine with other offers.",
      valueLabel: "10% off",
      percentOff: 10,
    },
    {
      type: "two_person_deal",
      title: "Bring a friend — better together",
      terms: "Two-person deal. Introduce someone new and you both save.",
      valueLabel: "Bring a friend",
    },
  ],
}
