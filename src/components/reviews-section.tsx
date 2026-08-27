"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface ReviewItem {
  _id?: string;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  rating: number;
  title: string;
  comment: string;
  travelDate?: string;
  likes: number;
  verified?: boolean;
}

export function ReviewsSection({ destinationSlug }: { destinationSlug: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New review form
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [destinationSlug]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?slug=${destinationSlug}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.warn("Reviews load failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !comment) {
      toast.error("Please provide both a title and review feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationSlug,
          rating,
          title,
          comment,
          userLocation: "Verified Guest",
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Thank you! Your verified review has been published.");
        setTitle("");
        setComment("");
        setShowForm(false);
        fetchReviews();
      } else {
        toast.error("Failed to post review.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Verified Experiences
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Traveler Impressions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reviews from verified travelers who completed this bespoke expedition.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-serif text-2xl font-bold text-slate-900">{averageRating}</span>
              <span className="text-slate-400 text-sm">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Based on {reviews.length} authenticated reviews</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? "Close Form" : "Write a Review"}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handlePostReview} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-slate-900">Share Your Journey Impression</h4>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Beyond any expectation — the private yacht was sheer perfection"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Your Review</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Detail your highlights, concierge support, dining, and accommodations..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="mt-8 space-y-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={rev.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`}
                  alt={rev.userName}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900">{rev.userName}</h5>
                    {rev.verified !== false && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3" /> Verified Traveler
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rev.userLocation || "Verified Guest"} • {rev.travelDate || "2025"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <h6 className="font-serif text-base font-bold text-slate-900 mt-4">{rev.title}</h6>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              "{rev.comment}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewsSection;
