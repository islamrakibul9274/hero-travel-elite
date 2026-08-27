# 🧭 Hero Travel Elite - 2026 Full-Stack Luxury Expedition & AI Architecture Platform

A high-performance, production-grade **Next.js 15** application crafted for modern luxury travel curation, real-time social proof, and intelligent itinerary planning. Featuring a pristine **2026 Light Editorial Luxury UI** (avoiding dated dark themes and purple gradients), this platform delivers seamless small-group bookings, Stripe checkout, Groq-powered AI itinerary generation, Pusher WebSockets real-time activity feeds, NextAuth credentials security, and Cloudinary CDN media management.

---

## 🚀 Live Links

* **Production Application (Netlify):** [https://hero-travel-elite.netlify.app/](https://hero-travel-elite.netlify.app/)
* **GitHub Repository:** [https://github.com/islamrakibul9274/hero-travel-elite](https://github.com/islamrakibul9274/hero-travel-elite)

---

## ✨ Key Features

### 🌍 Traveler Experience & Expedition Catalog

* **Curated 2026 World Collection:** Handcrafted small-group luxury expeditions spanning the Amalfi Coast, Kyoto, Swiss Alps, Bali Archipelago, Iceland Ice Caves, and Patagonian Fjords.
* **Interactive Roadmaps & Day Blueprints:** Detailed morning, afternoon, and evening timelines with dining recommendations, inclusions/exclusions checklists, and interactive photo galleries.
* **Smart Multi-Criteria Search & Filter:** Real-time filtering by region (Europe, Asia, Americas, Africa), travel style (Riviera, Alpine, Cultural, Wellness, Expedition), and price sorting.
* **Bespoke Reservation Engine:** Live pricing calculation with guest count, VIP add-on toggles (Scenic Helicopter +$450, Private Chef +$350, Premium Travel Insurance +$120), and instant Stripe checkout.
* **Optimistic Wishlist & Reviews:** Verified traveler rating breakdown with authenticated review submission.

### ⚡ AI Travel Architect (Groq Engine)

* **Sub-Second Itinerary Generation:** Powered by Groq's high-speed inference LPU hardware (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`), generating complete multi-day itineraries in under 2 seconds.
* **Personalized Travel Personas:** Custom tailoring based on destination, duration (3–14 days), travel vibe, budget level, and party type (Solo, Couple, Family, Group).
* **Curator Secrets & Packing Checklists:** Delivers unlisted local insider tips, estimated cost breakdowns, and climate-specific packing essentials.
* **Save to Dashboard & Printable Export:** Instantly persist generated itineraries to the user's profile or print formatted travel passes.

### 👑 VIP Travel Club & Memberships

* **3-Tier Membership Architecture:** Dedicated pricing matrix for **Explorer (Free)**, **Globetrotter Club ($19/mo or $190/yr)**, and **Black Card Elite ($49/mo or $490/yr)**.
* **Privileged Savings & Concierge:** 10% to 20% package discounts, 24/7 dedicated WhatsApp Travel Butler, complimentary Mercedes airport transfers, and flexible cancellation.
* **Annual Billing Toggle:** Interactive pricing switcher with 20% annual savings calculation and direct Stripe checkout integration.

### 📡 Real-Time WebSockets & Global Concierge (Pusher & Resend)

* **Live Activity Ticker:** Pusher WebSocket channel broadcasts real-time global bookings and VIP membership upgrades without page refreshes.
* **Transactional Email Automation:** High-end HTML booking passes and receipts dispatched via Resend API.
* **24/7 Global Concierge Desk:** Dedicated inquiry form with international atelier hubs (London, Tokyo, Zurich, New York).

### 👤 User Profile & Account Security

* **Centralized Traveler Portal:** Unified management for active bookings, saved wishlists, saved AI plans, and loyalty reward points.
* **Cloudinary CDN Integration:** Direct profile photo / avatar upload with real-time base64 encoding and CDN optimization.
* **Rock-Solid NextAuth Security:** Secure bcrypt password hashing, JWT sessions, and zero-session-bug architecture with resilient MongoDB Atlas connection pooling and memory store fallback.

---

## 💻 Tech Stack

**Frontend & Framework:**

* Next.js 15 (App Router & Server Components)
* React 19 & TypeScript
* Tailwind CSS (2026 Light Editorial Palette & Glassmorphism)
* Lucide React (Icons)
* Framer Motion (Micro-animations)
* Canvas Confetti (Celebration effects)
* Sonner (Toast notifications)

**Backend & Database:**

* Next.js API Routes & Server Actions
* MongoDB Atlas (Database)
* Mongoose (ODM with connection caching)
* NextAuth.js / Auth.js (JWT Session & Credentials Provider)
* BcryptJS (Password Hashing)

**Cloud Services & APIs:**

* **Groq SDK** — High-speed AI travel architecture
* **Stripe** — Secure payments, checkout sessions & VIP subscriptions
* **Pusher WebSockets** — Real-time live activity broadcasts
* **Resend API** — Transactional HTML email dispatch
* **Cloudinary CDN** — Media and user avatar storage
* **Netlify** — Production hosting with Next.js Runtime

---

## 🛠 Local Setup Instructions

### 1. Prerequisites

* Node.js (v18.18 or higher / Node 20+)
* npm (v9 or higher)
* MongoDB Atlas cluster
* Groq API Key
* Stripe Account (Test Keys)
* Pusher Account
* Resend API Key
* Cloudinary Account

### 2. Clone the Repository

```bash
git clone https://github.com/islamrakibul9274/hero-travel-elite.git
cd hero-travel-elite
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration (MongoDB Atlas)
MONGODB_URI=your_mongodb_connection_string

# Authentication (NextAuth / Auth.js)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your_nextauth_secret_key
AUTH_URL=http://localhost:3000

# AI Integration (Groq)
GROQ_API_KEY=your_groq_api_key

# Payments & Billing (Stripe)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Transactional Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Media CDN (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Real-Time WebSockets (Pusher)
PUSHER_APP_ID=your_pusher_app_id
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=mt1

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Production Deployment

This application is fully optimized for edge and serverless deployment on **Netlify** using the `@netlify/plugin-nextjs` runtime. All API routes, dynamic parameter paths, NextAuth callbacks, and Stripe webhooks are configured for zero-friction production execution.

---

## 👤 Author

**Rakibul Islam Rumel**

* GitHub: [@islamrakibul9274](https://github.com/islamrakibul9274)
* Project Repo: [hero-travel-elite](https://github.com/islamrakibul9274/hero-travel-elite)

---

## 📜 License

MIT License © 2026 Hero Travel Technologies Inc. All rights reserved.
