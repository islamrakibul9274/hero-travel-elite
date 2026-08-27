# HERO TRAVEL // ELITE EXPEDITIONS & AI TRAVEL ARCHITECT

A production-grade, full-stack luxury travel platform built with Next.js 15 App Router, React 19, Tailwind CSS, TypeScript, and a high-editorial 2026 Light Luxury UI aesthetic.

---

## 🌟 Key Features

* **Light Editorial Luxury UI (2026)**: Warm Sand, Pure Porcelain, and Terracotta Sunset palette with high-contrast Obsidian typography and smooth micro-interactions.
* **AI Travel Architect (Groq)**: Instantaneous multi-day custom itinerary generation powered by high-speed inference.
* **Payments & VIP Club Memberships (Stripe)**: Dynamic package reservation pricing and 3-Tier VIP Membership checkout.
* **Real-Time WebSockets (Pusher)**: Live booking notifications and activity broadcast across global travelers.
* **Authentication & Dashboard (NextAuth & MongoDB)**: Credentials authentication, user profile management, active bookings, wishlists, and saved AI itineraries.
* **Cloudinary CDN**: Real-time user avatar and review photo uploads.
* **Transactional Email (Resend)**: Automated HTML booking confirmations and concierge dispatch.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Framer Motion
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: NextAuth.js (Auth.js) with JWT session
- **AI**: Groq SDK (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`)
- **Payments**: Stripe API & Checkout Sessions
- **Real-Time**: Pusher WebSockets Server & Client
- **Email**: Resend API
- **Media**: Cloudinary CDN

---

## 🚀 Getting Started

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/islamrakibul9274/hero-travel-elite.git
   cd hero-travel-elite
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📜 License
MIT License © 2026 Hero Travel Technologies Inc.
