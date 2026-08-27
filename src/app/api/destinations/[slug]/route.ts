import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { INITIAL_DESTINATIONS } from "@/lib/seed-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    let destination = await Destination.findOne({ slug });

    if (!destination) {
      // Fallback search in seed data
      const seedMatch = INITIAL_DESTINATIONS.find((d) => d.slug === slug);
      if (seedMatch) {
        return NextResponse.json({ success: true, destination: seedMatch });
      }
      return NextResponse.json(
        { success: false, error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, destination });
  } catch (error: any) {
    console.error("Destination slug fetch error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch destination" },
      { status: 500 }
    );
  }
}
