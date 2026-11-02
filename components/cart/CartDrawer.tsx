'use client';

import React from 'react';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartSubtotal, currency } =
    useAtelierStore();

  if (!isCartOpen) return null;

  const subtotal = cartSubtotal();
  const complimentaryThreshold = 35000;
  const difference = Math.max(0, complimentaryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / complimentaryThreshold) * 100));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-primary/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-300"
      />

      {/* Slideout Panel */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col justify-between transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-space-md border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-secondary" />
            <h3 className="font-headline-md text-headline-md tracking-tight uppercase font-bold text-on-surface">
              Atelier Bag
            </h3>
            <span className="font-spec-code-sm text-spec-code-sm bg-primary text-on-primary px-2 py-0.5 font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 text-on-surface hover:text-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chauffeur Perk Progress Bar */}
        <div className="px-space-md py-2.5 bg-secondary-fixed/40 border-b border-secondary/20 flex flex-col gap-1">
          <div className="flex items-center justify-between font-label-caps text-[10px] text-on-secondary-fixed">
            <span className="font-bold">Dhaka Metro Sovereign Perk</span>
            <span>
              {difference === 0 ? 'Unlocked!' : `${formatPrice(difference, currency)} to Unlock`}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="font-spec-code-sm text-[10px] text-on-secondary-fixed-variant">
            Complimentary Kalgi Box & White-Glove Chauffeur Delivery
          </p>
        </div>

        {/* Items List */}
        <div className="p-space-md flex-1 overflow-y-auto space-y-space-md divide-y divide-outline-variant/30">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-outline-variant mx-auto stroke-1" />
              <p className="font-headline-md text-on-surface">Your Atelier Bag is Empty</p>
              <p className="font-body-sm text-on-surface-variant max-w-xs mx-auto">
                Explore our curated trunk shows and reserve bespoke hand-loomed garments.
              </p>
              <Link
                href="/collections"
                onClick={closeCart}
                className="inline-block mt-2 bg-primary text-on-primary px-6 py-2.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="pt-space-sm first:pt-0 flex gap-space-sm items-start justify-between">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-20 object-cover bg-surface-container shrink-0 border border-outline-variant/40"
                />
                <div className="flex-1 pl-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-label-caps text-label-caps uppercase font-bold text-on-surface leading-tight">
                        {item.title}
                      </h4>
                      <p className="font-spec-code-sm text-spec-code-sm text-on-surface-variant mt-0.5">
                        Size: {item.size} {item.color ? `• ${item.color}` : ''}
                      </p>
                      {item.monogramText && (
                        <p className="font-spec-code-sm text-[9px] text-secondary font-bold">
                          Monogram: [{item.monogramText}]
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-outline-variant/60 bg-surface-container-low">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="px-2 py-0.5 text-on-surface hover:bg-surface-container-high transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-spec-code text-spec-code font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="px-2 py-0.5 text-on-surface hover:bg-surface-container-high transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-spec-code text-spec-code font-bold text-on-surface">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-space-md border-t border-outline-variant/60 bg-surface-container-low space-y-space-md">
            <div className="space-y-1.5 font-spec-code text-spec-code">
              <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
                <span>Estimated Subtotal</span>
                <span className="font-bold text-on-surface">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">2-Size Doorstep Trial</span>
                <span className="text-secondary font-semibold">Complimentary</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-secondary hover:bg-primary text-on-secondary py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors shadow-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={closeCart}
                className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary py-2.5 font-label-caps text-label-caps uppercase tracking-wider transition-colors"
              >
                Continue Browsing Atelier
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
