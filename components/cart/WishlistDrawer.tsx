'use client';

import React from 'react';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { X, Heart, ShoppingBag } from 'lucide-react';

export function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    moveWishlistToCart,
    moveAllWishlistToCart,
    currency,
  } = useAtelierStore();

  if (!isWishlistOpen) return null;

  return (
    <>
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-primary/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-300"
      />

      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col justify-between transition-transform animate-in slide-in-from-right duration-300">
        <div className="p-space-md border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-secondary fill-secondary" />
            <h3 className="font-headline-md text-headline-md tracking-tight uppercase font-bold text-on-surface">
              Saved Vault Pieces
            </h3>
            <span className="font-spec-code-sm text-spec-code-sm bg-secondary text-on-secondary px-2 py-0.5 font-bold">
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="p-1 text-on-surface hover:text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-space-md flex-1 overflow-y-auto space-y-space-md divide-y divide-outline-variant/30">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Heart className="w-12 h-12 text-outline-variant mx-auto stroke-1" />
              <p className="font-headline-md text-on-surface">Your Vault is Empty</p>
              <p className="font-body-sm text-on-surface-variant max-w-xs mx-auto">
                Tap the heart on any heirloom piece to preserve it in your personal vault.
              </p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.sku} className="pt-space-sm first:pt-0 flex gap-space-sm items-start justify-between">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 object-cover bg-surface-container shrink-0 border border-outline-variant/40"
                />
                <div className="flex-1 pl-2">
                  <div className="font-spec-code-sm text-[10px] text-secondary uppercase font-bold">
                    {item.fabric || 'Atelier Vault'}
                  </div>
                  <h4 className="font-label-caps text-label-caps uppercase font-bold text-on-surface">
                    {item.title}
                  </h4>
                  <p className="font-spec-code text-spec-code font-bold text-on-surface mt-1">
                    {formatPrice(item.price, currency)}
                  </p>
                  <div className="flex items-center gap-space-sm mt-2">
                    <button
                      onClick={() => moveWishlistToCart(item.sku)}
                      className="text-secondary hover:underline font-label-caps text-[11px] uppercase tracking-wider font-bold"
                    >
                      Move To Bag
                    </button>
                    <span className="text-outline-variant">•</span>
                    <button
                      onClick={() => removeFromWishlist(item.sku)}
                      className="text-on-surface-variant hover:text-error font-spec-code-sm text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-space-md border-t border-outline-variant/60 bg-surface-container-low space-y-space-xs">
            <button
              onClick={moveAllWishlistToCart}
              className="w-full bg-primary hover:bg-secondary text-on-primary py-3 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Staged Bag</span>
            </button>
            <p className="text-center font-spec-code-sm text-[11px] text-on-surface-variant">
              Reserve guarantees 24hr Banani vault hold
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default WishlistDrawer;
