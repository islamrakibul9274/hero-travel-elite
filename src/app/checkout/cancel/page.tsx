"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, Compass } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <XCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Checkout Incomplete
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your transaction was cancelled and no charges were made. Your reservation draft has been preserved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/destinations"
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Explore Expeditions
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
