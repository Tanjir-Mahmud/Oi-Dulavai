# Oi Dulavai — Luxury Menswear E-Commerce Engine

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-gold.svg)]()

> **Oi Dulavai** is an enterprise-grade, high-performance, full-stack luxury menswear e-commerce web platform. Designed with an artisanal visual identity featuring warm ivory canvases, deep obsidian typography, and hand-stitched gold accents (`#D4AF37`), the platform delivers an uncompromising high-fashion digital shopping experience backed by bank-grade financial security and atomic transaction integrity.

---

## Key Highlights & Architectural Features

### 1. Storefront Experience
- **Haute Couture Aesthetic:** Styled using tailored typography (`Playfair Display` serif & geometric sans), fluid micro-interactions, luxury badge pill tokens, and high-fidelity product imagery.
- **Dynamic Catalog & Multi-Facet Filtering:** Instant filtering across luxury categories (Panjabi, Sherwani, Nehru Jackets, Kurtas, Formal Footwear), bespoke sizing (`38` - `46`), colors, artisanal fabrics (Pure Mulberry Silk, Handloom Jacquard, Merino Wool), and price tiers.
- **Rich Product Detail Pages (PDP):**
  - High-resolution gallery carousel with hover inspection zoom.
  - SKU-bound variant selector with real-time stock availability counter.
  - Interactive bespoke sizing guide modal with exact measurements (Chest, Shoulder, Length, Collar).
  - Editorial styling notes, master artisan provenance badges, and verified customer reviews.
- **Cart & Seamless 2-Step Checkout:**
  - Persistent slide-out luxury drawer cart with dynamic free-shipping threshold bar.
  - Dedicated cart page and streamlined 2-step checkout (`Delivery Address` ➔ `Payment Method`).
  - Server-validated promotional voucher engine (e.g., `DULAVAI15` for 15% VIP reduction, `ROYAL1000` for ৳1,000 off).

### 2. Financial Security & Anti-Tampering Engine
- **Server-Side Price Calculation:** Client-side prices, discounts, and order amounts are never trusted. Total costs, tax (VAT 5%), and delivery fees are recomputed on the server from the database ground truth at the exact moment of order creation.
- **Atomic Database Transactions:** Employs atomic database transactions to eliminate race conditions and prevent inventory overselling during concurrent checkouts.
- **Bank-Grade Security Headers:** Full security header suite configured via middleware:
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
- **Granular Role-Based Access Control (RBAC):** Middleware-level route guards separating `SUPER_ADMIN`, `STORE_MANAGER`, `INVENTORY_CONTROLLER`, and `CUSTOMER`.
- **Zod Schema Parsing:** Universal input validation on all client forms, Server Actions, and API boundaries.

### 3. Patron & Admin Portals
- **Customer Account Portal:** Order history, real-time shipment milestone timeline (`Confirmed` ➔ `In Stitching Atelier` ➔ `Quality Inspected` ➔ `Dispatched` ➔ `Delivered`), and printable/downloadable VAT-compliant tax invoices.
- **Executive Admin Console (`/admin`):**
  - **Live Analytics:** Gross Merchandise Value (GMV), net sales, conversion rates, and real-time low-inventory alerts.
  - **Catalog Management:** Multi-variant garment creator with SKU generation, fabric tagging, and stock threshold monitoring.
  - **Order State Machine:** Order processing state transitions with one-click packaging slips and VAT invoice generation.
  - **Voucher Suite:** Promo code manager with discount limits, expiry dates, and minimum spend requirements.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, Lucide Icons, Custom Design Tokens |
| **State Management** | Zustand (Persistent Cart Store), React Suspense |
| **Database & ORM** | PostgreSQL / SQLite with Prisma ORM |
| **Validation** | Zod (universal schema validation) |
| **Security & Auth** | Jose (JWT), HTTP-only cookies, Web Crypto API |

---

## Directory Structure

```plaintext
├── app/
│   ├── (storefront)/
│   │   ├── collections/        # Multi-facet filtered catalog
│   │   ├── product/[slug]/     # PDP with gallery, sizing modal & SKU toggles
│   │   ├── cart/               # Dedicated full cart view
│   │   ├── checkout/           # 2-step atomic checkout flow
│   │   ├── account/            # Customer order tracker & dashboard
│   │   ├── login/              # Secure patron authentication
│   │   └── page.tsx            # Editorial home page showcase
│   ├── admin/                  # Administrative operations console
│   │   ├── orders/             # Order state-machine manager
│   │   ├── products/           # Catalog & variant stock manager
│   │   ├── vouchers/           # Discount codes & promo engine
│   │   └── page.tsx            # Executive KPI & sales dashboard
│   ├── api/                    # Route handlers (auth, checkout, vouchers, admin)
│   └── layout.tsx              # Root luxury layout with slide-out cart drawer
├── components/
│   ├── layout/                 # Luxury Header, Navigation & Artisan Footer
│   ├── cart/                   # Slide-out drawer cart with quick actions
│   ├── ui/                     # Reusable design tokens, buttons, modals, badges
│   └── ...
├── lib/
│   ├── prisma.ts               # Prisma database singleton client
│   ├── auth.ts                 # JWT signing, verification & password hashing
│   ├── cache.ts                # In-memory LRU / distributed cache interface
│   ├── rateLimiter.ts          # Sliding window rate limiter
│   └── security.ts             # Input sanitization and token utilities
├── prisma/
│   ├── schema.prisma           # Relational schema (Users, Products, Variants, Orders, Items, Coupons)
│   └── seed.mjs                # Artisanal seed catalog, variants & VIP accounts
├── services/
│   ├── productService.ts       # Product queries & faceted catalog filtering
│   ├── orderService.ts         # Atomic checkout, invoice calculation & state machine
│   ├── couponService.ts        # Promo code evaluation & redemption engine
│   └── adminService.ts         # Analytics aggregation & catalog operations
└── middleware.ts               # RBAC route protection, CSP & security headers
```

---

## Quick Start & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tanjir-Mahmud/Oi-Dulavai.git
cd Oi-Dulavai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` and `JWT_SECRET` are configured.

### 4. Database Setup & Seeding
Generate Prisma client and seed the catalog with artisanal menswear garments and default demo accounts:
```bash
npx prisma db push
node prisma/seed.mjs
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm start
```

---

## Pre-Configured Demo Credentials

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Super Admin** | `admin@oidulavai.luxury` | `RoyalAdmin2026!` | `/admin` |
| **VIP Patron** | `patron@dulavai.com` | `LuxuryPatron2026!` | `/account` |

### Active Promo Codes
- `DULAVAI15`: 15% discount on all artisanal collections.
- `ROYAL1000`: ৳1,000 flat discount on orders over ৳10,000.

---

## Engineering Standards & Quality Assurance
- **Zero Mock Policy:** All routes and services query live relational database models.
- **Strictly Typed:** Clean TypeScript compilation with strict checking.
- **Production Verified:** Verified with end-to-end integration test suites covering concurrent checkouts, rate limiting, and invoice generation.

---

© 2026 Oi Dulavai Luxury Menswear. All rights reserved.
