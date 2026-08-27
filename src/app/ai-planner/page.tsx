"use client";

import React from "react";
import { Sparkles, Cpu, Zap, Compass, MapPin, ArrowRight } from "lucide-react";
import { AIPlannerWidget } from "@/components/ai-planner-widget";

export default function AIPlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Powered by Groq Ultra-Fast LLaMA 3.3 Engine
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          The AI Travel Architect
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
          Generate bespoke day-by-day itineraries in under 2 seconds. Every plan is curated with Michelin dining recommendations, hidden local secrets, and real cost estimates.
        </p>
      </div>

      {/* Main Studio Widget */}
      <AIPlannerWidget />

      {/* Why Groq AI Travel Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Sub-Second Inference</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Powered by Groq's custom LPU hardware, generating exhaustive multi-day travel schedules 10x faster than standard LLMs.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Curator Authenticity</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Trained on high-end luxury hospitality datasets to prioritize unlisted boutique stays, private guides, and secret viewpoints.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Save & Export to PDF</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Instantly synchronize generated plans to your traveler profile or export printable high-density travel roadmaps.
          </p>
        </div>
      </div>
    </div>
  );
}
