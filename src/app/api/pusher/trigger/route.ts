import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { channel = "hero-travel-channel", event = "new-activity", data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    await pusherServer.trigger(channel, event, data);

    return NextResponse.json({ success: true, message: "Event broadcasted" });
  } catch (error: any) {
    console.error("Pusher trigger error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to trigger event" },
      { status: 500 }
    );
  }
}
