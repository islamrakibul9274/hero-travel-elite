import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    try {
      await resend.emails.send({
        from: "Hero Travel <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Hero Travel Private Horizon Dispatches",
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #0F172A; max-width: 500px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px;">
            <h2 style="color: #EA580C;">Welcome to Hero Travel Curation</h2>
            <p>You're now subscribed to our private horizon dispatches, secret expedition announcements, and members-only flash privileges.</p>
            <p style="margin-top: 20px; font-size: 13px; color: #64748B;">Hero Travel Editorial Desk — 2026</p>
          </div>
        `,
      });
    } catch (e: any) {
      console.warn("Resend newsletter dispatch notice:", e?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to private dispatches",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Subscription failed" }, { status: 500 });
  }
}
