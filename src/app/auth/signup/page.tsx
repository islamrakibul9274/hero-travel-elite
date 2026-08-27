"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Sparkles, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        toast.success("Account created! Logging you in...");

        // Auto sign in
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (!signInRes?.error) {
          router.push("/profile");
          router.refresh();
        } else {
          router.push("/auth/signin");
        }
      } else {
        toast.error(data.error || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Registration request failed.");
      setLoading(false);
    }
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
            Create Your Explorer Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the community and receive 250 welcome loyalty bonus points.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alexander Wright"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

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
                placeholder="alexander@example.com"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Join Hero Travel"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already have an account? </span>
          <Link href="/auth/signin" className="text-orange-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
