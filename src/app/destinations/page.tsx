"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Compass, SlidersHorizontal, ArrowUpDown, Filter, Sparkles, MapPin } from "lucide-react";
import { DestinationCard, DestinationProps } from "@/components/destination-card";

function DestinationsContent() {
  const searchParams = useSearchParams();
  const [destinations, setDestinations] = useState<DestinationProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [continent, setContinent] = useState(searchParams.get("continent") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    fetchDestinations();
  }, [search, continent, category, sort]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (continent && continent !== "all") params.set("continent", continent);
      if (category && category !== "all") params.set("category", category);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/destinations?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.destinations) {
        setDestinations(data.destinations);
      }
    } catch (e) {
      console.warn("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          The 2026 World Collection
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Curated Luxury Expeditions
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Explore handcrafted itineraries spanning private Mediterranean villas, alpine sanctuaries, and uncharted polar frontiers.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country, city or landmark..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Continent */}
          <div className="lg:col-span-3">
            <select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Continents</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Americas">Americas</option>
              <option value="Africa">Africa</option>
            </select>
          </div>

          {/* Category */}
          <div className="lg:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Travel Vibes</option>
              <option value="luxury">Luxury & Riviera</option>
              <option value="adventure">Alpine & Hiking</option>
              <option value="cultural">Imperial Heritage</option>
              <option value="wellness">Wellness & Sanctuary</option>
              <option value="expedition">Polar Frontiers</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Active Filters Tag */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing {destinations.length} bespoke expeditions</span>
          {(continent !== "all" || category !== "all" || search) && (
            <button
              onClick={() => {
                setSearch("");
                setContinent("all");
                setCategory("all");
              }}
              className="text-orange-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-3xl h-96 animate-pulse border border-slate-200"
            />
          ))}
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900">No expeditions found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any itineraries matching your criteria. Try adjusting your filters or use our AI Architect to generate a custom itinerary.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setContinent("all");
              setCategory("all");
            }}
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading catalog...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}
