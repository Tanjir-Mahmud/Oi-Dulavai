'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Sparkles,
  Ruler,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  Layers,
} from 'lucide-react';

interface ProductDetailProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    bengaliName?: string | null;
    subtitle?: string | null;
    description: string;
    editorialStory?: string | null;
    category: string;
    fabric: string;
    weaveOrigin: string;
    gsm?: number | null;
    basePrice: number;
    compareAtPrice?: number | null;
    images: Array<{ url: string; altText?: string | null; viewType?: string }>;
    variants: Array<{ id: string; size: string; color: string; colorHex?: string | null; inventoryCount: number; priceAdjustment: number }>;
    hotspots: Array<{ id: string; label: string; spec: string; xPos: number; yPos: number }>;
    reviews: Array<{ id: string; authorName: string; authorTitle?: string | null; rating: number; comment: string }>;
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, openSizeGuide, currency } = useAtelierStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('40');
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || 'Golden Mustard');
  const [sizingMode, setSizingMode] = useState<'rtw' | 'bespoke'>('rtw');

  // Bespoke Customization State
  const [bespokeChest, setBespokeChest] = useState(40);
  const [bespokeLength, setBespokeLength] = useState(42);
  const [bespokeCollar, setBespokeCollar] = useState('Architectural Band Collar');

  // Monogramming State
  const [monogramEnabled, setMonogramEnabled] = useState(false);
  const [monogramInitials, setMonogramInitials] = useState('AMC');
  const [monogramThread, setMonogramThread] = useState<'ANTIQUE_GOLD' | 'STERLING_SILVER' | 'TONE_ON_TONE'>('ANTIQUE_GOLD');
  const [monogramPlacement, setMonogramPlacement] = useState<'CUFF' | 'PLACKET_BASE' | 'CHEST_POCKET'>('CUFF');

  const currentImage = product.images[activeImageIndex]?.url || product.images[0]?.url;
  const inWishlist = isInWishlist(product.sku);

  // Variant matching
  const matchedVariant = product.variants.find(
    (v) => v.size === selectedSize && (v.color === selectedColor || !v.color)
  );

  const priceAdjustment = sizingMode === 'bespoke' ? 3500 : matchedVariant?.priceAdjustment || 0;
  const unitPrice = product.basePrice + priceAdjustment;
  const stockCount = matchedVariant?.inventoryCount || 6;

  const handleAddToBag = () => {
    addToCart({
      productId: product.id,
      variantId: matchedVariant?.id,
      sku: `${product.sku}-${selectedSize}-${selectedColor.toUpperCase().replace(/\s+/g, '_')}`,
      title: product.name,
      image: currentImage,
      size: sizingMode === 'bespoke' ? 'Bespoke' : selectedSize,
      color: selectedColor,
      price: unitPrice,
      quantity: 1,
      textileSpec: `${product.fabric} • ${product.gsm ? `${product.gsm} GSM` : 'Artisanal'}`,
      monogramText: monogramEnabled ? monogramInitials : undefined,
      monogramThread: monogramEnabled ? monogramThread : undefined,
    });
  };

  const handleInstantCheckout = () => {
    handleAddToBag();
    router.push('/checkout');
  };

  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color))
  ).map((c) => {
    const v = product.variants.find((item) => item.color === c);
    return { name: c, hex: v?.colorHex || '#B8893A' };
  });

  const rtwSizes = ['38', '40', '42', '44', '46'];

  return (
    <div className="w-full">
      {/* Editorial Breadcrumbs */}
      <div className="border-b border-outline-variant/60 py-3 bg-surface-container-low font-spec-code-sm text-spec-code-sm text-on-surface-variant">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Atelier
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-primary transition-colors">
            Collections
          </Link>
          <span>/</span>
          <Link
            href={`/collections?category=${product.category}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-on-surface font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Hero Gallery & Purchasing Console */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* LEFT COLUMN: Multi-Angle Gallery & Focal Hotspots (7 Cols) */}
          <div className="lg:col-span-7 space-y-space-md">
            <div className="flex flex-col-reverse md:flex-row gap-space-md">
              {/* Thumbnails Rail */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-secondary shadow-md scale-95'
                        : 'border-outline-variant/60 hover:border-outline opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image Showcase */}
              <div className="relative flex-1 aspect-[4/5] bg-surface-container overflow-hidden border border-outline-variant/60 shadow-xl group">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                  <span className="bg-surface/90 backdrop-blur-md px-3 py-1 font-spec-code-sm text-spec-code-sm uppercase font-semibold text-on-surface shadow-md border border-outline-variant/40">
                    {product.fabric}
                  </span>
                  <span className="bg-secondary text-on-secondary px-2.5 py-0.5 font-spec-code-sm text-spec-code-sm uppercase font-bold tracking-wider">
                    Immediate Vault Reserve
                  </span>
                </div>

                {/* Image Index Counter on Mobile */}
                <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 font-spec-code-sm text-[10px] text-on-surface shadow-sm border border-outline-variant/40">
                  {activeImageIndex + 1} / {product.images.length}
                </div>

                {/* Wishlist Button with 44x44px Touch Target */}
                <button
                  onClick={() =>
                    toggleWishlist({
                      productId: product.id,
                      sku: product.sku,
                      title: product.name,
                      image: currentImage,
                      price: product.basePrice,
                      size: selectedSize,
                      category: product.category,
                      fabric: product.fabric,
                    })
                  }
                  aria-label="Save to Vault"
                  className="absolute top-3 right-3 min-w-[44px] min-h-[44px] rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary shadow-lg transition-transform hover:scale-110 z-10"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      inWishlist ? 'text-secondary fill-secondary' : 'text-on-surface'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Image Dot Pagination */}
            <div className="flex md:hidden items-center justify-center gap-1.5 pt-1">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View Image ${idx + 1}`}
                  className={`h-2 rounded-full transition-all min-h-[20px] min-w-[20px] flex items-center justify-center ${
                    activeImageIndex === idx ? 'w-6 bg-secondary' : 'w-2 bg-outline-variant'
                  }`}
                >
                  <span className="sr-only">Image {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Bottom Micro Visual Spec Bar */}
            <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-3 border border-outline-variant/60 font-spec-code-sm text-spec-code-sm">
              <div className="flex flex-col">
                <span className="text-on-surface-variant uppercase text-[10px]">Fiber Pedigree</span>
                <span className="font-bold text-on-surface">{product.fabric}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant uppercase text-[10px]">Loom Density</span>
                <span className="font-bold text-on-surface">
                  {product.gsm ? `${product.gsm} GSM Weight` : 'Handspun Weight'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant uppercase text-[10px]">Weave Origin</span>
                <span className="font-bold text-on-surface truncate">{product.weaveOrigin}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Buying Console (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            <div className="border-b border-outline-variant/60 pb-space-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-spec-code-sm text-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                  Atelier Edition • Serial #{product.sku}
                </span>
                <span className="font-spec-code-sm text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 font-bold">
                  {stockCount} Left In Dhaka Vault
                </span>
              </div>

              <h1 className="font-headline-lg text-2xl sm:text-3xl lg:text-headline-lg text-on-surface uppercase tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.bengaliName && (
                <p className="font-headline-md text-on-surface-variant text-base">
                  {product.bengaliName}
                </p>
              )}

              {product.subtitle && (
                <p className="font-body-sm text-on-surface-variant text-sm">{product.subtitle}</p>
              )}

              {/* Pricing Box */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="font-headline-lg text-[28px] font-bold text-on-surface">
                  {formatPrice(unitPrice, currency)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-spec-code text-on-surface-variant line-through text-sm">
                    {formatPrice(product.compareAtPrice, currency)}
                  </span>
                )}
                <span className="font-spec-code-sm text-[11px] text-secondary font-bold">
                  (VAT 7.5% Included)
                </span>
              </div>
            </div>

            {/* Color Palette Selector */}
            {uniqueColors.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-label-caps text-label-caps uppercase">
                  <span className="text-on-surface-variant">Shade Selection:</span>
                  <span className="font-bold text-on-surface">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {uniqueColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${
                        selectedColor === c.name
                          ? 'border-secondary bg-secondary/10 font-bold'
                          : 'border-outline-variant/60 hover:border-outline'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-spec-code-sm text-xs">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizing Architecture Modes: RTW vs Bespoke */}
            <div className="space-y-3 pt-2">
              <div className="flex border border-outline-variant/60 bg-surface-container-low font-label-caps text-label-caps uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setSizingMode('rtw')}
                  className={`flex-1 py-2.5 text-center transition-colors font-bold ${
                    sizingMode === 'rtw'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Ready To Wear (RTW)
                </button>
                <button
                  type="button"
                  onClick={() => setSizingMode('bespoke')}
                  className={`flex-1 py-2.5 text-center transition-colors font-bold ${
                    sizingMode === 'bespoke'
                      ? 'bg-secondary text-on-secondary'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Custom Bespoke (+৳ 3,500)
                </button>
              </div>

              {/* RTW Mode Size Grid */}
              {sizingMode === 'rtw' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-label-caps text-label-caps uppercase">
                    <span className="text-on-surface-variant">Select Suiting Size:</span>
                    <button
                      onClick={openSizeGuide}
                      className="text-secondary hover:underline flex items-center gap-1 font-bold lowercase"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 font-spec-code text-spec-code">
                    {rtwSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[44px] flex items-center justify-center border text-center transition-all ${
                          selectedSize === size
                            ? 'bg-primary text-on-primary border-primary font-bold shadow-md'
                            : 'bg-surface hover:border-secondary border-outline-variant/60 text-on-surface'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Bespoke Mode Input Panel */
                <div className="bg-secondary-fixed/20 border border-secondary/30 p-4 space-y-3 font-spec-code-sm text-spec-code-sm animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-secondary uppercase">
                    <span>Bespoke Architectural Fitting</span>
                    <span>Hand-Tailored</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                        Chest Measure (in)
                      </label>
                      <input
                        type="number"
                        min={34}
                        max={54}
                        value={bespokeChest}
                        onChange={(e) => setBespokeChest(Number(e.target.value))}
                        className="w-full bg-surface border border-outline-variant/60 px-2.5 py-1.5 font-spec-code"
                      />
                    </div>
                    <div>
                      <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                        Kurta Length (in)
                      </label>
                      <input
                        type="number"
                        min={38}
                        max={50}
                        value={bespokeLength}
                        onChange={(e) => setBespokeLength(Number(e.target.value))}
                        className="w-full bg-surface border border-outline-variant/60 px-2.5 py-1.5 font-spec-code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Collar Architecture
                    </label>
                    <select
                      value={bespokeCollar}
                      onChange={(e) => setBespokeCollar(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 px-2.5 py-1.5 font-spec-code"
                    >
                      <option>Architectural Band Collar (Classical)</option>
                      <option>High Mandarin Collar (2.25 inch)</option>
                      <option>Contemporary Slit Placket</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Complimentary Monogramming Studio Module */}
            <div className="border border-outline-variant/60 p-3 bg-surface-container-low space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="font-label-caps text-label-caps uppercase font-bold text-on-surface">
                    Complimentary Monogramming
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={monogramEnabled}
                    onChange={(e) => setMonogramEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary" />
                </label>
              </div>

              {monogramEnabled && (
                <div className="pt-2 border-t border-outline-variant/40 grid grid-cols-3 gap-2 font-spec-code-sm text-spec-code-sm animate-in fade-in">
                  <div>
                    <label className="text-on-surface-variant uppercase text-[9px] block">Initials</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={monogramInitials}
                      onChange={(e) => setMonogramInitials(e.target.value.toUpperCase())}
                      className="w-full bg-surface border border-outline-variant/60 px-2 py-1 uppercase text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-on-surface-variant uppercase text-[9px] block">Thread</label>
                    <select
                      value={monogramThread}
                      onChange={(e) => setMonogramThread(e.target.value as any)}
                      className="w-full bg-surface border border-outline-variant/60 px-1 py-1 text-xs"
                    >
                      <option value="ANTIQUE_GOLD">Antique Gold</option>
                      <option value="STERLING_SILVER">Silver</option>
                      <option value="TONE_ON_TONE">Tone-on-Tone</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-on-surface-variant uppercase text-[9px] block">Placement</label>
                    <select
                      value={monogramPlacement}
                      onChange={(e) => setMonogramPlacement(e.target.value as any)}
                      className="w-full bg-surface border border-outline-variant/60 px-1 py-1 text-xs"
                    >
                      <option value="CUFF">Right Cuff</option>
                      <option value="PLACKET_BASE">Placket Base</option>
                      <option value="CHEST_POCKET">Chest Pocket</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Commercial CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToBag}
                className="w-full bg-primary hover:bg-secondary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add To Staged Bag • {formatPrice(unitPrice, currency)}</span>
              </button>

              <button
                type="button"
                onClick={handleInstantCheckout}
                className="w-full bg-secondary text-on-secondary hover:bg-primary py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border border-secondary shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>1-Click Immediate bKash Checkout</span>
              </button>
            </div>

            {/* Trust & Chauffeur Perks Strip */}
            <div className="pt-space-sm border-t border-outline-variant/40 space-y-2 font-spec-code-sm text-spec-code-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-secondary shrink-0" />
                <span>Complimentary Chauffeur Same-Day Evening Delivery in Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-secondary shrink-0" />
                <span>Two-Size Doorstep Trial Included (Keep the perfect fit)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>100% Rajshahi Sericulture Certificate of Origin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Add To Bag Bar (Fixed above mobile bottom nav) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-spec-code-sm text-[10px] uppercase text-on-surface-variant">
            {sizingMode === 'rtw' ? `Size ${selectedSize} • RTW` : 'Custom Bespoke'}
          </span>
          <span className="font-headline-md text-base font-bold text-on-surface leading-tight">
            {formatPrice(unitPrice, currency)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSizeGuide}
            className="p-2 border border-outline-variant text-on-surface hover:text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center bg-surface"
            aria-label="View Size Guide"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleAddToBag}
            className="bg-primary hover:bg-secondary text-on-primary px-4 py-2.5 font-label-caps text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-lg min-h-[44px] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add To Bag</span>
          </button>
        </div>
      </div>

      {/* Below the Fold: Bento Visual Story Grid */}
      <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/60">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
          <div className="border-b border-outline-variant/40 pb-space-sm">
            <span className="font-spec-code-sm text-spec-code-sm text-secondary uppercase font-bold tracking-widest">
              Atelier Provenance
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-1">
              Textile Pedigree & Craft Disclosures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="bg-surface p-space-md border border-outline-variant/60 shadow-sm space-y-3">
              <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-wider">
                01 • Rajshahi Sericulture
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Wild Mulberry Cocoon Reeling
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                Hand-harvested in Barendra silk basins. Reeled without synthetic coatings to preserve the raw slub texture that breathes naturally in Bengal climates.
              </p>
            </div>

            <div className="bg-surface p-space-md border border-outline-variant/60 shadow-sm space-y-3">
              <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-wider">
                02 • Ancestral Zari Filigree
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                24K Antique Bullion Embroidery
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                Placket and collar couching executed with metallic bullion wire. Finished with hidden horn buttons turned from water buffalo horn.
              </p>
            </div>

            <div className="bg-surface p-space-md border border-outline-variant/60 shadow-sm space-y-3">
              <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-wider">
                03 • Dhaka Tailoring Discipline
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Architectural Floating Interlining
              </h3>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                Fused collars warp over time; our collars utilize floating horsehair canvas interlinings that mold gracefully to your cervical spine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reviews & Testimonials */}
      {product.reviews.length > 0 && (
        <section className="w-full py-space-xl bg-surface border-t border-outline-variant/40">
          <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-md">
            <div className="border-b border-outline-variant/40 pb-space-xs">
              <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                Patron Endorsements
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-1">
                Verified Atelier Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-surface-container-low p-space-md border border-outline-variant/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">{rev.authorName}</h4>
                      <p className="font-spec-code-sm text-[11px] text-secondary">
                        {rev.authorTitle || 'Verified Patron'}
                      </p>
                    </div>
                    <div className="flex text-secondary text-sm">★★★★★</div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
