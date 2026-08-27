"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

export default function PricingPage() {
  const { data: session } = useSession();
  const [interval, setInterval] = useState<"monthly" | "annual">("annual");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCheckout = async (membershipTier: string) => {
    if (membershipTier === "free") {
      toast.info("You already have standard Explorer access!");
      return;
    }

    setLoadingTier(membershipTier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "membership",
          membershipTier,
          interval,
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to initialize checkout.");
      }
    } catch (e) {
      toast.error("Checkout connection failed.");
    } finally {
      setLoadingTier(null);
    }
  };

  const faqs = [
    {
      q: "How does the package discount work?",
      a: "As an active Globetrotter (10%) or Black Card Elite (20%) member, your discount is automatically applied to any expedition reservation made while your membership is active.",
    },
    {
      q: "Can I cancel or pause my VIP membership anytime?",
      a: "Yes. You can manage or cancel your membership directly from your profile dashboard with one click. Your privileges remain active until the end of your billing cycle.",
    },
    {
      q: "What does the 24/7 WhatsApp Butler include?",
      a: "Black Card Elite members receive a direct private WhatsApp link to a senior travel curator who handles real-time restaurant bookings, private driver adjustments, helicopter bookings, and on-trip requests 24/7.",
    },
    {
      q: "Are the airport transfers worldwide?",
      a: "Black Card members enjoy complimentary private chauffeur transfers (Mercedes S-Class or equivalent) to and from major international hub airports for any booked expedition.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          Hero Travel Private Membership
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Privileged Access to the World’s Finest
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto">
          Elevate your journeys with exclusive member discounts, dedicated personal butler service, and unlisted secret expeditions.
        </p>

        {/* Billing Interval Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                interval === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setInterval("annual")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                interval === "annual"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-extrabold rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Explorer (Free) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-slate-900">Explorer</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                Free Forever
              </span>
            </div>
            <p className="text-xs text-slate-500 min-h-[36px]">
              Essential access to our curated catalog and AI trip planning previews.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-slate-900">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Full catalog small-group bookings</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>3 AI Itinerary generations per month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Standard email support</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100 Welcome loyalty points</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleCheckout("free")}
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              Current Standard Plan
            </button>
          </div>
        </div>

        {/* Tier 2: Globetrotter Club (Popular) */}
        <div className="bg-white rounded-3xl p-8 border-2 border-orange-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-8 rotate-45 translate-x-7 translate-y-3 shadow-sm">
            Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h3 className="font-serif text-xl font-bold text-slate-900">Globetrotter Club</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 min-h-[36px]">
              For frequent travelers seeking guaranteed package savings and unlimited AI generation.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-slate-900">
                  ${interval === "annual" ? "190" : "19"}
                </span>
                <span className="text-xs text-slate-500">
                  /{interval === "annual" ? "year" : "month"}
                </span>
              </div>
              {interval === "annual" && (
                <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                  Billed annually ($15.80/mo equivalent)
                </span>
              )}
            </div>

            <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
              <li className="flex items-center gap-2.5 font-semibold">
                <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>10% Discount on all luxury tour packages</span>
              </li>
              <li className="flex items-center gap-2.5 font-semibold">
                <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Unlimited Groq AI itinerary curation & exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Priority 48-hour early booking window</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>Dedicated member concierge desk</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>2 Annual VIP airport lounge passes</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleCheckout("globetrotter")}
              disabled={loadingTier === "globetrotter"}
              className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-orange-600/30 transition-all disabled:opacity-50"
            >
              {loadingTier === "globetrotter" ? "Processing..." : "Upgrade to Globetrotter"}
            </button>
          </div>
        </div>

        {/* Tier 3: Black Card Elite */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-xl font-bold text-white">Black Card Elite</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 min-h-[36px]">
              Ultimate ultra-luxury privileges, private transfers, and dedicated 24/7 personal WhatsApp butler.
            </p>

            <div className="my-6">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-white">
                  ${interval === "annual" ? "490" : "49"}
                </span>
                <span className="text-xs text-slate-400">
                  /{interval === "annual" ? "year" : "month"}
                </span>
              </div>
              {interval === "annual" && (
                <span className="text-[11px] font-bold text-amber-400 mt-1 block">
                  Billed annually ($40.80/mo equivalent)
                </span>
              )}
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
              <li className="flex items-center gap-2.5 font-bold text-amber-300">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>20% Privilege on all luxury packages</span>
              </li>
              <li className="flex items-center gap-2.5 font-bold text-white">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>24/7 Dedicated WhatsApp Private Travel Butler</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Complimentary luxury Mercedes airport transfers</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Free date rescheduling & flexible cancellation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>VIP room upgrades & champagne welcome</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Invitation-only secret unlisted expeditions</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleCheckout("blackcard")}
              disabled={loadingTier === "blackcard"}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loadingTier === "blackcard" ? "Processing..." : "Acquire Black Card Elite"}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6 text-center">
          Compare Membership Privileges
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Privilege</th>
                <th className="py-3 px-4 text-center">Explorer</th>
                <th className="py-3 px-4 text-center text-orange-600">Globetrotter</th>
                <th className="py-3 px-4 text-center text-slate-900">Black Card Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Tour Package Discount</td>
                <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                <td className="py-3.5 px-4 text-center font-bold text-orange-600">10% Off</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-900">20% Off</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Groq AI Trip Architect</td>
                <td className="py-3.5 px-4 text-center text-slate-500">3 / month</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-600">Unlimited</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-600">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">24/7 Dedicated WhatsApp Butler</td>
                <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-600">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Private Airport Chauffeur</td>
                <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-600">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Flexible Cancellation Policy</td>
                <td className="py-3.5 px-4 text-center text-slate-500">Standard</td>
                <td className="py-3.5 px-4 text-center text-slate-700">72-Hour Free</td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-900">24-Hour Any Reason</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h3 className="font-serif text-2xl font-bold text-slate-900 text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
