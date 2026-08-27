import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "HERO TRAVEL — Luxury Expeditions & AI Travel Architect",
  description: "Curated world-class luxury expeditions, private yacht charters, alpine retreats, and instant AI travel itineraries.",
  keywords: ["Luxury Travel", "Bespoke Expeditions", "AI Trip Planner", "Amalfi Coast", "Kyoto", "Swiss Alps", "Patagonia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
