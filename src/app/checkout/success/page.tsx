"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, Calendar, MapPin, Printer, ArrowRight, ShieldCheck, Sparkles, Crown } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const tier = searchParams.get("tier");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory luxury gold/orange confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#EA580C", "#F59E0B", "#D97706", "#1E293B"],
    });

    if (sessionId) {
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.booking) {
            setBooking(data.booking);
          }
        })
        .catch((e) => console.warn("Booking confirmation sync notice"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl space-y-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Payment Confirmed • Stripe 256-Bit Encrypted
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            {type === "membership" ? "Welcome to the VIP Club!" : "Reservation Confirmed!"}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {type === "membership"
              ? `Your ${tier === "blackcard" ? "Black Card Elite" : "Globetrotter"} privileges are now active on your account.`
              : "A bespoke travel pass and receipt have been dispatched to your email address."}
          </p>
        </div>

        {/* Booking Card Details */}
        {booking && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs text-slate-500 font-medium">Booking Reference:</span>
              <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                {booking.bookingReference}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Expedition:</span>
              <span className="font-semibold text-slate-900">{booking.destinationTitle}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Departure:</span>
              <span className="font-semibold text-slate-900">{booking.travelDate}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Travelers:</span>
              <span className="font-semibold text-slate-900">{booking.guestsCount} Guest(s)</span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-200/80 pt-3">
              <span className="font-bold text-slate-900">Total Investment:</span>
              <span className="font-serif text-lg font-bold text-orange-600">
                ${booking.totalPrice?.toLocaleString()} USD
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/profile?tab=bookings"
            className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>View In Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Travel Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading receipt...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
