import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string;
  stay: string;
}

export interface IDestination extends Document {
  title: string;
  slug: string;
  tagline: string;
  location: string;
  country: string;
  continent: "Europe" | "Asia" | "Americas" | "Africa" | "Oceania" | "Polar";
  price: number;
  originalPrice?: number;
  durationDays: number;
  groupSizeMax: number;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  gallery: string[];
  category: "luxury" | "adventure" | "cultural" | "wellness" | "expedition";
  badge?: string;
  featured: boolean;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: IItineraryDay[];
  coordinates: {
    lat: number;
    lng: number;
  };
  departureDates: string[];
  spotsRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryDaySchema = new Schema<IItineraryDay>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [{ type: String }],
  meals: { type: String, default: "Breakfast included" },
  stay: { type: String, default: "Luxury Boutique Hotel" },
});

const DestinationSchema = new Schema<IDestination>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    continent: {
      type: String,
      enum: ["Europe", "Asia", "Americas", "Africa", "Oceania", "Polar"],
      required: true,
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    durationDays: { type: Number, required: true },
    groupSizeMax: { type: Number, default: 12 },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 48 },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    category: {
      type: String,
      enum: ["luxury", "adventure", "cultural", "wellness", "expedition"],
      default: "luxury",
    },
    badge: { type: String },
    featured: { type: Boolean, default: false },
    overview: { type: String, required: true },
    highlights: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    departureDates: [{ type: String }],
    spotsRemaining: { type: Number, default: 6 },
  },
  { timestamps: true }
);

export const Destination: Model<IDestination> =
  mongoose.models.Destination || mongoose.model<IDestination>("Destination", DestinationSchema);

export default Destination;
