import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { stripe } from "@/lib/stripe";
import { pusherServer } from "@/lib/pusher";
import { sendBookingConfirmationEmail } from "@/lib/resend";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { sessionId } = body;

    if (sessionId) {
      // Verify with Stripe
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (!stripeSession || stripeSession.payment_status !== "paid") {
        return NextResponse.json(
          { success: false, error: "Payment not completed" },
          { status: 400 }
        );
      }

      const meta = stripeSession.metadata;

      // If Membership purchase
      if (meta?.type === "membership") {
        const userId = meta.userId || (session?.user ? (session.user as any).id : null);
        if (userId) {
          try {
            await connectToDatabase();
            await User.findByIdAndUpdate(userId, {
              membershipTier: meta.membershipTier,
              $inc: { loyaltyPoints: meta.membershipTier === "blackcard" ? 1000 : 500 },
            });
          } catch (e) {
            const memUser = memoryStore.users.find((u) => u.id === userId);
            if (memUser) {
              memUser.membershipTier = meta.membershipTier;
              memUser.loyaltyPoints += meta.membershipTier === "blackcard" ? 1000 : 500;
            }
          }
        }

        // Broadcast live membership update
        try {
          await pusherServer.trigger("hero-travel-channel", "new-activity", {
            type: "membership",
            title: `A traveler just joined ${meta.membershipTier === "blackcard" ? "Black Card Elite" : "Globetrotter Club"}`,
            time: "Just now",
            location: "Global Member",
          });
        } catch (e) {
          console.warn("Pusher trigger warning:", e);
        }

        return NextResponse.json({
          success: true,
          type: "membership",
          tier: meta.membershipTier,
        });
      }

      // If Tour purchase
      if (meta?.type === "tour") {
        const totalAmount = Number(stripeSession.amount_total) / 100;
        const guests = Number(meta.guestsCount) || 1;

        const newBookingData = {
          _id: "bk-" + Math.random().toString(36).substring(2, 9),
          bookingReference: "HT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          userId: meta.userId || (session?.user ? (session.user as any).id : undefined),
          customerName: meta.customerName || stripeSession.customer_details?.name || "Traveler",
          customerEmail: meta.customerEmail || stripeSession.customer_details?.email || "guest@herotravel.com",
          customerPhone: meta.customerPhone || "",
          destinationId: meta.destinationId,
          destinationTitle: meta.destinationTitle,
          destinationSlug: meta.destinationSlug,
          destinationImage: meta.destinationImage,
          travelDate: meta.travelDate,
          guestsCount: guests,
          pricePerGuest: Math.round(totalAmount / guests),
          totalPrice: totalAmount,
          status: "confirmed",
          paymentStatus: "paid",
          stripeSessionId: sessionId,
          createdAt: new Date(),
        };

        try {
          await connectToDatabase();
          const existingBooking = await Booking.findOne({ stripeSessionId: sessionId });
          if (existingBooking) {
            return NextResponse.json({ success: true, booking: existingBooking });
          }
          const createdBooking = await Booking.create(newBookingData);
          if (meta.userId) {
            await User.findByIdAndUpdate(meta.userId, {
              $inc: { tripsCount: 1, loyaltyPoints: Math.round(totalAmount * 0.1) },
            });
          }
          return NextResponse.json({ success: true, booking: createdBooking });
        } catch (dbErr) {
          memoryStore.bookings.unshift(newBookingData as any);
        }

        // Broadcast real-time booking event via Pusher
        try {
          await pusherServer.trigger("hero-travel-channel", "new-activity", {
            type: "booking",
            title: `${meta.customerName.split(" ")[0]} booked ${meta.destinationTitle}`,
            time: "Just now",
            location: meta.destinationTitle.split(" ")[0],
          });
        } catch (e) {
          console.warn("Pusher trigger warning:", e);
        }

        // Send Email via Resend
        await sendBookingConfirmationEmail({
          toEmail: newBookingData.customerEmail,
          customerName: newBookingData.customerName,
          bookingReference: newBookingData.bookingReference,
          destinationTitle: newBookingData.destinationTitle,
          travelDate: newBookingData.travelDate,
          guestsCount: newBookingData.guestsCount,
          totalPrice: newBookingData.totalPrice,
        });

        return NextResponse.json({ success: true, booking: newBookingData });
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid booking request" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Booking handler error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Booking processing failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: true, bookings: [] });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();

    try {
      await connectToDatabase();
      const bookings = await Booking.find({
        $or: [{ userId }, { customerEmail: userEmail }],
      }).sort({ createdAt: -1 });

      if (bookings.length) {
        return NextResponse.json({ success: true, bookings });
      }
    } catch (e) {
      console.warn("MongoDB bookings fetch fallback to memory store");
    }

    const memBookings = memoryStore.bookings.filter(
      (b) => b.userId === userId || (userEmail && b.customerEmail.toLowerCase() === userEmail)
    );

    return NextResponse.json({ success: true, bookings: memBookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
