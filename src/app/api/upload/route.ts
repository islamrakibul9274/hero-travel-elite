import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { image, folder = "hero_travel_avatars" } = body;

    if (!image) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    const uploadRes = await uploadImageToCloudinary(image, folder);

    if (!uploadRes.success || !uploadRes.url) {
      return NextResponse.json(
        { success: false, error: uploadRes.error || "Upload failed" },
        { status: 500 }
      );
    }

    // If user is authenticated and updating avatar, save to database
    if (session?.user && (folder.includes("avatar") || folder.includes("profile"))) {
      await connectToDatabase();
      const userId = (session.user as any).id;
      if (userId) {
        await User.findByIdAndUpdate(userId, { avatar: uploadRes.url });
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadRes.url,
      publicId: uploadRes.publicId,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload process failed" },
      { status: 500 }
    );
  }
}
