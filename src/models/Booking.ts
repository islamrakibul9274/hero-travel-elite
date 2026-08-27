import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  bookingReference: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  destinationId: string;
  destinationTitle: string;
  destinationSlug: string;
  destinationImage: string;
  travelDate: string;
  guestsCount: number;
  pricePerGuest: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus: "paid" | "unpaid" | "refunded";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  addOns?: {
    helicopterTour?: boolean;
    privateChef?: boolean;
    travelInsurance?: boolean;
  };
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      default: () => "HT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
    userId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    destinationId: { type: String, required: true },
    destinationTitle: { type: String, required: true },
    destinationSlug: { type: String, required: true },
    destinationImage: { type: String, required: true },
    travelDate: { type: String, required: true },
    guestsCount: { type: Number, required: true, default: 1 },
    pricePerGuest: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "completed"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "paid",
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    addOns: {
      helicopterTour: { type: Boolean, default: false },
      privateChef: { type: Boolean, default: false },
      travelInsurance: { type: Boolean, default: false },
    },
    specialRequests: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
