import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, destination, guests, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    try {
      await resend.emails.send({
        from: "Hero Travel Concierge <onboarding@resend.dev>",
        to: email,
        subject: `Inquiry Received: Bespoke Journey for ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #0F172A; max-width: 500px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px;">
            <h2 style="color: #EA580C;">Thank you for contacting Hero Travel</h2>
            <p>Dear ${name},</p>
            <p>Our senior expedition curator has received your inquiry regarding <strong>${destination || "a bespoke journey"}</strong>.</p>
            <p style="background: #F8FAFC; padding: 12px; border-radius: 6px; font-style: italic; color: #475569;">"${message}"</p>
            <p>We typically respond within 2-4 business hours with a custom concept brief.</p>
          </div>
        `,
      });
    } catch (e: any) {
      console.warn("Resend contact inquiry notice:", e?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received. Our concierge will be in touch shortly.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Inquiry submission failed" }, { status: 500 });
  }
}
