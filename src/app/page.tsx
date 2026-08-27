"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Clock,
  MapPin,
  Plane,
  Heart,
  ChevronRight,
  Gem,
  Award,
  Leaf,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { DestinationCard, DestinationProps } from "@/components/destination-card";
import { AIPlannerWidget } from "@/components/ai-planner-widget";
import { useLiveActivity } from "@/components/providers";

export default function HomePage() {
  const { latestActivity } = useLiveActivity();
  const [destinations, setDestinations] = useState<DestinationProps[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations?featured=true");
      const data = await res.json();
      if (data.success && data.destinations) {
        setDestinations(data.destinations);
      }
    } catch (e) {
      console.warn("Failed to fetch featured destinations");
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations =
    activeCategory === "all"
      ? destinations
      : destinations.filter((d) => d.category === activeCategory);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-16 overflow-hidden">
        {/* Background Editorial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Real-time Live Activity Pill */}
          {latestActivity && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-slate-700 text-xs animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-900">Live:</span>
                <span className="truncate max-w-[280px] sm:max-w-none">{latestActivity.title}</span>
                <span className="text-slate-400">• {latestActivity.time}</span>
              </div>
            </div>
          )}

          {/* Hero Headlines */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              The New Era of Bespoke Exploration
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
              Journeys Crafted for the <span className="italic font-normal font-serif text-orange-600">Discerning</span> Nomad.
            </h1>

            <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Unrivaled private villas, secret yacht charters, and instantaneous AI itinerary architecture. Travel beyond the ordinary.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="mt-10 sm:mt-12">
            <SearchBar />
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-100 pt-10 text-center">
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">4.98 / 5</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Verified Guest Rating</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Carbon Offset Expeditions</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">2.1s</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">AI Itinerary Generation</p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Private Butler & Concierge</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED HORIZONS / FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-orange-600" />
              Signature Collections
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Curated Horizons 2026
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Handcrafted small-group & private itineraries with guaranteed departures.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Collections" },
              { id: "luxury", label: "Riviera & Luxury" },
              { id: "cultural", label: "Imperial & Cultural" },
              { id: "adventure", label: "Alpine & Adventure" },
              { id: "wellness", label: "Archipelago & Spa" },
              { id: "expedition", label: "Arctic Frontiers" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-100 rounded-3xl h-96 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm shadow-sm hover:shadow-md transition-all"
          >
            <span>View Complete 2026 Expedition Catalog</span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </Link>
        </div>
      </section>

      {/* 3. AI TRAVEL ARCHITECT MINI-STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIPlannerWidget />
      </section>

      {/* 4. THE HERO DISTINCTION / VALUE PROPOSITION */}
      <section className="bg-slate-50/70 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Why Hero Travel
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Uncompromising Standards in High Luxury
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Every detail is engineered to grant you effortless immersion, zero friction, and memories that linger for a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-6 shadow-xs">
                  <Gem className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  Unlisted Private Access
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Gain after-hours access to historical landmarks, private Riva yachts, and remote geothermal springs closed to ordinary tourism.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-orange-600">
                <span>Exclusive Keyholders</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  AI Speed + Human Touch
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Design full custom multi-day roadmaps in 2 seconds with Groq AI, then refine them directly with your dedicated human concierge butler.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-600">
                <span>24/7 Global Satellite Link</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  Regenerative & Ethical
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  100% of carbon footprints are offset. We invest directly in local indigenous heritage conservation and bio-reserve protections.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span>Certified B-Corp Partner</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIP MEMBERSHIP PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold uppercase tracking-wider">
                <Gem className="w-3.5 h-3.5" />
                VIP Travel Club
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Unlock 20% Privilege & Dedicated WhatsApp Butler
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
                Join our Globetrotter or Black Card Elite memberships to unlock private airport transfers, complimentary suite upgrades, and unlisted secret expeditions.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/pricing"
                className="w-full py-4 text-center rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all"
              >
                View VIP Club Tiers
              </Link>
              <Link
                href="/destinations"
                className="w-full py-4 text-center rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
              >
                Browse Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
