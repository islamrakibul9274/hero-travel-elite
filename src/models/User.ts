import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "user" | "admin" | "vip";
  membershipTier: "free" | "globetrotter" | "blackcard";
  membershipExpiresAt?: Date;
  wishlist: string[]; // array of destination ids or slugs
  tripsCount: number;
  loyaltyPoints: number;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "vip"], default: "user" },
    membershipTier: { type: String, enum: ["free", "globetrotter", "blackcard"], default: "free" },
    membershipExpiresAt: { type: Date },
    wishlist: [{ type: String }],
    tripsCount: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 100 },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
