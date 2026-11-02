'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartSubtotal, currency } = useAtelierStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  const subtotal = cartSubtotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsVerifyingCoupon(true);
    setCouponMessage(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponMessage({ text: data.message || 'Invalid privilege code', error: true });
        setCouponDiscount(0);
      } else {
        setCouponDiscount(data.coupon.discountAmount);
        setCouponMessage({
          text: `Privilege code ${data.coupon.code} applied! Saved ${formatPrice(
            data.coupon.discountAmount,
            currency
          )}`,
        });
      }
    } catch {
      setCouponMessage({ text: 'Could not verify voucher.', error: true });
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const shippingFee = subtotal >= 35000 ? 0 : 350;
  const taxable = Math.max(0, subtotal - couponDiscount);
  const vat = Math.round(taxable * 0.075);
  const total = taxable + vat + shippingFee;

  return (
    <div className="w-full bg-surface py-space-xl min-h-[80vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        <div className="border-b border-outline-variant/60 pb-space-sm flex items-end justify-between">
          <div>
            <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
              Commercial Review
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
              Your Atelier Bag ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h1>
          </div>
          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center gap-1 font-label-caps text-label-caps uppercase text-secondary hover:underline"
          >
            <span>Continue Curating</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-surface-container-low border border-outline-variant/40 p-12">
            <ShoppingBag className="w-16 h-16 text-outline-variant mx-auto stroke-1" />
            <h2 className="font-headline-lg text-on-surface">Your Bag is Empty</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              You haven&apos;t staged any heirloom garments yet. Explore our latest Rajshahi Silk and Ceremonial collections.
            </p>
            <Link
              href="/collections"
              className="inline-block mt-4 bg-primary text-on-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold shadow-md"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* Left Items Table (8 Cols) */}
            <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 shadow-sm divide-y divide-outline-variant/30">
              {/* Desktop Table Header */}
              <div className="hidden sm:grid p-space-md bg-surface-container-low font-spec-code-sm text-spec-code-sm uppercase tracking-wider text-on-surface-variant grid-cols-12 gap-2">
                <span className="col-span-6">Garment Details</span>
                <span className="col-span-2 text-center">Size</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              {cart.map((item) => (
                <div
                  key={item.sku}
                  className="p-4 sm:p-space-md flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-2 sm:items-center"
                >
                  <div className="sm:col-span-6 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover bg-surface-container shrink-0 border border-outline-variant/40"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-caps text-label-caps uppercase font-bold text-on-surface truncate">
                        {item.title}
                      </h4>
                      <p className="font-spec-code-sm text-spec-code-sm text-on-surface-variant truncate">
                        {item.textileSpec || 'Bespoke Atelier Finish'}
                      </p>
                      <div className="sm:hidden flex items-center gap-2 mt-1">
                        <span className="font-spec-code-sm text-xs bg-surface-container px-2 py-0.5 border">
                          Size {item.size}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.sku)}
                        className="text-error font-spec-code-sm text-[11px] hover:underline mt-1.5 flex items-center gap-1 min-h-[32px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Piece</span>
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:block sm:col-span-2 text-center font-spec-code font-bold">
                    {item.size}
                  </div>

                  <div className="flex items-center justify-between sm:justify-center sm:col-span-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="sm:hidden font-spec-code-sm text-xs text-on-surface-variant uppercase">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-outline-variant/60 bg-surface">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high transition-colors text-sm font-bold min-h-[36px] min-w-[36px]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-spec-code font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high transition-colors text-sm font-bold min-h-[36px] min-w-[36px]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:col-span-2 font-spec-code font-bold text-on-surface border-t sm:border-t-0 pt-1 sm:pt-0">
                    <span className="sm:hidden text-xs text-on-surface-variant uppercase">Subtotal:</span>
                    <span>{formatPrice(item.price * item.quantity, currency)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Financial Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant/60 shadow-lg p-space-lg space-y-space-md h-fit">
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase border-b border-outline-variant/40 pb-space-xs">
                Financial Settlement
              </h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="font-spec-code-sm text-[11px] text-on-surface-variant uppercase block font-bold">
                  Privilege / Voucher Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NOUVEAU10"
                    className="w-full bg-surface border border-outline-variant px-3 py-2 text-spec-code uppercase focus:outline-none focus:border-secondary"
                  />
                  <button
                    type="submit"
                    disabled={isVerifyingCoupon}
                    className="bg-primary text-on-primary px-4 font-label-caps text-label-caps uppercase tracking-wider hover:bg-secondary transition-colors shrink-0 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`font-spec-code-sm text-[11px] ${
                      couponMessage.error ? 'text-error' : 'text-secondary font-bold'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Ledger Breakdown */}
              <div className="pt-space-sm border-t border-outline-variant/40 space-y-2 font-spec-code text-spec-code">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Gross Garment Subtotal</span>
                  <span className="font-bold text-on-surface">{formatPrice(subtotal, currency)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-secondary font-bold">
                    <span>Privilege Voucher Discount</span>
                    <span>-{formatPrice(couponDiscount, currency)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Luxury Goods VAT (7.5%)</span>
                  <span>{formatPrice(vat, currency)}</span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Dhaka Chauffeur Dispatch</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee, currency)}</span>
                </div>

                <div className="pt-space-sm border-t border-outline-variant/60 flex items-center justify-between font-headline-md text-headline-md font-bold text-on-surface">
                  <span>Total Payable:</span>
                  <span className="text-secondary">{formatPrice(total, currency)}</span>
                </div>
              </div>

              <div className="pt-space-sm space-y-2">
                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-secondary hover:bg-primary text-on-secondary py-4 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Proceed To 2-Step Checkout</span>
                </button>

                <p className="text-center font-spec-code-sm text-[10px] text-on-surface-variant">
                  Bank-Grade 256-Bit SSL Encrypted • Anti-Tampering Price Validation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
