"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowRight, ShieldCheck, HeartHandshake, Globe2, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        toast.success("Welcome! You are now subscribed to our private dispatches.");
        setEmail("");
      } else {
        toast.error("Subscription could not be completed. Please check your email address.");
      }
    } catch (e) {
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Private Horizon Dispatches
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Unlock Secret Expeditions & Members-Only Privileges
              </h3>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                Receive our monthly private journal with unlisted boutique villas, Michelin chef itineraries, and early booking windows.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">You are on the private guest list</p>
                    <p className="text-xs text-emerald-700">Check your inbox for our latest seasonal curation brief.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
                  >
                    {loading ? "Joining..." : "Join Journal"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
              <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> 100% Privacy Guaranteed
                </span>
                <span>•</span>
                <span>No spam. Unsubscribe anytime.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-slate-900">
                HERO<span className="text-orange-600 font-sans font-light tracking-widest ml-1 text-xs">TRAVEL</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm">
              Hero Travel redefines luxury discovery. Combining world-class human expedition curators with real-time AI architectural itinerary design.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <Globe2 className="w-3.5 h-3.5 text-orange-600" />
                <span>USD ($) • English</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>24/7 Global Desk Live</span>
              </div>
            </div>
          </div>

          {/* Col 2: Expeditions */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Expeditions</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/destinations?continent=Europe" className="text-slate-500 hover:text-orange-600 transition-colors">
                  European Riviera
                </Link>
              </li>
              <li>
                <Link href="/destinations?continent=Asia" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Imperial Asia
                </Link>
              </li>
              <li>
                <Link href="/destinations?continent=Americas" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Patagonian Wilderness
                </Link>
              </li>
              <li>
                <Link href="/destinations?category=wellness" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Sanctuary & Wellness
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-slate-500 hover:text-orange-600 transition-colors">
                  All 2026 Horizons
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Smart Platform */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Smart Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ai-planner" className="text-slate-500 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                  AI Trip Architect <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-500 hover:text-orange-600 transition-colors">
                  VIP Travel Club
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing#faq" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Membership Benefits
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Custom Group Charter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Concierge */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Trust & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-orange-600 transition-colors">
                  24/7 Concierge Desk
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Booking Guarantee
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">Stripe Verified 256-Bit</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-default">100% Carbon Offset</span>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-orange-600 transition-colors">
                  Press & Media Kit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Hero Travel Technologies Inc. Crafted with modern luxury standards.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-600">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-600">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
