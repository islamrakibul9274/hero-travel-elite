"use client";

import React, { useState } from "react";
import {
  Compass,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("Amalfi Coast, Italy");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, destination, guests, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast.success("Your bespoke inquiry has been received by our concierge desk.");
      } else {
        toast.error("Failed to submit inquiry.");
      }
    } catch (e) {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-orange-700 text-xs font-semibold uppercase tracking-wider">
          <PhoneCall className="w-3.5 h-3.5" />
          Private Expedition Desk
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          24/7 Global Concierge
        </h1>
        <p className="text-slate-500 text-base max-w-2xl mx-auto">
          Whether you require a private yacht charter, a bespoke corporate retreat, or an unlisted expedition, our senior curators stand ready.
        </p>
      </div>

      {/* Main Grid: Form & Concierge Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Inquiry Dispatched</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Thank you, {name}. A dedicated expedition curator has been assigned to your request and will contact you via email shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-orange-600 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Request a Custom Expedition Brief
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lady Victoria Sterling"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="victoria@sterling.com"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Desired Destination / Region
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Amalfi, Kyoto, Swiss Alps"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 Solo Explorer</option>
                    <option value={2}>2 Guests (Couple)</option>
                    <option value={4}>3-5 Guests (Small Party)</option>
                    <option value={8}>6-12 Guests (Private Charter)</option>
                    <option value={15}>12+ Guests (VIP Delegation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Journey Concept & Preferences
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your desired timeline, budget, special occasions, private yacht or helicopter requirements..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  "Transmitting to Desk..."
                ) : (
                  <>
                    <span>Submit to Senior Curator</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Global Hubs & Satellite Desk */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Direct Line
              </span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 24/7/365</span>
              </div>
            </div>

            <h3 className="font-serif text-2xl font-bold">
              Personal Travel Butler
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              For immediate assistance with ongoing expeditions or urgent VIP arrangements, our global team coordinates across 4 key time zones.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Concierge Email</p>
                  <p className="font-semibold text-white">concierge@herotravel.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Global Toll-Free (VIP)</p>
                  <p className="font-semibold text-white">+1 (800) 437-6878</p>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Hubs */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Expedition Atelier Hubs
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">London Atelier</p>
                <p className="text-slate-500 mt-0.5">Mayfair, London W1</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">Tokyo Hub</p>
                <p className="text-slate-500 mt-0.5">Ginza, Chuo City</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">Zurich Office</p>
                <p className="text-slate-500 mt-0.5">Bahnhofstrasse 45</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <p className="font-bold text-slate-900">New York Studio</p>
                <p className="text-slate-500 mt-0.5">Madison Ave, NY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
