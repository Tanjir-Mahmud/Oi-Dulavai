import React from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';
import HomeClientInteractions from './HomeClientInteractions';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Scissors,
  Clock,
  Truck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  const featuredProducts = await productService.getFeatured();
  const trendingProducts = await productService.getTrending();

  return (
    <div className="flex flex-col w-full">
      {/* Client micro-interactions (countdown timer, toast logic) */}
      <HomeClientInteractions />

      {/* Top Dispatch Urgency Bar */}
      <section className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 px-margin-mobile lg:px-margin border-b border-secondary/20">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-space-xs font-label-caps text-label-caps">
          <div className="flex items-center gap-space-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span className="tracking-widest uppercase font-bold">Express Same-Day Courier:</span>
            <span className="text-on-secondary-fixed-variant">
              Order within <span className="font-spec-code text-spec-code font-bold" id="countdown-timer">01h 48m 22s</span> for guaranteed Banani, Gulshan & Uttara delivery tonight
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-spec-code-sm text-spec-code-sm uppercase bg-surface/80 px-2 py-0.5 shadow-sm">
              Dhaka Hub • Live Staging
            </span>
            <a href="#catalog-grid" className="underline tracking-wider hover:text-secondary transition-colors font-bold">
              Instant Reserve
            </a>
          </div>
        </div>
      </section>

      {/* Hero Cinematic Stage */}
      <section className="relative w-full min-h-[90vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYUcir0k4E8-2WgWdl4dVyv4zdzUv0w2qlFccpLoTqOuda9xDg4xcSJ6AL4isRUb-KvRzjs3MWKgWNtlhZvckGSP4FkHOLXColbfGCgMHZLvMrvnPZcd7xMuYdnjuYNpkz9NZxx2WC0QGBQoWMAscrHm4NGQB2OmYvSmhCtqI1mWtUa5PcNRKJkGAB_mkxypcDsMNFC6xNSvlAv7M88-76EuM5z2yCFBBlK0VPozQ')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin pb-space-xl pt-36 flex flex-col justify-end">
          <div className="max-w-2xl space-y-space-md">
            <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-spec-code-sm text-spec-code-sm uppercase tracking-widest text-on-surface">
                Summer Solstice • 2025 Trunk Edition
              </span>
            </div>

            <div className="space-y-space-xs">
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl lg:text-headline-xl text-surface-container-lowest leading-none tracking-tight">
                The Imperial Panjabi
              </h1>
              <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-surface-variant max-w-lg leading-relaxed">
                Sculptural silhouettes hand-loomed in Rajshahi. Built with zero excess, punctuated with antique brass bullion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                href="/collections"
                className="bg-surface text-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-[0.2em] font-bold hover:bg-secondary hover:text-on-secondary transition-all shadow-xl flex items-center gap-space-xs"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-space-sm bg-surface-container-lowest/10 backdrop-blur-md p-space-sm border border-white/10 shadow-sm">
            <div className="flex flex-col">
              <span className="font-spec-code-sm text-spec-code-sm text-surface-variant uppercase">Weave Origin</span>
              <span className="font-spec-code text-spec-code text-surface font-semibold">Rajshahi 100% Raw Mulberry</span>
            </div>
            <div className="flex flex-col">
              <span className="font-spec-code-sm text-spec-code-sm text-surface-variant uppercase">Atelier Fitting</span>
              <span className="font-spec-code text-spec-code text-surface font-semibold">Structured Modern Cut</span>
            </div>
            <div className="flex flex-col">
              <span className="font-spec-code-sm text-spec-code-sm text-surface-variant uppercase">Dhaka Vault Stock</span>
              <span className="font-spec-code text-spec-code text-secondary-fixed-dim font-bold">14 Tailored Sets Left</span>
            </div>
            <div className="flex flex-col">
              <span className="font-spec-code-sm text-spec-code-sm text-surface-variant uppercase">Trial Guarantee</span>
              <span className="font-spec-code text-spec-code text-surface font-semibold">Doorstep Fitting in Dhaka</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collection Barometer (Fast Horizontal Nav) */}
      <section className="w-full bg-surface-container-low py-space-md border-y border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between overflow-x-auto gap-space-md no-scrollbar">
          <div className="flex items-center gap-space-sm shrink-0 font-spec-code text-spec-code uppercase text-on-surface-variant">
            <Scissors className="w-4 h-4 text-secondary" />
            <span>Curated Tranches:</span>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <Link
              href="/collections"
              className="px-4 py-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm"
            >
              All Garments (24)
            </Link>
            <Link
              href="/collections?category=Panjabi"
              className="px-4 py-2 bg-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider text-on-surface shadow-sm transition-colors border border-outline-variant/40"
            >
              Rajshahi Silk Panjabis
            </Link>
            <Link
              href="/collections?category=Shirt"
              className="px-4 py-2 bg-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider text-on-surface shadow-sm transition-colors border border-outline-variant/40"
            >
              Fine Irish-Dhaka Linen
            </Link>
            <Link
              href="/collections?category=Waskoti"
              className="px-4 py-2 bg-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider text-on-surface shadow-sm transition-colors border border-outline-variant/40"
            >
              Embroidered Waskoti
            </Link>
            <Link
              href="/collections?category=Sherwani"
              className="px-4 py-2 bg-surface hover:bg-surface-container font-label-caps text-label-caps uppercase tracking-wider text-on-surface shadow-sm transition-colors border border-outline-variant/40"
            >
              Zardozi Velvet Ceremonial
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-space-xs shrink-0 font-spec-code-sm text-spec-code-sm text-secondary">
            <CheckCircle2 className="w-4 h-4" />
            <span>Every Piece Individually Numbered</span>
          </div>
        </div>
      </section>

      {/* Massive Image-Centric Product Grid */}
      <section className="w-full py-space-xl bg-surface" id="catalog-grid">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm border-b border-outline-variant/40 pb-space-md">
            <div>
              <span className="font-spec-code-sm text-spec-code-sm tracking-[0.2em] text-secondary uppercase font-semibold">
                Atelier Edition 04 • Immediate Stock
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight mt-1">
                The Imperial Catalog
              </h2>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-spec-code text-spec-code text-on-surface-variant">
                Selected: <strong className="text-on-surface">{featuredProducts.length} Ready Styles</strong>
              </span>
              <span className="text-outline-variant">/</span>
              <Link
                href="/collections"
                className="font-label-caps text-label-caps tracking-widest uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 6-Product High Velocity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Runway Hotspot & Groom Bundle Section */}
      <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/60">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
          <div className="border-b border-outline-variant/40 pb-space-sm">
            <span className="font-spec-code-sm text-spec-code-sm text-secondary uppercase font-bold tracking-widest">
              Private Client Lookbook • Look 01
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-1">
              The Sovereign Banani Groom Ensemble
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mt-1">
              A 3-piece coordinated ensemble designed for evening receptions and royal matrimony.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Runway Image Stage (Left 7 Cols) */}
            <div className="lg:col-span-7 relative aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant/60 shadow-xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUaZI1Gxvpg47OY13E7EBIZI4Jh-L193R0U5mxFUk_6RigYy4tcIs1fIgKY4ULRu1IGUwY3a5zl-Za_fEvXlbDycztEVPacAKmcYv939EWhqKhHyRLuT2Wie8ONKAGuj3JkmoKOwspDPPY9haIFOO7Ae1Ve_3GNRIvZa_-_YHE7pllxPclvy9OquJqPWV6ItauobhXpRnQheJVaUI_OYfGl03VrM_MumGT-QQTwwo"
                alt="Banani Groom Suite Runway Look"
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 text-xs font-spec-code">
                Model: 6&apos;1&quot; • Wearing Size 40 • Banani Flagship Sample
              </div>
            </div>

            {/* Ensemble Spec Ledger (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-lg space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs">
                <span className="font-spec-code-sm text-spec-code-sm uppercase text-secondary font-bold">
                  Coordinated Set Dossier
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                  Complete 3-Piece Suite
                </h3>
              </div>

              <div className="space-y-space-sm divide-y divide-outline-variant/30 text-body-sm">
                <div className="pt-2 first:pt-0 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-on-surface">1. Imperial Raw Silk Sherwani</h4>
                    <p className="font-spec-code-sm text-[11px] text-on-surface-variant">
                      Size 40 • Mulberry Silk • 340 GSM
                    </p>
                  </div>
                  <span className="font-spec-code font-bold">৳ 28,500</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-on-surface">2. Bengal Gurkha Trousers</h4>
                    <p className="font-spec-code-sm text-[11px] text-on-surface-variant">
                      Size 34 • Irish-Dhaka Linen • Double Pleat
                    </p>
                  </div>
                  <span className="font-spec-code font-bold">৳ 9,200</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-on-surface">3. Hand-Cast Brass Cufflinks</h4>
                    <p className="font-spec-code-sm text-[11px] text-on-surface-variant">
                      Solid Antique Brass • Lost-Wax Casting
                    </p>
                  </div>
                  <span className="font-spec-code font-bold">৳ 4,800</span>
                </div>
              </div>

              <div className="pt-space-sm border-t border-outline-variant/60 space-y-2">
                <div className="flex items-center justify-between font-spec-code text-on-surface-variant">
                  <span>Itemized Total:</span>
                  <span className="line-through">৳ 42,500</span>
                </div>
                <div className="flex items-center justify-between font-spec-code font-bold text-on-surface text-base">
                  <span>Ensemble Tier Price:</span>
                  <span className="text-secondary">৳ 38,500 (Save ৳ 4,000)</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/product/imperial-raw-silk-sherwani"
                  className="w-full bg-secondary hover:bg-primary text-on-secondary py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reserve Sovereign Ensemble</span>
                </Link>

                <p className="text-center font-spec-code-sm text-[10px] text-on-surface-variant">
                  Includes Cedar Keepsake Chest, Mulmul Dustbag, and Personal Chauffeur Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Best-Sellers (Velocity Carousel) */}
      <section className="w-full py-space-xl bg-surface border-t border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
          <div className="flex items-end justify-between border-b border-outline-variant/40 pb-space-sm">
            <div>
              <span className="font-spec-code-sm text-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                Dhaka Metropolitan Demand
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-1">
                Trending Atelier Pieces
              </h2>
            </div>
            <Link
              href="/collections"
              className="font-label-caps text-label-caps uppercase tracking-wider text-secondary hover:underline flex items-center gap-1 font-bold"
            >
              <span>View All Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {trendingProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dhaka Atelier Doorstep Service Banner */}
      <section className="w-full bg-primary text-on-primary py-space-xl">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-8 space-y-space-md">
              <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 font-label-caps text-label-caps uppercase font-bold">
                <Truck className="w-4 h-4 text-secondary" />
                <span>Dhaka Metropolitan Chauffeur Service</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-surface-container-lowest leading-tight">
                White-Glove Doorstep Tailoring & Two-Size Trial
              </h2>
              <p className="font-body-lg text-surface-variant max-w-2xl leading-relaxed">
                We believe true luxury removes all friction. Select your garments, and our suited chauffeur arrives with your selections plus adjacent trial sizes. Inspect the weave under natural light, confirm the drape, and keep only what fits flawlessly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs font-spec-code text-spec-code">
                <div className="border border-outline/30 p-3 bg-white/5">
                  <Clock className="w-5 h-5 text-secondary-fixed-dim mb-1" />
                  <h4 className="font-bold text-white text-sm">Same-Day Evening Delivery</h4>
                  <p className="text-xs text-surface-variant mt-1">Orders confirmed before 4 PM in Banani & Gulshan</p>
                </div>
                <div className="border border-outline/30 p-3 bg-white/5">
                  <Scissors className="w-5 h-5 text-secondary-fixed-dim mb-1" />
                  <h4 className="font-bold text-white text-sm">Master Tailor On-Demand</h4>
                  <p className="text-xs text-surface-variant mt-1">Book home shoulder adjustments and sleeve hems</p>
                </div>
                <div className="border border-outline/30 p-3 bg-white/5">
                  <ShieldCheck className="w-5 h-5 text-secondary-fixed-dim mb-1" />
                  <h4 className="font-bold text-white text-sm">Zero Upfront Pressure</h4>
                  <p className="text-xs text-surface-variant mt-1">Pay via bKash, Card, or COD only upon full satisfaction</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-container-low text-on-surface p-space-lg border border-outline-variant/60 shadow-2xl space-y-space-md">
              <div className="text-center space-y-1">
                <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                  VIP Fitting Lounge
                </span>
                <h3 className="font-headline-md text-headline-md uppercase font-bold text-on-surface">
                  Book A Private Salon Fitting
                </h3>
                <p className="font-body-sm text-on-surface-variant text-xs">
                  Banani Road 11 Flagship or Sylhet Manor
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/contact"
                  className="w-full bg-primary hover:bg-secondary text-on-primary py-3 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Salon Slot</span>
                </Link>
                <Link
                  href="/about"
                  className="w-full text-center border border-primary text-primary hover:bg-surface-container-high py-2.5 font-label-caps text-label-caps uppercase tracking-wider transition-colors block font-semibold text-xs"
                >
                  Explore Atelier Heritage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
