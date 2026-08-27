import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia" as any,
  appInfo: {
    name: "Hero Travel Platform",
    version: "2.0.0",
  },
});

export const STRIPE_MEMBERSHIP_TIERS = {
  globetrotter: {
    name: "Globetrotter Club",
    priceMonthly: 19,
    priceAnnual: 190,
    features: [
      "10% discount on all luxury packages",
      "Unlimited AI Travel Architect itinerary generation",
      "Priority 48-hour booking window",
      "Dedicated member concierge email",
      "Complimentary airport lounge passes (2/yr)",
    ],
  },
  blackcard: {
    name: "Black Card Elite",
    priceMonthly: 49,
    priceAnnual: 490,
    features: [
      "20% discount on all luxury packages",
      "24/7 Dedicated WhatsApp Private Travel Butler",
      "Complimentary luxury airport private transfers",
      "Free date rescheduling & flexible cancellation",
      "VIP room upgrades & complimentary champagne",
      "Exclusive invitation-only secret expeditions",
    ],
  },
};
