"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Compass, Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid credentials.");
        setLoading(false);
      } else {
        toast.success("Welcome back to Hero Travel!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail("vip.nomad@herotravel.com");
    setPassword("LuxuryTravel2026!");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-9 h-9 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold text-slate-900">
              HERO<span className="text-orange-600 font-sans font-light tracking-widest ml-1 text-xs">TRAVEL</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            Sign In to Your Portal
          </h2>
          <p className="text-xs text-slate-500">
            Access your active itineraries, saved wishlists, and VIP privileges.
          </p>
        </div>

        {/* Demo Fast Fill Button */}
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="w-full py-2.5 px-3 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/70 text-orange-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Click to autofill sample credentials</span>
        </button>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account yet? </span>
          <Link href="/auth/signup" className="text-orange-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
