'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  Scissors,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, cartSubtotal, currency } = useAtelierStore();

  // Form State
  const [patronName, setPatronName] = useState('Asif Mahmud Chowdhury');
  const [patronEmail, setPatronEmail] = useState('asif@patron.oidulavai.com');
  const [patronPhone, setPatronPhone] = useState('+8801711409822');
  const [shippingAddress, setShippingAddress] = useState(
    'Penthouse B, Imperial Manor, Road 59, Gulshan 2'
  );
  const [shippingCity, setShippingCity] = useState('Dhaka');
  const [shippingZone, setShippingZone] = useState('Banani / Gulshan / Uttara Metro Express');
  const [dispatchMethod, setDispatchMethod] = useState<'EXPRESS_CHAUFFEUR' | 'STANDARD_NEXT_DAY' | 'ATELIER_PICKUP'>('EXPRESS_CHAUFFEUR');
  const [doorstepTailorTrial, setDoorstepTailorTrial] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD' | 'CARD' | 'COD'>('BKASH');
  const [notes, setNotes] = useState('');

  // Privilege Voucher State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch session data if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setPatronName(data.user.name || patronName);
          setPatronEmail(data.user.email || patronEmail);
          setPatronPhone(data.user.phone || patronPhone);
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cartSubtotal();

  const handleApplyVoucher = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.message || 'Invalid privilege code');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError(null);
      }
    } catch {
      setCouponError('Error verifying voucher code');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const shippingFee =
    dispatchMethod === 'EXPRESS_CHAUFFEUR'
      ? subtotal >= 35000
        ? 0
        : 350
      : dispatchMethod === 'STANDARD_NEXT_DAY'
      ? 150
      : 0;

  const taxable = Math.max(0, subtotal - discountAmount);
  const vatAmount = Math.round(taxable * 0.075);
  const totalAmount = taxable + vatAmount + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setOrderError('Your cart is empty. Please select garments before checkout.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const payload = {
        patronName,
        patronEmail,
        patronPhone,
        shippingAddress,
        shippingCity,
        shippingZone,
        dispatchMethod,
        doorstepTailorTrial,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        notes,
        items: cart.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          sku: i.sku,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          monogramText: i.monogramText,
          monogramThread: i.monogramThread,
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Checkout failed. Please retry.');
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err: any) {
      setOrderError(err.message || 'Checkout failed. Please review your parameters.');
      setIsSubmitting(false);
    }
  };

  const quickAddresses = [
    {
      label: 'Gulshan 2 Haven',
      address: 'Penthouse B, Imperial Manor, Road 59, Gulshan 2',
      zone: 'Banani / Gulshan / Uttara Metro Express',
    },
    {
      label: 'Banani 11 Office',
      address: 'Level 8, Tower 42, Road 11, Banani',
      zone: 'Banani / Gulshan / Uttara Metro Express',
    },
    {
      label: 'Sylhet Retreat',
      address: 'Surma River House, Kumarpara Heritage Road, Sylhet',
      zone: 'Nationwide Priority Express',
    },
  ];

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="py-24 text-center space-y-4 max-w-lg mx-auto px-4">
        <h2 className="font-headline-lg text-on-surface">No Garments Staged For Checkout</h2>
        <p className="font-body-md text-on-surface-variant">
          Your shopping bag is currently empty. Please select your tailored pieces before continuing to checkout.
        </p>
        <Link
          href="/collections"
          className="inline-block bg-primary text-on-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface py-space-lg min-h-[90vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Minimalist Bespoke Progress Indicator */}
        <div className="border-b border-outline-variant/60 pb-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-2 font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
              <Lock className="w-3.5 h-3.5" />
              <span>Bank-Grade 256-Bit SSL Encrypted Staging</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
              Bespoke Dispatch Console
            </h1>
          </div>

          <div className="flex items-center gap-4 font-spec-code-sm text-spec-code-sm">
            <span className="text-secondary font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 1. Identity
            </span>
            <span className="text-outline-variant">→</span>
            <span className="text-secondary font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 2. Destination
            </span>
            <span className="text-outline-variant">→</span>
            <span className="text-primary font-bold">3. Settlement</span>
          </div>
        </div>

        {orderError && (
          <div className="p-4 bg-error-container text-on-error-container border border-error/30 font-spec-code-sm text-sm">
            {orderError}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* LEFT COLUMN: Checkout Details Engine (7 Cols) */}
          <div className="lg:col-span-7 space-y-space-lg">
            {/* Step 1: Patron Identity */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-sm space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  1. Patron Identification
                </h3>
                <span className="font-spec-code-sm text-secondary text-xs uppercase font-bold">
                  Sovereign Dossier
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md font-body-sm">
                <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Patron Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patronName}
                    onChange={(e) => setPatronName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Telephone (Chauffeur SMS Notifications) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patronPhone}
                    onChange={(e) => setPatronPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary font-spec-code"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Email for VAT Tax Invoice & Milestones *
                  </label>
                  <input
                    type="email"
                    required
                    value={patronEmail}
                    onChange={(e) => setPatronEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery & Chauffeur Destination */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-sm space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  2. Chauffeur Destination
                </h3>
                <span className="font-spec-code-sm text-secondary text-xs uppercase font-bold">
                  Dhaka Metropolitan
                </span>
              </div>

              {/* Quick Saved Address Pills */}
              <div className="space-y-1">
                <span className="font-spec-code-sm text-on-surface-variant uppercase text-[10px] block">
                  Quick Select Saved Haven:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickAddresses.map((addr) => (
                    <button
                      key={addr.label}
                      type="button"
                      onClick={() => {
                        setShippingAddress(addr.address);
                        setShippingZone(addr.zone);
                      }}
                      className={`px-3 py-1 font-spec-code-sm text-xs border transition-colors ${
                        shippingAddress === addr.address
                          ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                          : 'border-outline-variant/60 hover:border-secondary text-on-surface'
                      }`}
                    >
                      {addr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-space-md font-body-sm">
                <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Street Address / Residence Name / Floor *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Delivery Zone
                    </label>
                    <select
                      value={shippingZone}
                      onChange={(e) => setShippingZone(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface text-xs font-spec-code"
                    >
                      <option>Banani / Gulshan / Uttara Metro Express</option>
                      <option>Dhanmondi / Lalmatia / Mirpur</option>
                      <option>Greater Dhaka Metropolitan</option>
                      <option>Nationwide Priority Express (Chittagong, Sylhet)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Dispatch & Fitting Protocols */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-sm space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs">
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  3. Dispatch & Doorstep Fitting
                </h3>
              </div>

              {/* Dispatch Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div
                  onClick={() => setDispatchMethod('EXPRESS_CHAUFFEUR')}
                  className={`p-space-md border cursor-pointer transition-all ${
                    dispatchMethod === 'EXPRESS_CHAUFFEUR'
                      ? 'border-secondary bg-secondary/10 shadow-md'
                      : 'border-outline-variant/60 hover:border-outline'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-label-caps uppercase font-bold text-on-surface">
                      Express Chauffeur Van
                    </span>
                    <span className="font-spec-code font-bold text-secondary text-xs">
                      {subtotal >= 35000 ? 'Complimentary' : '৳ 350'}
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                    Same-day evening delivery across Banani, Gulshan & Uttara in climate-controlled Mercedes Sprinter.
                  </p>
                </div>

                <div
                  onClick={() => setDispatchMethod('STANDARD_NEXT_DAY')}
                  className={`p-space-md border cursor-pointer transition-all ${
                    dispatchMethod === 'STANDARD_NEXT_DAY'
                      ? 'border-secondary bg-secondary/10 shadow-md'
                      : 'border-outline-variant/60 hover:border-outline'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-label-caps uppercase font-bold text-on-surface">
                      Priority Next-Day
                    </span>
                    <span className="font-spec-code font-bold text-on-surface text-xs">৳ 150</span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                    Delivered within 24 hours in sealed mulmul dust bag packaging.
                  </p>
                </div>
              </div>

              {/* Master Tailor Doorstep Trial Addon Toggle */}
              <div className="p-3 bg-secondary-fixed/30 border border-secondary/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Scissors className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase font-bold text-on-surface">
                      Complimentary Two-Size Doorstep Trial
                    </h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Chauffeur will carry adjacent fitting sizes for you to try at your doorstep.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={doorstepTailorTrial}
                  onChange={(e) => setDoorstepTailorTrial(e.target.checked)}
                  className="w-5 h-5 accent-secondary cursor-pointer"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                  Atelier Notes / Chauffeur Security Gate Access
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring apartment inter-com, security code 4920..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 p-2 font-body-sm text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            {/* Step 4: Payment Gateway & Settlement */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-sm space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs">
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                  4. Certified Payment Gateway
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-spec-code-sm text-spec-code-sm">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-3 border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'BKASH'
                      ? 'border-pink-600 bg-pink-50 text-pink-900 font-bold shadow-sm'
                      : 'border-outline-variant/60 hover:border-pink-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pink-600" />
                  <span>bKash Merchant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`p-3 border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'NAGAD'
                      ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold shadow-sm'
                      : 'border-outline-variant/60 hover:border-orange-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <span>Nagad Direct</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                      : 'border-outline-variant/60 hover:border-blue-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>AMEX / Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'COD'
                      ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-sm'
                      : 'border-outline-variant/60 hover:border-secondary'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-secondary" />
                  <span>Doorstep COD</span>
                </button>
              </div>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 font-body-sm text-[11px] text-on-surface-variant flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>
                  Payments are processed through 256-bit encrypted merchant APIs with instantaneous HMAC callback verification.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Bespoke Order Summary & Vault Ledger (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            <div className="bg-surface-container-low border border-outline-variant/60 shadow-xl p-space-lg space-y-space-md sticky top-28">
              <div className="border-b border-outline-variant/40 pb-space-xs">
                <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                  Order Dossier Summary
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase mt-1">
                  Staged Garments ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>

              {/* Itemized Garments */}
              <div className="space-y-space-sm divide-y divide-outline-variant/30 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.sku} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-14 object-cover border border-outline-variant/40 bg-surface-container"
                      />
                      <div>
                        <h4 className="font-label-caps text-label-caps uppercase font-bold text-on-surface line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="font-spec-code-sm text-[10px] text-on-surface-variant">
                          Size {item.size} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-spec-code font-bold text-xs text-on-surface shrink-0">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Privilege Code Input */}
              <div className="pt-space-xs border-t border-outline-variant/40 space-y-1">
                <label className="font-spec-code-sm text-[10px] uppercase text-on-surface-variant block font-bold">
                  Privilege Voucher Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NOUVEAU10"
                    className="w-full bg-surface border border-outline-variant/60 px-2.5 py-1.5 text-spec-code uppercase text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    disabled={isCheckingCoupon}
                    className="bg-primary text-on-primary px-3 font-label-caps text-[10px] uppercase tracking-wider hover:bg-secondary transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="font-spec-code-sm text-[11px] text-secondary font-bold">
                    Voucher {appliedCoupon.code} applied (-{formatPrice(discountAmount, currency)})
                  </p>
                )}
                {couponError && (
                  <p className="font-spec-code-sm text-[11px] text-error">{couponError}</p>
                )}
              </div>

              {/* Financial Ledger Breakdown */}
              <div className="pt-space-sm border-t border-outline-variant/40 space-y-2 font-spec-code text-spec-code">
                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span>Gross Garment Value</span>
                  <span className="font-bold text-on-surface">{formatPrice(subtotal, currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-secondary font-bold text-xs">
                    <span>Privilege Voucher Discount</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span>Luxury Goods VAT (7.5%)</span>
                  <span>{formatPrice(vatAmount, currency)}</span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant text-xs">
                  <span>Doorstep Fitting Chauffeur</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee, currency)}</span>
                </div>

                <div className="pt-space-sm border-t border-outline-variant/60 flex items-center justify-between font-headline-md text-headline-md font-bold text-on-surface">
                  <span>Net Settlement:</span>
                  <span className="text-secondary">{formatPrice(totalAmount, currency)}</span>
                </div>
              </div>

              {/* Order Placement CTA */}
              <div className="pt-space-sm space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-primary text-on-secondary py-4 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? 'Authenticating Transaction...'
                      : `Authorize & Dispatch (${formatPrice(totalAmount, currency)})`}
                  </span>
                </button>

                <p className="text-center font-spec-code-sm text-[10px] text-on-surface-variant">
                  Prices verified strictly on server database. Anti-tampering check active.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
