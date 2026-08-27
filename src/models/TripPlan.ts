import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITripPlan extends Document {
  userId?: string;
  userEmail?: string;
  destination: string;
  durationDays: number;
  travelStyle: string;
  budgetLevel: string;
  partyType: string;
  itinerary: Array<{
    day: number;
    theme: string;
    morning: string;
    afternoon: string;
    evening: string;
    dining: string;
    insiderTip: string;
  }>;
  estimatedCost: {
    total: string;
    breakdown: string;
  };
  packingEssentials: string[];
  createdAt: Date;
}

const TripPlanSchema = new Schema<ITripPlan>(
  {
    userId: { type: String },
    userEmail: { type: String },
    destination: { type: String, required: true },
    durationDays: { type: Number, required: true },
    travelStyle: { type: String, required: true },
    budgetLevel: { type: String, required: true },
    partyType: { type: String, required: true },
    itinerary: [
      {
        day: { type: Number },
        theme: { type: String },
        morning: { type: String },
        afternoon: { type: String },
        evening: { type: String },
        dining: { type: String },
        insiderTip: { type: String },
      },
    ],
    estimatedCost: {
      total: { type: String },
      breakdown: { type: String },
    },
    packingEssentials: [{ type: String }],
  },
  { timestamps: true }
);

export const TripPlan: Model<ITripPlan> =
  mongoose.models.TripPlan || mongoose.model<ITripPlan>("TripPlan", TripPlanSchema);

export default TripPlan;
