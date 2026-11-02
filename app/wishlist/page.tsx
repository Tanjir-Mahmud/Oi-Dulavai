'use client';

import React from 'react';
import Link from 'next/link';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveWishlistToCart, moveAllWishlistToCart, currency } =
    useAtelierStore();

  return (
    <div className="w-full bg-surface py-space-xl min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        <div className="border-b border-outline-variant/60 pb-space-sm flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-xs">
              <Heart className="w-4 h-4 fill-secondary" />
              <span>Patron Saved Vault</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
              Preserved Vault Pieces ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={moveAllWishlistToCart}
              className="bg-primary text-on-primary px-6 py-2.5 font-label-caps text-label-caps uppercase tracking-wider font-bold hover:bg-secondary transition-colors flex items-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All To Bag</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-surface-container-low border border-outline-variant/40 p-12">
            <Heart className="w-16 h-16 text-outline-variant mx-auto stroke-1" />
            <h2 className="font-headline-lg text-on-surface">Your Vault is Currently Empty</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Save your preferred Rajshahi silks, waskotis, and bespoke bridal ensembles here for 24-hour reserve hold.
            </p>
            <Link
              href="/collections"
              className="inline-block mt-4 bg-primary text-on-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold shadow-md"
            >
              Curate Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
            {wishlist.map((item) => (
              <div
                key={item.sku}
                className="bg-surface-container-lowest border border-outline-variant/60 shadow-md group flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.sku)}
                    aria-label="Remove"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 flex items-center justify-center text-on-surface hover:text-error transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-surface/90 px-2 py-0.5 font-spec-code-sm text-[10px] uppercase font-bold text-on-surface">
                    {item.fabric || 'Atelier Weave'}
                  </div>
                </div>

                <div className="p-space-md space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface text-base line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="font-spec-code text-spec-code font-bold text-on-surface mt-1">
                      {formatPrice(item.price, currency)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                    <button
                      onClick={() => moveWishlistToCart(item.sku)}
                      className="w-full bg-secondary hover:bg-primary text-on-secondary py-2 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Stage In Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
