import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { memoryStore } from "@/lib/memory-store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();

    // 1. Try DB
    try {
      await connectToDatabase();
      const user = await User.findById(userId);
      if (user) {
        return NextResponse.json({ success: true, user });
      }
    } catch (e) {
      console.warn("MongoDB profile fetch fallback");
    }

    // 2. Memory store
    const memUser = memoryStore.users.find(
      (u) => u.id === userId || (userEmail && u.email === userEmail)
    );

    if (memUser) {
      return NextResponse.json({ success: true, user: memUser });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
        membershipTier: (session.user as any).membershipTier || "free",
        loyaltyPoints: (session.user as any).loyaltyPoints || 100,
        tripsCount: 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to get profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, location, bio, avatar } = body;
    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase();

    // 1. Try DB
    try {
      await connectToDatabase();
      const updateFields: any = {};
      if (name) updateFields.name = name;
      if (phone !== undefined) updateFields.phone = phone;
      if (location !== undefined) updateFields.location = location;
      if (bio !== undefined) updateFields.bio = bio;
      if (avatar) updateFields.avatar = avatar;

      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
      if (updatedUser) {
        return NextResponse.json({ success: true, user: updatedUser });
      }
    } catch (e) {
      console.warn("MongoDB profile patch fallback");
    }

    // 2. Memory store
    const memUser = memoryStore.users.find(
      (u) => u.id === userId || (userEmail && u.email === userEmail)
    );

    if (memUser) {
      if (name) memUser.name = name;
      if (phone !== undefined) memUser.phone = phone;
      if (location !== undefined) memUser.location = location;
      if (bio !== undefined) memUser.bio = bio;
      if (avatar) memUser.avatar = avatar;

      return NextResponse.json({ success: true, user: memUser });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update profile" }, { status: 500 });
  }
}
