"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Clock, Users, Heart, ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { BookingModal } from "./booking-modal";

export interface DestinationProps {
  _id?: string;
  title: string;
  slug: string;
  tagline: string;
  location: string;
  country: string;
  continent: string;
  price: number;
  originalPrice?: number;
  durationDays: number;
  groupSizeMax: number;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  category: string;
  badge?: string;
  highlights?: string[];
  departureDates?: string[];
  spotsRemaining?: number;
}

export function DestinationCard({
  destination,
  isWishlisted = false,
}: {
  destination: DestinationProps;
  isWishlisted?: boolean;
}) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(isWishlisted);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.info("Please sign in to save destinations to your wishlist.");
      return;
    }

    setSaved(!saved);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: destination.slug }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          data.saved ? `Saved ${destination.title} to wishlist` : `Removed from wishlist`
        );
      }
    } catch (e) {
      setSaved(saved);
      toast.error("Failed to update wishlist.");
    }
  };

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col h-full relative">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={destination.heroImage}
            alt={destination.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {destination.badge ? (
              <span className="pointer-events-auto px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 border border-slate-100">
                <Sparkles className="w-3 h-3 text-orange-600" />
                {destination.badge}
              </span>
            ) : (
              <span className="pointer-events-auto px-3 py-1 bg-white/95 backdrop-blur-md text-slate-700 text-xs font-semibold rounded-full shadow-sm capitalize border border-slate-100">
                {destination.category}
              </span>
            )}

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                saved
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white/90 text-slate-700 hover:text-red-500 hover:bg-white shadow-sm"
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Bottom Overlay Location */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="flex items-center gap-1 text-xs font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              {destination.location}
            </span>
            {destination.spotsRemaining && destination.spotsRemaining <= 5 && (
              <span className="text-[11px] font-semibold bg-orange-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
                Only {destination.spotsRemaining} spots left
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Meta Row (Rating & Duration) */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{destination.rating}</span>
                <span className="text-slate-400 font-normal">({destination.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {destination.durationDays} Days
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Max {destination.groupSizeMax}
                </span>
              </div>
            </div>

            {/* Title & Tagline */}
            <Link href={`/destinations/${destination.slug}`} className="block group/title">
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover/title:text-orange-600 transition-colors line-clamp-1">
                {destination.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {destination.tagline}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                From
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl font-bold text-slate-900">
                  ${destination.price.toLocaleString()}
                </span>
                {destination.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${destination.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-slate-500">/guest</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs transition-colors"
              >
                Reserve
              </button>
              <Link
                href={`/destinations/${destination.slug}`}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-xs"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          destination={destination}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </>
  );
}

export default DestinationCard;
