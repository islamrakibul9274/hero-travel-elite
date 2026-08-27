"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Plane,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { BookingModal } from "@/components/booking-modal";
import { ReviewsSection } from "@/components/reviews-section";
import { DestinationProps } from "@/components/destination-card";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    fetchDestination();
  }, [slug]);

  const fetchDestination = async () => {
    try {
      const res = await fetch(`/api/destinations/${slug}`);
      const data = await res.json();
      if (data.success && data.destination) {
        setDestination(data.destination);
        setSelectedImage(data.destination.heroImage);
      } else {
        setDestination(null);
      }
    } catch (e) {
      console.warn("Destination fetch failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Unveiling bespoke itinerary...</p>
      </div>
    );
  }

  if (!destination) {
    return notFound();
  }

  const toggleDay = (dayNum: number) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Top Breadcrumb & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-orange-600">Destinations</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{destination.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Expedition link copied to clipboard!");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Title & Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold rounded-full">
              {destination.category.toUpperCase()} EXPEDITION
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              {destination.location}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {destination.title}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-3xl font-light leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        {/* High-End Gallery Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 aspect-[16/10] rounded-3xl overflow-hidden shadow-card border border-slate-200 relative bg-slate-100">
            <img
              src={selectedImage}
              alt={destination.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
            {(destination.gallery || [destination.heroImage]).slice(0, 2).map((imgUrl: string, i: number) => (
              <div
                key={i}
                onClick={() => setSelectedImage(imgUrl)}
                className={`aspect-[16/10] md:aspect-auto md:h-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === imgUrl
                    ? "border-orange-500 shadow-md"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Itinerary Details & Roadmaps */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Badges Row */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                  <p className="text-sm font-bold text-slate-900">{destination.durationDays} Days</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Group Size</p>
                  <p className="text-sm font-bold text-slate-900">Max {destination.groupSizeMax} Nomads</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 shadow-xs">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rating</p>
                  <p className="text-sm font-bold text-slate-900">
                    {destination.rating} <span className="text-slate-400 font-normal">({destination.reviewsCount})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-slate-900">Expedition Overview</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {destination.overview}
              </p>
            </section>

            {/* Highlights */}
            {destination.highlights?.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-slate-900">Curated Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-start gap-3"
                    >
                      <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Day-by-Day Interactive Roadmap Accordion */}
            {destination.itinerary?.length > 0 && (
              <section className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Day-by-Day Blueprint
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    The Complete Itinerary
                  </h2>
                </div>

                <div className="space-y-3">
                  {destination.itinerary.map((dayItem: any) => {
                    const isOpen = openDay === dayItem.day;
                    return (
                      <div
                        key={dayItem.day}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          onClick={() => toggleDay(dayItem.day)}
                          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                              D{dayItem.day}
                            </span>
                            <div>
                              <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                                {dayItem.title}
                              </h4>
                              <p className="text-xs text-slate-400 hidden sm:block">
                                Stay: {dayItem.stay || "Luxury Villa / Resort"}
                              </p>
                            </div>
                          </div>

                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-slate-700 text-xs sm:text-sm">
                            <p className="leading-relaxed text-slate-600">{dayItem.description}</p>

                            {dayItem.activities?.length > 0 && (
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                  Included Activities:
                                </span>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {dayItem.activities.map((act: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                                      {act}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                              <span>🍽️ <strong>Dining:</strong> {dayItem.meals}</span>
                              <span>🏨 <strong>Resort:</strong> {dayItem.stay}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-slate-900">What’s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Guaranteed Inclusions
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {(destination.inclusions || [
                      "Luxury 5-Star Boutique Accommodations",
                      "All Daily Gourmet Breakfasts & Sommelier Dinners",
                      "Private Chauffeur Airport Transfers",
                      "Full-Time Expedition Director & Butler Concierge",
                    ]).map((inc: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                    <XCircle className="w-4 h-4 text-slate-400" /> Not Included
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
                    {(destination.exclusions || [
                      "International flights to departure hub",
                      "Personal luxury shopping and souvenirs",
                      "Discretionary staff gratuities",
                    ]).map((exc: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Verified Reviews Section */}
            <ReviewsSection destinationSlug={destination.slug} />
          </div>

          {/* Right Column: Sticky Booking Widget Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                  All-Inclusive Package
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-slate-900">
                    ${destination.price.toLocaleString()}
                  </span>
                  {destination.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${destination.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium">/ guest</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>Instant Stripe-Secured Reservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span>VIP Lounge & Private Transfers Included</span>
                </div>
              </div>

              {/* Next Departure Dates */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Available Departures
                </label>
                <div className="space-y-1.5 text-xs font-semibold text-slate-800">
                  {(destination.departureDates || ["May 15, 2026", "Jun 10, 2026", "Jul 05, 2026"]).map(
                    (date: string) => (
                      <div
                        key={date}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          {date}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">Guaranteed</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Reserve This Expedition</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="text-xs text-slate-500 hover:text-orange-600 font-semibold"
                >
                  Need a private custom date? Speak to our Concierge →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          destination={destination}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
