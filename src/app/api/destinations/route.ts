import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { INITIAL_DESTINATIONS } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed if database is empty
    const count = await Destination.countDocuments();
    if (count === 0) {
      await Destination.insertMany(INITIAL_DESTINATIONS);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const continent = searchParams.get("continent") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "featured";

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
        { highlights: { $regex: search, $options: "i" } },
      ];
    }

    if (continent && continent !== "all") {
      query.continent = continent;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions: any = { featured: -1, rating: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "duration") sortOptions = { durationDays: 1 };
    else if (sort === "rating") sortOptions = { rating: -1 };

    const destinations = await Destination.find(query).sort(sortOptions);

    return NextResponse.json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error: any) {
    console.error("Destinations fetch error:", error);
    // Fallback to in-memory initial data if MongoDB is unreachable temporarily
    return NextResponse.json({
      success: true,
      count: INITIAL_DESTINATIONS.length,
      destinations: INITIAL_DESTINATIONS,
      isFallback: true,
    });
  }
}
