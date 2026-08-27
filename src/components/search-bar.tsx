"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Compass, DollarSign, Calendar, Sparkles } from "lucide-react";

export function SearchBar({ initialValues }: { initialValues?: { search?: string; continent?: string; category?: string } }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialValues?.search || "");
  const [continent, setContinent] = useState(initialValues?.continent || "all");
  const [category, setCategory] = useState(initialValues?.category || "all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (continent && continent !== "all") params.set("continent", continent);
    if (category && category !== "all") params.set("category", category);

    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-card hover:shadow-xl transition-all duration-300 w-full max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Destination input */}
        <div className="lg:col-span-4 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-transparent focus-within:border-orange-500/40 focus-within:bg-white">
          <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Where to?
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Amalfi, Kyoto, Swiss Alps, Iceland"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Continent / Region Selector */}
        <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-transparent focus-within:border-orange-500/40 focus-within:bg-white">
          <Compass className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Region
            </label>
            <select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Continents</option>
              <option value="Europe">Europe (Riviera & Alps)</option>
              <option value="Asia">Asia (Imperial & Tropical)</option>
              <option value="Americas">Americas (Patagonia & Wild)</option>
              <option value="Africa">Africa (Serengeti & Dunes)</option>
            </select>
          </div>
        </div>

        {/* Travel Style / Category */}
        <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-transparent focus-within:border-orange-500/40 focus-within:bg-white">
          <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="w-full text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Travel Vibe
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Vibes</option>
              <option value="luxury">High Luxury & Villas</option>
              <option value="adventure">Alpine & Wilderness</option>
              <option value="cultural">Imperial Heritage</option>
              <option value="wellness">Private Sanctuary & Spa</option>
              <option value="expedition">Arctic & Frontiers</option>
            </select>
          </div>
        </div>

        {/* Submit button */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="w-full py-3.5 px-5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-semibold rounded-2xl shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 text-sm transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span>Discover</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
