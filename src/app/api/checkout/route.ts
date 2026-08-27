import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { type, destination, bookingDetails, membershipTier, interval } = body;

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. VIP Membership Subscription / One-time Checkout
    if (type === "membership") {
      let unitAmount = 1900; // $19.00
      let tierTitle = "Hero Travel Globetrotter Membership";

      if (membershipTier === "blackcard") {
        unitAmount = interval === "annual" ? 49000 : 4900;
        tierTitle = `Black Card Elite Membership (${interval === "annual" ? "Annual" : "Monthly"})`;
      } else {
        unitAmount = interval === "annual" ? 19000 : 1900;
        tierTitle = `Globetrotter Club Membership (${interval === "annual" ? "Annual" : "Monthly"})`;
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: session?.user?.email || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: tierTitle,
                description: "Full access to Hero Travel VIP benefits, discounts & 24/7 concierge.",
                images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop"],
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "membership",
          userId: session?.user ? (session.user as any).id : "",
          membershipTier: membershipTier || "globetrotter",
          interval: interval || "monthly",
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=membership&tier=${membershipTier}`,
        cancel_url: `${origin}/pricing?canceled=true`,
      });

      return NextResponse.json({ success: true, url: checkoutSession.url });
    }

    // 2. Tour Package Reservation Checkout
    if (type === "tour" && destination && bookingDetails) {
      const guests = Number(bookingDetails.guestsCount) || 1;
      const basePrice = Number(destination.price) || 2950;
      let totalAmount = basePrice * guests;

      if (bookingDetails.addOns?.helicopterTour) totalAmount += 450 * guests;
      if (bookingDetails.addOns?.privateChef) totalAmount += 350 * guests;
      if (bookingDetails.addOns?.travelInsurance) totalAmount += 120 * guests;

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: bookingDetails.customerEmail || session?.user?.email || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${destination.title} (${destination.durationDays} Days)`,
                description: `Departure: ${bookingDetails.travelDate} | Travelers: ${guests} Guest(s)`,
                images: [destination.heroImage],
              },
              unit_amount: Math.round(totalAmount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "tour",
          userId: session?.user ? (session.user as any).id : "",
          destinationId: destination._id || destination.slug,
          destinationTitle: destination.title,
          destinationSlug: destination.slug,
          destinationImage: destination.heroImage,
          travelDate: bookingDetails.travelDate,
          guestsCount: guests.toString(),
          customerName: bookingDetails.customerName,
          customerEmail: bookingDetails.customerEmail,
          customerPhone: bookingDetails.customerPhone || "",
          specialRequests: bookingDetails.specialRequests || "",
          helicopterTour: bookingDetails.addOns?.helicopterTour ? "true" : "false",
          privateChef: bookingDetails.addOns?.privateChef ? "true" : "false",
          travelInsurance: bookingDetails.addOns?.travelInsurance ? "true" : "false",
        },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=tour&slug=${destination.slug}`,
        cancel_url: `${origin}/destinations/${destination.slug}?canceled=true`,
      });

      return NextResponse.json({ success: true, url: checkoutSession.url });
    }

    return NextResponse.json(
      { success: false, error: "Invalid checkout request parameters" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Stripe Checkout Session error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
