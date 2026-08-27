import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { memoryStore } from "@/lib/memory-store";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 12);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // Try MongoDB
    try {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        avatar,
        membershipTier: "free",
        loyaltyPoints: 250,
        tripsCount: 0,
        role: "user",
      });

      return NextResponse.json(
        {
          message: "Account created successfully",
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            membershipTier: newUser.membershipTier,
            loyaltyPoints: newUser.loyaltyPoints,
          },
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn("MongoDB registration fallback to memory store");
    }

    // Memory Store Fallback
    const existingMemUser = memoryStore.users.find((u) => u.email === normalizedEmail);
    if (existingMemUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const newMemUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      avatar,
      role: "user",
      membershipTier: "free",
      loyaltyPoints: 250,
      tripsCount: 0,
      phone: "",
      location: "",
      bio: "",
      wishlist: [],
      createdAt: new Date(),
    };

    memoryStore.users.push(newMemUser);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newMemUser.id,
          name: newMemUser.name,
          email: newMemUser.email,
          avatar: newMemUser.avatar,
          membershipTier: newMemUser.membershipTier,
          loyaltyPoints: newMemUser.loyaltyPoints,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error occurred" },
      { status: 500 }
    );
  }
}
