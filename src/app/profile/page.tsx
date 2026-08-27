"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  CalendarCheck,
  Bookmark,
  Sparkles,
  Crown,
  Settings,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { UserAvatarUpload } from "@/components/user-avatar-upload";
import { DestinationCard, DestinationProps } from "@/components/destination-card";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update: updateSession } = useSession();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "bookings");
  const [profileData, setProfileData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<DestinationProps[]>([]);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile");
    } else if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await fetch("/api/user/profile");
      const profileJson = await profileRes.json();
      if (profileJson.success && profileJson.user) {
        setProfileData(profileJson.user);
        setName(profileJson.user.name || "");
        setPhone(profileJson.user.phone || "");
        setLocation(profileJson.user.location || "");
        setBio(profileJson.user.bio || "");
      }

      // 2. Fetch Bookings
      const bookingsRes = await fetch("/api/bookings");
      const bookingsJson = await bookingsRes.json();
      if (bookingsJson.success) {
        setBookings(bookingsJson.bookings || []);
      }

      // 3. Fetch Wishlist
      const wishlistRes = await fetch("/api/user/wishlist");
      const wishlistJson = await wishlistRes.json();
      if (wishlistJson.success) {
        setWishlist(wishlistJson.wishlistDestinations || []);
      }

      // 4. Fetch Saved AI Plans
      const plansRes = await fetch("/api/ai/save-plan");
      const plansJson = await plansRes.json();
      if (plansJson.success) {
        setSavedPlans(plansJson.plans || []);
      }
    } catch (e) {
      console.warn("Failed to load user profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location, bio }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile details saved successfully!");
        await updateSession({ name });
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (e) {
      toast.error("Update error.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading your luxury traveler portal...</p>
      </div>
    );
  }

  const membership = profileData?.membershipTier || "free";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Header Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <UserAvatarUpload
              currentAvatar={profileData?.avatar}
              onAvatarUpdated={(url) => setProfileData({ ...profileData, avatar: url })}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  {profileData?.name || session?.user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                  {membership === "blackcard"
                    ? "Black Card Elite"
                    : membership === "globetrotter"
                    ? "Globetrotter Club"
                    : "Explorer Member"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{profileData?.email || session?.user?.email}</p>
              {profileData?.location && (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {profileData.location}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="text-center sm:text-right bg-slate-50 p-3 px-4 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Loyalty Points
              </span>
              <span className="font-serif text-xl font-bold text-orange-600">
                {profileData?.loyaltyPoints || 100} pts
              </span>
            </div>

            <div className="text-center sm:text-right bg-slate-50 p-3 px-4 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Completed Expeditions
              </span>
              <span className="font-serif text-xl font-bold text-slate-900">
                {profileData?.tripsCount || 0}
              </span>
            </div>

            {membership === "free" && (
              <Link
                href="/pricing"
                className="px-4 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade VIP</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "bookings", label: `My Bookings (${bookings.length})`, icon: CalendarCheck },
          { id: "wishlist", label: `Saved Wishlist (${wishlist.length})`, icon: Bookmark },
          { id: "ai-plans", label: `AI Itineraries (${savedPlans.length})`, icon: Sparkles },
          { id: "settings", label: "Profile & Preferences", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: My Bookings */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={booking.destinationImage}
                      alt={booking.destinationTitle}
                      className="w-24 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                          Ref: {booking.bookingReference}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {booking.status}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                        {booking.destinationTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Departure: <strong>{booking.travelDate}</strong> • {booking.guestsCount} Traveler(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Paid
                      </span>
                      <span className="font-serif text-xl font-bold text-slate-900">
                        ${booking.totalPrice.toLocaleString()} USD
                      </span>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">No active bookings yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Your future adventures will appear here. Explore our signature 2026 horizons to reserve your next journey.
              </p>
              <Link
                href="/destinations"
                className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Browse Expeditions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Wishlist */}
      {activeTab === "wishlist" && (
        <div>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} isWishlisted={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Your wishlist is empty</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any expedition to curate your personal dream destinations collection.
              </p>
              <Link
                href="/destinations"
                className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Explore Destinations
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved AI Plans */}
      {activeTab === "ai-plans" && (
        <div className="space-y-6">
          {savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full">
                        {plan.destination}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {plan.durationDays} Days • {plan.travelStyle}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Itinerary Days Summary:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {plan.itinerary?.slice(0, 3).map((d: any) => (
                          <li key={d.day} className="truncate">
                            <strong>Day {d.day}:</strong> {d.theme}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Est. {plan.estimatedCost?.total || "Custom"}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Plan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">No saved AI itineraries</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Generate custom bespoke travel schedules with our Groq AI engine and save them to your profile.
              </p>
              <Link
                href="/ai-planner"
                className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Launch AI Architect
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Account Settings */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card max-w-3xl">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
            Account & Traveler Preferences
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Phone / WhatsApp (for Concierge)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Home City / Country
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Zurich, Switzerland"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Traveler Bio & Dietary Preferences
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell our concierge about your travel style, preferred airlines, or dietary needs..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
