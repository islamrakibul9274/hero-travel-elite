"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Compass,
  Sparkles,
  Crown,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  CalendarCheck,
  ShieldCheck,
  PhoneCall,
  Search,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Destinations", href: "/destinations" },
    {
      name: "AI Architect",
      href: "/ai-planner",
      badge: "AI 2026",
    },
    { name: "VIP Club & Pricing", href: "/pricing" },
    { name: "Concierge", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
          : "bg-white/80 backdrop-blur-sm border-b border-slate-100/60 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-black tracking-tight text-slate-900 leading-none">
                HERO<span className="text-orange-600 font-sans font-light tracking-widest ml-1 text-sm">TRAVEL</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-0.5">
                Luxury Expeditions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-orange-600 bg-orange-50/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                      {session.user.name}
                    </p>
                    <p className="text-[10px] text-orange-600 font-medium capitalize">
                      {(session.user as any).membershipTier || "Explorer"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in text-sm text-slate-700">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                        <div className="mt-2 flex items-center justify-between text-xs bg-orange-50 text-orange-800 px-2.5 py-1 rounded-lg">
                          <span className="font-medium">Loyalty Reward:</span>
                          <span className="font-bold">{(session.user as any).loyaltyPoints || 100} pts</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          My Profile & Settings
                        </Link>
                        <Link
                          href="/profile?tab=bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          My Bookings
                        </Link>
                        <Link
                          href="/profile?tab=wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Saved Wishlist
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-orange-50/50 text-orange-600 font-medium"
                        >
                          <Crown className="w-4 h-4 text-orange-500" />
                          Upgrade VIP Tier
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-600 text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Join VIP Club
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 animate-fade-in shadow-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-600"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold uppercase bg-orange-500 text-white rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-2 pt-2">
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-800 hover:bg-slate-50"
                  >
                    <UserIcon className="w-5 h-5 text-orange-600" />
                    <span>My Profile & Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-xl font-semibold border border-slate-200 text-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center rounded-xl font-semibold bg-orange-600 text-white shadow-md"
                  >
                    Explore VIP Club
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
