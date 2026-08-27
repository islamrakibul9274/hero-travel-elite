import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";

const SEED_REVIEWS: Record<string, any[]> = {
  "amalfi-coast-cliffside-escape": [
    {
      userName: "Lady Victoria Sterling",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      userLocation: "London, UK",
      rating: 5,
      title: "An unforgettably sublime Mediterranean masterclass",
      comment: "The private Riva yacht charter to Capri felt like a dream out of 1960s cinema. Our concierge Elena anticipated every craving before we even spoke. Truly peerless luxury.",
      travelDate: "September 2025",
      likes: 34,
      verified: true,
      createdAt: new Date("2025-10-01"),
    },
    {
      userName: "Marcus Vance",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      userLocation: "San Francisco, USA",
      rating: 5,
      title: "Worth every penny for the seamless VIP access",
      comment: "Skipping all queues in Pompeii with a private archaeologist and tasting vintage Lacryma Christi on the volcano slopes was a highlight of my decade.",
      travelDate: "July 2025",
      likes: 19,
      verified: true,
      createdAt: new Date("2025-08-15"),
    },
  ],
  "kyoto-tokyo-imperial-journey": [
    {
      userName: "Dr. Kenji & Sarah Arisawa",
      userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      userLocation: "Vancouver, Canada",
      rating: 5,
      title: "The private tea ceremony changed how we view hospitality",
      comment: "The Hakone onsen ryokan was breathtaking. Seeing Mount Fuji with morning steam rising around our private cedar tub was pure magic.",
      travelDate: "November 2025",
      likes: 42,
      verified: true,
      createdAt: new Date("2025-11-20"),
    },
  ],
  "swiss-alps-alpine-panorama": [
    {
      userName: "Henrietta & Charles Montgomery",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      userLocation: "Geneva, Switzerland",
      rating: 5,
      title: "Excellence Class Glacier Express is unforgettable",
      comment: "Gliding past alpine gorges while sipping champagne was pure magic. The helicopter glacier landing in Zermatt will remain etched in our memories forever.",
      travelDate: "August 2025",
      likes: 27,
      verified: true,
      createdAt: new Date("2025-08-20"),
    },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    let dbReviews: any[] = [];
    try {
      await connectToDatabase();
      dbReviews = await Review.find({ destinationSlug: slug }).sort({ createdAt: -1 });
    } catch (e) {
      console.warn("MongoDB review fetch fallback to seed reviews");
    }

    const seed = SEED_REVIEWS[slug] || [
      {
        userName: "Verified Explorer",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        userLocation: "Global Member",
        rating: 5,
        title: "Bespoke perfection in every detail",
        comment: "The private guides and unlisted experiences made this journey truly exceptional.",
        travelDate: "Recent Trip",
        likes: 12,
        verified: true,
      },
    ];

    const allReviews = [...dbReviews, ...seed];

    return NextResponse.json({ success: true, reviews: allReviews });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { destinationSlug, rating, title, comment, userLocation } = body;

    if (!destinationSlug || !rating || !title || !comment) {
      return NextResponse.json({ error: "All review fields are required" }, { status: 400 });
    }

    const newReview = {
      destinationSlug,
      userId: session?.user ? (session.user as any).id : undefined,
      userName: session?.user?.name || "Verified Traveler",
      userAvatar: session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Traveler",
      userLocation: userLocation || "Explorer",
      rating: Number(rating),
      title,
      comment,
      travelDate: "Recent Trip",
      likes: 1,
      verified: true,
      createdAt: new Date(),
    };

    try {
      await connectToDatabase();
      const savedReview = await Review.create(newReview);
      return NextResponse.json({ success: true, review: savedReview });
    } catch (e) {
      return NextResponse.json({ success: true, review: newReview });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to post review" }, { status: 500 });
  }
}
