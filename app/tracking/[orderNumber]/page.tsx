import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate } from '@/lib/utils';
import TrackingInteractiveMap from './TrackingInteractiveMap';
import {
  Truck,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Scissors,
  ArrowRight,
  Package,
  MapPin,
} from 'lucide-react';

interface OrderTrackingPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const order = await orderService.getByOrderNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="w-full bg-surface py-space-xl min-h-[90vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Top Editorial Tracking Header */}
        <div className="border-b border-outline-variant/60 pb-space-md flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span>Dhaka Metropolitan Telemetry Stream</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
              Live Consignment Tracking
            </h1>
            <p className="font-body-md text-on-surface-variant max-w-lg mt-0.5">
              Consignment dossier #{order.orderNumber} • Staged for {order.patronName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-spec-code text-spec-code bg-surface-container-low px-4 py-2 border border-outline-variant/60 text-on-surface">
              Status: <strong className="text-secondary">{order.status}</strong>
            </span>
          </div>
        </div>

        {/* Live Status Hero Banner */}
        <div className="bg-primary text-on-primary p-space-md flex flex-wrap items-center justify-between gap-space-sm border border-secondary/40 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-on-secondary" />
            </div>
            <div>
              <p className="font-label-caps text-label-caps uppercase text-secondary-fixed-dim font-bold">
                Active Transit Telemetry
              </p>
              <h3 className="font-headline-md text-headline-md text-white uppercase">
                {order.status === 'DELIVERED'
                  ? 'Consignment Delivered & Fitted at Patron Haven'
                  : 'Chauffeur En Route Across Dhaka Metro'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-space-lg font-spec-code text-spec-code text-xs text-surface-variant">
            <div>
              <span className="block text-[10px] uppercase">Destination</span>
              <span className="font-bold text-white">{order.shippingCity} ({order.shippingZone.split(' ')[0]})</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase">Guaranteed ETA</span>
              <span className="font-bold text-secondary-fixed-dim">{order.etaText || 'Tonight 7:30 PM'}</span>
            </div>
          </div>
        </div>

        {/* Central Dispatch Arena: Live Route Visualizer & Chauffeur Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left: Dhaka Simulated Vector Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-space-md">
            <div className="border border-outline-variant/60 shadow-xl overflow-hidden bg-surface-container-lowest">
              <div className="p-3 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between font-spec-code-sm text-xs">
                <span className="uppercase font-bold text-on-surface flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Tejgaon Central Atelier → Banani Road 11 Route Vector
                </span>
                <span className="text-secondary font-bold animate-pulse">● Live GPS Ping</span>
              </div>

              {/* Vector Map Component */}
              <TrackingInteractiveMap
                chauffeurName={order.chauffeurName || 'Kabir Hossain'}
                vehicle={order.chauffeurVehicle || 'Mercedes-Benz Sprinter Atelier Van • Chha 11-4920'}
                eta={order.etaText || 'Tonight, 7:30 PM'}
                status={order.status}
              />
            </div>

            {/* Stepper Chronology */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-md space-y-space-md">
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase border-b border-outline-variant/40 pb-space-xs">
                Dispatched Commission Milestones
              </h3>

              <div className="space-y-space-md relative pl-6 border-l-2 border-secondary/50">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm" />
                  <h4 className="font-bold text-on-surface text-sm uppercase">1. Order Authenticated & Staged</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Vault inventory verified and reservation locked under Patron Dossier.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm" />
                  <h4 className="font-bold text-on-surface text-sm uppercase">2. Hand-Finishing & Monogramming</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Garments steamed, measured against Banani tailoring spec, and monogrammed.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm" />
                  <h4 className="font-bold text-on-surface text-sm uppercase">3. White-Glove Mulmul Packaging</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Sealed in organic mulmul fabric dust bag with Cedarwood aromatic block.
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm animate-ping" />
                  <h4 className="font-bold text-secondary text-sm uppercase">4. Active En Route (Mohakhali Arterial)</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Chauffeur navigating Tejgaon-Mohakhali corridor towards {order.shippingCity}.
                  </p>
                </div>

                <div className="relative opacity-60">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-outline-variant border-2 border-white" />
                  <h4 className="font-bold text-on-surface text-sm uppercase">5. Upcoming Doorstep Fitting & Acceptance</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    Patron doorstep fitting trial and physical handover.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chauffeur Profile Card & Staged Items (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            {/* Chauffeur Identity Card */}
            <div className="bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-lg space-y-space-md">
              <div className="flex items-center gap-space-sm border-b border-outline-variant/40 pb-space-sm">
                <div className="w-14 h-14 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-headline-md text-xl border-2 border-secondary">
                  KH
                </div>
                <div>
                  <span className="font-spec-code-sm text-secondary uppercase font-bold text-[10px]">
                    Certified Atelier Chauffeur
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    {order.chauffeurName || 'Kabir Hossain'}
                  </h3>
                  <p className="font-spec-code-sm text-xs text-on-surface-variant">
                    ID: CHF-DHAKA-1104 • 6 Yrs Atelier Service
                  </p>
                </div>
              </div>

              <div className="space-y-2 font-spec-code text-spec-code text-xs">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Assigned Vehicle:</span>
                  <span className="font-bold text-on-surface">Mercedes Sprinter Atelier Van</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Registration Plate:</span>
                  <span className="font-bold text-secondary">Dhaka Metro Chha 11-4920</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Direct Mobile:</span>
                  <span className="font-bold text-on-surface">{order.chauffeurPhone || '+880 1711-449200'}</span>
                </div>
              </div>

              <div className="pt-space-xs grid grid-cols-2 gap-2">
                <a
                  href={`tel:${order.chauffeurPhone || '+8801711449200'}`}
                  className="bg-primary text-on-primary py-2.5 font-label-caps text-label-caps uppercase tracking-wider text-center hover:bg-secondary transition-colors font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Chauffeur</span>
                </a>

                <a
                  href={`https://wa.me/8801711449200?text=Hello%20Kabir,%20inquiry%20regarding%20Oi%20Dulavai%20consignment%20${order.orderNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-secondary text-secondary py-2.5 font-label-caps text-label-caps uppercase tracking-wider text-center hover:bg-secondary hover:text-on-secondary transition-colors font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp VIP</span>
                </a>
              </div>
            </div>

            {/* Staged Items In This Dispatch */}
            <div className="bg-surface-container-low p-space-md border border-outline-variant/60 space-y-space-sm">
              <h4 className="font-headline-md text-headline-md text-on-surface uppercase text-sm border-b border-outline-variant/40 pb-1 font-bold">
                Garments Under Dispatch Protection
              </h4>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs font-spec-code">
                    <span className="font-bold text-on-surface truncate max-w-[200px]">
                      {item.title} (Size {item.size})
                    </span>
                    <span className="text-secondary font-bold">
                      {formatPrice(item.subtotal, order.currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between font-spec-code font-bold text-sm">
                <span>Total Value Insured:</span>
                <span className="text-on-surface">{formatPrice(order.totalAmount, order.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
