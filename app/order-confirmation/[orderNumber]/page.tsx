import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate, getOrderStatusBadge } from '@/lib/utils';
import OrderConfirmationClient from './OrderConfirmationClient';
import {
  ShieldCheck,
  Package,
  Truck,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await orderService.getByOrderNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  const badge = getOrderStatusBadge(order.status);

  return (
    <div className="w-full bg-surface py-space-xl min-h-[90vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Client Print & Notification Interactivity */}
        <OrderConfirmationClient orderNumber={order.orderNumber} />

        {/* Hero Confirmation Banner: Asymmetric Architectural Crest */}
        <section className="bg-surface-container-low border border-outline-variant/60 shadow-lg p-space-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-xs">
                  Commission Authenticated • Dhaka Metropolitan Staging
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight leading-tight">
                Consignment Confirmed #{order.orderNumber}
              </h1>
              <p className="font-body-md text-on-surface-variant max-w-xl">
                Honored Patron <strong className="text-on-surface">{order.patronName}</strong>, your sartorial commission is now registered with our Banani Flagship master drapers.
              </p>
            </div>

            {/* Symbolic Royal Seal & Quick Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href={`/tracking/${order.orderNumber}`}
                className="w-full sm:w-auto bg-secondary text-on-secondary hover:bg-primary px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Truck className="w-4 h-4" />
                <span>Live Route Telemetry</span>
              </Link>
            </div>
          </div>

          {/* Key Metric Chips */}
          <div className="mt-space-md pt-space-sm border-t border-outline-variant/40 grid grid-cols-2 sm:grid-cols-4 gap-2 font-spec-code-sm text-spec-code-sm">
            <div className="flex flex-col">
              <span className="text-on-surface-variant uppercase text-[10px]">Staging Time</span>
              <span className="font-bold text-on-surface">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant uppercase text-[10px]">Dispatch Protocol</span>
              <span className="font-bold text-on-surface">
                {order.dispatchMethod === 'EXPRESS_CHAUFFEUR' ? 'Express Chauffeur' : 'Standard Next-Day'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant uppercase text-[10px]">Two-Size Trial</span>
              <span className="font-bold text-secondary">
                {order.doorstepTailorTrial ? 'Complimentary Active' : 'Standard Delivery'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant uppercase text-[10px]">Current Milestone</span>
              <span className="font-bold text-on-surface">{badge.label}</span>
            </div>
          </div>
        </section>

        {/* Main Split: Dossier & Interactive Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Column: Garments & Financials (7 Cols) */}
          <div className="lg:col-span-7 space-y-space-md">
            <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                Itemized Sartorial Ledger
              </h2>
              <span className="font-spec-code-sm text-on-surface-variant text-xs">
                {order.items.length} Garments Staged
              </span>
            </div>

            {/* Garments List */}
            <div className="space-y-space-sm">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-sm flex gap-space-md items-start"
                >
                  <img
                    src={
                      item.product.images[0]?.url ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc'
                    }
                    alt={item.title}
                    className="w-20 h-24 object-cover bg-surface-container shrink-0 border border-outline-variant/40"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-spec-code-sm text-[10px] text-secondary uppercase font-bold">
                          {item.textileSpec || 'Bespoke Finished'}
                        </span>
                        <h3 className="font-label-caps text-label-caps uppercase font-bold text-on-surface text-base">
                          {item.title}
                        </h3>
                        <p className="font-spec-code-sm text-spec-code-sm text-on-surface-variant">
                          Size {item.size} • SKU {item.sku}
                        </p>
                      </div>
                      <span className="font-spec-code font-bold text-on-surface text-base">
                        {formatPrice(item.subtotal, order.currency)}
                      </span>
                    </div>

                    {item.monogramText && (
                      <p className="font-spec-code-sm text-[11px] text-secondary font-bold pt-1">
                        Monogram: [{item.monogramText}] • {item.monogramThread || 'Antique Gold Thread'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Settlement Card */}
            <div className="bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-sm space-y-2 font-spec-code text-spec-code">
              <h3 className="font-label-caps text-label-caps uppercase font-bold text-on-surface border-b border-outline-variant/40 pb-1 text-xs">
                Financial Breakdown & Tax Settlement
              </h3>

              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Gross Garments Subtotal</span>
                <span className="font-bold text-on-surface">{formatPrice(order.subtotal, order.currency)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-secondary font-bold text-xs">
                  <span>Privilege Voucher Discount</span>
                  <span>-{formatPrice(order.discountAmount, order.currency)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Luxury Goods VAT (7.5%)</span>
                <span>{formatPrice(order.vatAmount, order.currency)}</span>
              </div>

              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Dhaka Chauffeur Dispatch</span>
                <span>
                  {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee, order.currency)}
                </span>
              </div>

              <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between font-headline-md text-headline-md font-bold text-on-surface">
                <span>Total Settled:</span>
                <span className="text-secondary">{formatPrice(order.totalAmount, order.currency)}</span>
              </div>
            </div>

            {/* Logistics & Delivery Address */}
            <div className="bg-surface-container-low p-space-md border border-outline-variant/60 space-y-1 font-body-sm text-body-sm">
              <span className="font-spec-code-sm text-[10px] text-secondary uppercase font-bold tracking-wider block">
                Destination Address
              </span>
              <p className="font-bold text-on-surface">{order.patronName}</p>
              <p className="text-on-surface-variant">{order.shippingAddress}, {order.shippingCity}</p>
              <p className="font-spec-code-sm text-[11px] text-on-surface-variant">
                Chauffeur Contact: {order.patronPhone}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Timeline & Utilities (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            {/* Action Utilities Deck */}
            <div className="bg-surface-container-lowest p-space-md border border-outline-variant/60 shadow-sm space-y-2">
              <button
                type="button"
                id="btn-print-tax-invoice"
                className="w-full border border-primary text-primary hover:bg-primary hover:text-on-primary py-2.5 font-label-caps text-label-caps uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Download VAT-Compliant Tax Invoice</span>
              </button>

              <Link
                href={`/tracking/${order.orderNumber}`}
                className="w-full bg-primary hover:bg-secondary text-on-primary py-3 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Chauffeur on Dhaka Map</span>
              </Link>
            </div>

            {/* Live Atelier Fulfillment Timeline */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-md space-y-space-md">
              <div className="border-b border-outline-variant/40 pb-space-xs">
                <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
                  Live Dispatch Chronology
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface uppercase mt-0.5">
                  Fulfillment Status
                </h3>
              </div>

              <div className="space-y-space-md font-body-sm relative pl-6 border-l-2 border-secondary/40">
                {order.statusHistory.map((sh, idx) => (
                  <div key={sh.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm" />
                    <h4 className="font-bold text-on-surface text-sm uppercase">{sh.title}</h4>
                    {sh.note && (
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                        {sh.note}
                      </p>
                    )}
                    <span className="font-spec-code-sm text-[10px] text-on-surface-variant block mt-1">
                      {formatDate(sh.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chauffeur Profile Card */}
            <div className="bg-surface-container-low p-space-md border border-outline-variant/60 space-y-2">
              <div className="flex items-center gap-2 font-spec-code-sm text-secondary uppercase font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Assigned Atelier Chauffeur</span>
              </div>
              <h4 className="font-bold text-on-surface text-sm">{order.chauffeurName || 'Kabir Hossain'}</h4>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Vehicle: {order.chauffeurVehicle || 'Mercedes-Benz Sprinter Atelier Van • Chha 11-4920'}
              </p>
              <div className="pt-2 flex items-center justify-between font-spec-code-sm text-[11px]">
                <span className="text-secondary font-bold">Direct Mobile: {order.chauffeurPhone}</span>
                <span className="text-on-surface-variant">ETA: {order.etaText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
