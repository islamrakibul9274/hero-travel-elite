import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  destinationSlug: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  travelDate?: string;
  likes: number;
  verified: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    destinationSlug: { type: String, required: true, index: true },
    userId: { type: String },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    userLocation: { type: String, default: "Verified Nomad" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    travelDate: { type: String },
    likes: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
