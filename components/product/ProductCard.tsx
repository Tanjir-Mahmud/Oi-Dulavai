'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Heart, ChevronRight, Zap } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    fabric: string;
    gsm?: number | null;
    basePrice: number;
    images: Array<{ url: string; altText?: string | null }>;
    variants?: Array<{ id: string; size: string; inventoryCount: number }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, currency } = useAtelierStore();
  const [selectedSize, setSelectedSize] = useState('40');

  const mainImage =
    product.images[0]?.url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc';

  const inWishlist = isInWishlist(product.sku);
  const availableSizes = ['38', '40', '42', '44', '46'];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      sku: `${product.sku}-${selectedSize}`,
      title: product.name,
      image: mainImage,
      size: selectedSize,
      price: product.basePrice,
      quantity: 1,
      textileSpec: `${product.fabric}${product.gsm ? ` • ${product.gsm} GSM` : ''}`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      productId: product.id,
      sku: product.sku,
      title: product.name,
      image: mainImage,
      price: product.basePrice,
      size: selectedSize,
      category: 'Panjabi',
      fabric: product.fabric,
    });
  };

  return (
    <div className="group relative flex flex-col bg-surface-container-lowest shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/40">
      {/* 4:5 Editorial Image Viewport */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
        <Link href={`/product/${product.slug}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          <span className="bg-surface/90 backdrop-blur-md px-2.5 py-1 font-spec-code-sm text-spec-code-sm uppercase font-semibold text-on-surface shadow-sm">
            {product.fabric}
          </span>
          <span className="bg-secondary text-on-secondary px-2 py-0.5 font-spec-code-sm text-spec-code-sm uppercase font-bold tracking-wider">
            Fast Courier
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to Wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'text-secondary fill-secondary' : 'text-on-surface'
            }`}
          />
        </button>

        {/* Inline Size Selector Strip (Docked on hover) */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/95 text-on-primary backdrop-blur-md p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 font-spec-code-sm text-spec-code-sm">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-2 py-1 transition-colors ${
                  selectedSize === size
                    ? 'bg-secondary text-on-secondary font-bold'
                    : 'bg-surface-container-high/30 hover:bg-secondary text-on-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            type="button"
            className="bg-secondary text-on-secondary font-label-caps text-label-caps uppercase px-3 py-1 hover:bg-surface hover:text-primary transition-colors tracking-widest font-bold flex items-center gap-1"
          >
            <span>Add</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-space-md flex flex-col justify-between flex-1 gap-space-xs">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant font-spec-code-sm text-spec-code-sm">
            <span>
              {product.gsm ? `GSM: ${product.gsm} • ` : ''}
              {product.fabric.split(' ')[0]}
            </span>
            <span className="text-secondary font-semibold">In Vault (Ready)</span>
          </div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-headline-md text-headline-md text-on-surface mt-1 group-hover:text-secondary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30 mt-2">
          <span className="font-spec-code text-spec-code font-bold text-on-surface text-[15px]">
            {formatPrice(product.basePrice, currency)}
          </span>
          <button
            onClick={handleQuickAdd}
            className="font-label-caps text-label-caps uppercase tracking-wider text-primary hover:text-secondary underline transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-secondary" />
            <span>Instant Reserve</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
