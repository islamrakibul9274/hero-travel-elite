"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  Compass,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Utensils,
  Lightbulb,
  Bookmark,
  Printer,
  ChevronRight,
  Sun,
  Moon,
  Sunset,
  Luggage,
} from "lucide-react";
import { toast } from "sonner";

export interface AIPlanResult {
  destination: string;
  durationDays: number;
  tagline: string;
  overview: string;
  highlightBadges: string[];
  estimatedCost: {
    total: string;
    breakdown: string;
  };
  packingEssentials: string[];
  insiderSecret: string;
  itinerary: Array<{
    day: number;
    theme: string;
    morning: string;
    afternoon: string;
    evening: string;
    dining: string;
    insiderTip: string;
  }>;
}

export function AIPlannerWidget({ compact = false }: { compact?: boolean }) {
  const { data: session } = useSession();
  const [destination, setDestination] = useState("Amalfi Coast, Italy");
  const [durationDays, setDurationDays] = useState(5);
  const [travelStyle, setTravelStyle] = useState("Luxury Cultural & Culinary");
  const [budgetLevel, setBudgetLevel] = useState("Premium Luxury ($$$$)");
  const [partyType, setPartyType] = useState("Romantic Couple");

  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [plan, setPlan] = useState<AIPlanResult | null>(null);
  const [saving, setSaving] = useState(false);

  const quickPicks = [
    "Amalfi Coast, Italy",
    "Kyoto, Japan",
    "Swiss Alps, Switzerland",
    "Reykjavik & Ice Caves, Iceland",
    "Patagonia, Chile",
    "Bali & Komodo, Indonesia",
    "Santorini, Greece",
    "Serengeti Safari, Tanzania",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error("Please enter a destination.");
      return;
    }

    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          durationDays,
          travelStyle,
          budgetLevel,
          partyType,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        setActiveDay(1);
        toast.success(`Custom ${durationDays}-day itinerary crafted for ${destination}!`);
      } else {
        toast.error(data.error || "Failed to generate itinerary. Please try again.");
      }
    } catch (err) {
      toast.error("Network error while communicating with Groq AI engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!plan) return;
    if (!session) {
      toast.info("Please sign in to save this itinerary to your profile.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/ai/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Itinerary saved to your dashboard!");
      } else {
        toast.error("Could not save itinerary.");
      }
    } catch (e) {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 lg:p-10 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Groq Ultra-Fast AI Travel Architect
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Design Your Bespoke Dream Itinerary in Seconds
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Harness real-time AI to curate unlisted local experiences, Michelin dining, and hour-by-hour schedules tailored to your travel persona.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="relative z-10 space-y-6 max-w-4xl mx-auto">
        {/* Quick Pick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider flex-shrink-0 text-[10px]">
            Inspiration:
          </span>
          {quickPicks.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setDestination(city)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                destination === city
                  ? "bg-slate-900 text-white border-slate-900 font-semibold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kyoto, Positano, Zurich"
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              required
            />
          </div>

          {/* Duration */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Duration
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value={3}>3 Days (Long Weekend)</option>
              <option value={5}>5 Days (Classic Getaway)</option>
              <option value={7}>7 Days (Full Week Escape)</option>
              <option value={10}>10 Days (Deep Immersion)</option>
              <option value={14}>14 Days (Grand Expedition)</option>
            </select>
          </div>

          {/* Travel Vibe */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Travel Vibe
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Luxury Cultural & Culinary">Luxury Cultural & Culinary</option>
              <option value="High-Adrenaline Adventure">Alpine & High Adventure</option>
              <option value="Secluded Wellness & Spa">Secluded Wellness & Spa</option>
              <option value="Art, Architecture & Shopping">Art & Fashion Atelier</option>
              <option value="Romantic Seaside Indulgence">Romantic Seaside Escape</option>
            </select>
          </div>

          {/* Party Type */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Travel Party
            </label>
            <select
              value={partyType}
              onChange={(e) => setPartyType(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Romantic Couple">Romantic Couple</option>
              <option value="Solo Explorer">Solo Explorer</option>
              <option value="Family with Kids">Family Experience</option>
              <option value="Friend Group Expedition">Friend Group</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2.5 mx-auto transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Architecting {durationDays}-Day Masterpiece...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Custom AI Itinerary</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Result Display */}
      {plan && (
        <div className="mt-12 pt-10 border-t border-slate-200 relative z-10 animate-fade-in">
          {/* Plan Header Card */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                    {plan.destination}
                  </span>
                  <span className="px-3 py-1 bg-white text-slate-700 border border-slate-200 text-xs font-medium rounded-full">
                    {plan.durationDays} Days Itinerary
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {plan.tagline}
                </h3>
                <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
                  {plan.overview}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleSavePlan}
                  disabled={saving}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-orange-600" />
                  <span>{saving ? "Saving..." : "Save to Profile"}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Badges & Secret Pill */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {plan.highlightBadges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {badge}
                  </span>
                ))}
              </div>

              {plan.estimatedCost && (
                <div className="text-xs bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-700">
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                    Estimated Cost:
                  </span>
                  <span className="font-bold text-slate-900">{plan.estimatedCost.total}</span>
                </div>
              )}
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {plan.itinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeDay === day.day
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-700"
                }`}
              >
                <span>Day {day.day}</span>
                <span className="text-[11px] font-normal opacity-80 truncate max-w-[120px]">
                  {day.theme}
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Detail Card */}
          {(() => {
            const currentDay = plan.itinerary.find((d) => d.day === activeDay) || plan.itinerary[0];
            if (!currentDay) return null;

            return (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      Day {currentDay.day} Program
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      {currentDay.theme}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Morning */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/50">
                    <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sun className="w-4 h-4 text-amber-600" /> Morning Curation
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{currentDay.morning}</p>
                  </div>

                  {/* Afternoon */}
                  <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/50">
                    <div className="flex items-center gap-2 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sunset className="w-4 h-4 text-orange-600" /> Afternoon Exploration
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{currentDay.afternoon}</p>
                  </div>

                  {/* Evening */}
                  <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200">
                    <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <Moon className="w-4 h-4 text-slate-600" /> Evening & Twilight
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{currentDay.evening}</p>
                  </div>
                </div>

                {/* Dining & Insider Tip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <Utensils className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Recommended Dining</span>
                      <p className="text-xs text-slate-600 mt-1">{currentDay.dining}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Insider Curator Secret</span>
                      <p className="text-xs text-emerald-800 mt-1">{currentDay.insiderTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Packing Essentials Section */}
          {plan.packingEssentials?.length > 0 && (
            <div className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Luggage className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Packing Essentials For This Expedition
                  </h5>
                  <p className="text-xs text-slate-500">Curated specifically for this itinerary's climate and activities</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.packingEssentials.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border border-slate-200 shadow-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIPlannerWidget;
