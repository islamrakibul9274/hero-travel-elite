"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { X, Calendar, Users, ShieldCheck, Sparkles, Check, ArrowRight, Plane, UtensilsCrossed, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { DestinationProps } from "./destination-card";

export function BookingModal({
  destination,
  isOpen,
  onClose,
}: {
  destination: DestinationProps;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [travelDate, setTravelDate] = useState(
    destination.departureDates?.[0] || "May 15, 2026"
  );
  const [guestsCount, setGuestsCount] = useState(1);
  const [customerName, setCustomerName] = useState(session?.user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(session?.user?.email || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  // Add-ons
  const [addOns, setAddOns] = useState({
    helicopterTour: false,
    privateChef: false,
    travelInsurance: true,
  });

  if (!isOpen) return null;

  // Calculate pricing
  const basePrice = destination.price;
  const subtotal = basePrice * guestsCount;
  let addOnsTotal = 0;
  if (addOns.helicopterTour) addOnsTotal += 450 * guestsCount;
  if (addOns.privateChef) addOnsTotal += 350 * guestsCount;
  if (addOns.travelInsurance) addOnsTotal += 120 * guestsCount;
  const grandTotal = subtotal + addOnsTotal;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tour",
          destination,
          bookingDetails: {
            travelDate,
            guestsCount,
            customerName,
            customerEmail,
            customerPhone,
            specialRequests,
            addOns,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        toast.success("Redirecting to secure Stripe Checkout...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Unable to initialize Stripe checkout.");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Checkout connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative text-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Bespoke Reservation
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              {destination.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleCheckout} className="p-6 space-y-6">
          {/* Quick Package Summary */}
          <div className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center">
            <img
              src={destination.heroImage}
              alt={destination.title}
              className="w-20 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{destination.location}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {destination.durationDays} Days • Max {destination.groupSizeMax} Travelers • All-Inclusive
              </p>
              <p className="text-xs font-bold text-orange-600 mt-1">
                ${destination.price.toLocaleString()} USD / guest
              </p>
            </div>
          </div>

          {/* Departure Date & Guests Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {(destination.departureDates || ["May 15, 2026", "Jun 10, 2026", "Jul 05, 2026"]).map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Travelers
              </label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3">
                <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  {guestsCount} {guestsCount === 1 ? "Guest" : "Guests"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestsCount(Math.min(destination.groupSizeMax || 10, guestsCount + 1))
                    }
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Curated VIP Add-ons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              VIP Enhancements (Optional)
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addOns.helicopterTour}
                    onChange={(e) =>
                      setAddOns({ ...addOns, helicopterTour: e.target.checked })
                    }
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-orange-600" /> Scenic Helicopter Transfer / Tour
                    </span>
                    <p className="text-[11px] text-slate-500">Includes private champagne aerial landing</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">+$450/guest</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addOns.privateChef}
                    onChange={(e) =>
                      setAddOns({ ...addOns, privateChef: e.target.checked })
                    }
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" /> Private Chef In-Villa Masterclass
                    </span>
                    <p className="text-[11px] text-slate-500">Custom 4-course menu paired with regional reserve vintage</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">+$350/guest</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addOns.travelInsurance}
                    onChange={(e) =>
                      setAddOns({ ...addOns, travelInsurance: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Premium Travel Protection & Medical
                    </span>
                    <p className="text-[11px] text-slate-500">Cancel for any reason up to 72 hours prior</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">+$120/guest</span>
              </label>
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Traveler Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Special requests, dietary preferences, or flight timings (optional)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Price Calculation Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>
                Base Expedition ({guestsCount} × ${basePrice.toLocaleString()})
              </span>
              <span className="font-semibold text-slate-900">${subtotal.toLocaleString()} USD</span>
            </div>
            {addOnsTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Selected VIP Add-ons</span>
                <span className="font-semibold text-slate-900">+${addOnsTotal.toLocaleString()} USD</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Investment</span>
              <span className="font-serif text-xl font-bold text-orange-600">
                ${grandTotal.toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Submit Checkout */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Preparing Stripe Checkout...</span>
            ) : (
              <>
                <span>Secure Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            256-bit encrypted checkout via Stripe • Free cancellation per policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
