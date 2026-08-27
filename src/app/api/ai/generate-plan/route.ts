import { NextRequest, NextResponse } from "next/server";
import { generateAITripItinerary } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, durationDays, travelStyle, budgetLevel, partyType, interests } = body;

    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Please provide a destination" },
        { status: 400 }
      );
    }

    const plan = await generateAITripItinerary({
      destination: destination.trim(),
      durationDays: Number(durationDays) || 5,
      travelStyle: travelStyle || "Luxury Cultural & Leisure",
      budgetLevel: budgetLevel || "Premium Luxury ($$$$)",
      partyType: partyType || "Romantic Couple",
      interests: interests || [],
    });

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate itinerary with AI" },
      { status: 500 }
    );
  }
}
