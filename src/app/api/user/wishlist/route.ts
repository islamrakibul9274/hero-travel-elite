import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Destination from "@/models/Destination";
import { INITIAL_DESTINATIONS } from "@/lib/seed-data";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to save destinations" }, { status: 401 });
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Destination slug required" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();

    // 1. Try DB
    try {
      await connectToDatabase();
      const user = await User.findById(userId);
      if (user) {
        const exists = user.wishlist.includes(slug);
        if (exists) {
          user.wishlist = user.wishlist.filter((s) => s !== slug);
        } else {
          user.wishlist.push(slug);
        }
        await user.save();

        return NextResponse.json({
          success: true,
          saved: !exists,
          wishlist: user.wishlist,
        });
      }
    } catch (e) {
      console.warn("MongoDB wishlist toggle fallback");
    }

    // 2. Memory store
    let memUser = memoryStore.users.find((u) => u.id === userId || (userEmail && u.email === userEmail));
    if (!memUser) {
      memUser = {
        id: userId,
        name: session.user.name || "Traveler",
        email: userEmail || "traveler@herotravel.com",
        role: "user",
        membershipTier: "free",
        loyaltyPoints: 100,
        tripsCount: 0,
        wishlist: [],
        createdAt: new Date(),
      };
      memoryStore.users.push(memUser);
    }

    const exists = memUser.wishlist.includes(slug);
    if (exists) {
      memUser.wishlist = memUser.wishlist.filter((s) => s !== slug);
    } else {
      memUser.wishlist.push(slug);
    }

    return NextResponse.json({
      success: true,
      saved: !exists,
      wishlist: memUser.wishlist,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Wishlist error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: true, wishlistDestinations: [] });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();
    let wishlistSlugs: string[] = [];

    try {
      await connectToDatabase();
      const user = await User.findById(userId);
      if (user) wishlistSlugs = user.wishlist;
    } catch (e) {
      const memUser = memoryStore.users.find((u) => u.id === userId || (userEmail && u.email === userEmail));
      if (memUser) wishlistSlugs = memUser.wishlist;
    }

    if (!wishlistSlugs.length) {
      const memUser = memoryStore.users.find((u) => u.id === userId || (userEmail && u.email === userEmail));
      if (memUser) wishlistSlugs = memUser.wishlist;
    }

    const finalDestinations = INITIAL_DESTINATIONS.filter((d) => wishlistSlugs.includes(d.slug));

    return NextResponse.json({ success: true, wishlistDestinations: finalDestinations });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch wishlist" }, { status: 500 });
  }
}
