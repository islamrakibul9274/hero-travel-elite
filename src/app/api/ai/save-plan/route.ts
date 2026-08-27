import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import TripPlan from "@/models/TripPlan";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { destination, durationDays, travelStyle, budgetLevel, partyType, itinerary, estimatedCost, packingEssentials } = body;

    if (!destination || !itinerary) {
      return NextResponse.json(
        { success: false, error: "Missing required plan data" },
        { status: 400 }
      );
    }

    const newPlanData = {
      _id: "plan-" + Math.random().toString(36).substring(2, 9),
      userId: session?.user ? (session.user as any).id : undefined,
      userEmail: session?.user?.email || undefined,
      destination,
      durationDays: Number(durationDays) || 5,
      travelStyle: travelStyle || "Luxury",
      budgetLevel: budgetLevel || "Premium",
      partyType: partyType || "Couple",
      itinerary,
      estimatedCost: estimatedCost || { total: "Custom", breakdown: "Full package" },
      packingEssentials: packingEssentials || [],
      createdAt: new Date(),
    };

    try {
      await connectToDatabase();
      const savedPlan = await TripPlan.create(newPlanData);
      return NextResponse.json({
        success: true,
        message: "Itinerary saved to your collection",
        planId: savedPlan._id.toString(),
      });
    } catch (e) {
      memoryStore.aiPlans.unshift(newPlanData);
      return NextResponse.json({
        success: true,
        message: "Itinerary saved to your collection",
        planId: newPlanData._id,
      });
    }
  } catch (error: any) {
    console.error("Save AI plan error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save plan" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: true, plans: [] });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;

    try {
      await connectToDatabase();
      const plans = await TripPlan.find({
        $or: [
          { userId },
          { userEmail },
        ],
      }).sort({ createdAt: -1 });

      if (plans.length) {
        return NextResponse.json({ success: true, plans });
      }
    } catch (e) {
      console.warn("MongoDB AI plans fetch fallback");
    }

    const memPlans = memoryStore.aiPlans.filter(
      (p) => p.userId === userId || (userEmail && p.userEmail === userEmail)
    );

    return NextResponse.json({ success: true, plans: memPlans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
