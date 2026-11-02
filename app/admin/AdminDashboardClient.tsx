'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate, getOrderStatusBadge } from '@/lib/utils';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Truck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Scissors,
  Calendar,
  Layers,
  ArrowRight,
  LogOut,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  initialMetrics: any;
  initialOrders: any[];
  initialLowStock: any[];
}

export default function AdminDashboardClient({
  initialMetrics,
  initialOrders,
  initialLowStock,
}: AdminDashboardProps) {
  const router = useRouter();

  const [metrics, setMetrics] = useState(initialMetrics);
  const [orders, setOrders] = useState(initialOrders);
  const [lowStock, setLowStock] = useState(initialLowStock);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Order State Machine Transition Handler
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          note: `Executive state update to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update order state.');
      }

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setStatusMessage(`Order #${data.order.orderNumber} state transitioned to ${newStatus}`);
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Restock Variant Stock Handler
  const handleRestock = async (variantId: string, currentCount: number) => {
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, count: currentCount + 10 }),
      });

      const data = await res.json();
      if (res.ok) {
        setLowStock(lowStock.filter((v) => v.id !== variantId));
        setStatusMessage(`Restocked SKU ${data.variant.sku} to ${data.variant.inventoryCount} units.`);
      }
    } catch {
      setStatusMessage('Restock action failed.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="w-full bg-[#070C14] text-[#F7F4EE] py-space-xl min-h-screen">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Operational Overview Header & Actions */}
        <div className="border-b border-[#1C2638] pb-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8B467] animate-pulse" />
              <span className="font-spec-code-sm text-[#D8B467] uppercase font-bold tracking-widest text-xs">
                Banani Flagship Executive Desk • Level 4 RBAC
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-white uppercase tracking-tight">
              Atelier Operations Console
            </h1>
            <p className="font-body-sm text-gray-400 text-xs">
              Live Gross Merchandise Value (GMV), loom capacity scheduler, and chauffeur fleet telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.refresh()}
              className="bg-[#0B1320] border border-[#1C2638] hover:border-[#D8B467] text-white px-3 py-2 font-spec-code text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D8B467]" />
              <span>Refresh Metrics</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-950/40 border border-red-900/60 hover:bg-red-900 text-red-200 px-3 py-2 font-spec-code text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-[#133327] text-emerald-200 border border-emerald-800 font-spec-code text-xs animate-in fade-in">
            {statusMessage}
          </div>
        )}

        {/* Section 1: KPI Summary Strip with SVG Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* KPI 1: GMV */}
          <div className="bg-[#0B1320] p-space-md border border-[#1C2638] space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 font-spec-code-sm text-xs">
              <span className="uppercase">Gross Revenue (GMV)</span>
              <TrendingUp className="w-4 h-4 text-[#D8B467]" />
            </div>
            <div className="font-headline-md text-2xl font-bold text-white">
              ৳ {metrics.gmv.toLocaleString('en-US')}
            </div>
            <div className="text-[11px] font-spec-code text-gray-400">
              Net Paid Sales: <strong className="text-[#D8B467]">৳ {metrics.netSales.toLocaleString('en-US')}</strong>
            </div>

            {/* Sparkline SVG */}
            <svg className="w-full h-8 pt-1" viewBox="0 0 100 25" fill="none">
              <path
                d="M 0 20 L 15 15 L 30 18 L 45 8 L 60 5 L 75 10 L 100 2"
                stroke="#D8B467"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* KPI 2: Active Dispatches */}
          <div className="bg-[#0B1320] p-space-md border border-[#1C2638] space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 font-spec-code-sm text-xs">
              <span className="uppercase">Dhaka Chauffeur Fleet</span>
              <Truck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-headline-md text-2xl font-bold text-white">
              {metrics.activeDispatches} Active En Route
            </div>
            <div className="text-[11px] font-spec-code text-gray-400">
              Sprinter Atelier Van Chha 11-4920
            </div>
            <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full" style={{ width: '75%' }} />
            </div>
          </div>

          {/* KPI 3: Looms Active */}
          <div className="bg-[#0B1320] p-space-md border border-[#1C2638] space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 font-spec-code-sm text-xs">
              <span className="uppercase">Loom Capacity Allocation</span>
              <Scissors className="w-4 h-4 text-[#D8B467]" />
            </div>
            <div className="font-headline-md text-2xl font-bold text-white">
              {metrics.loomsActive} of {metrics.totalLooms} Looms
            </div>
            <div className="text-[11px] font-spec-code text-gray-400">
              Rajshahi & Tangail Sericulture Basin
            </div>
            <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#D8B467] h-full" style={{ width: '66%' }} />
            </div>
          </div>

          {/* KPI 4: VIP Lounge Appointments */}
          <div className="bg-[#0B1320] p-space-md border border-[#1C2638] space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-gray-400 font-spec-code-sm text-xs">
              <span className="uppercase">Banani VIP Salon</span>
              <Calendar className="w-4 h-4 text-[#D8B467]" />
            </div>
            <div className="font-headline-md text-2xl font-bold text-white">
              {metrics.pendingAppointmentsCount} Fitting Slots
            </div>
            <div className="text-[11px] font-spec-code text-gray-400">
              Conversion Rate: <strong className="text-white">{metrics.conversionRate}</strong>
            </div>
            <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-purple-500 h-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Section 2: Low Inventory Warning Ticker */}
        {lowStock.length > 0 && (
          <div className="bg-[#1C150A] border border-[#B8893A]/50 p-space-md space-y-2 shadow-xl">
            <div className="flex items-center gap-2 font-spec-code-sm text-[#D8B467] uppercase font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Inventory Alert: {lowStock.length} Garment Variants Below Buffer Threshold</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {lowStock.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#0B1320] p-2 border border-[#1C2638] flex items-center justify-between font-spec-code text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{v.product.name}</span>
                    <span className="text-gray-400 text-[10px]">
                      Size {v.size} • Remaining: <strong className="text-red-400">{v.inventoryCount} units</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => handleRestock(v.id, v.inventoryCount)}
                    className="bg-[#D8B467] text-[#070C14] hover:bg-white px-3 py-2 font-label-caps text-[10px] uppercase font-bold tracking-wider transition-colors min-h-[44px] min-w-[88px] flex items-center justify-center shrink-0"
                  >
                    +10 Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Live Operations Matrix (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Urgent Dispatch & Orders (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0B1320] border border-[#1C2638] shadow-2xl p-space-lg space-y-space-md">
            <div className="border-b border-[#1C2638] pb-space-xs flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md text-white uppercase font-bold">
                  Active Consignment Processing Hub
                </h3>
                <p className="font-body-sm text-gray-400 text-xs">
                  State-machine driven fulfillment (`Pending` → `Confirmed` → `Packaging` → `Shipped` → `Delivered`)
                </p>
              </div>
            </div>

            <div className="space-y-space-md divide-y divide-[#1C2638]">
              {orders.map((o) => {
                const badge = getOrderStatusBadge(o.status);
                return (
                  <div key={o.id} className="pt-space-md first:pt-0 space-y-2 font-spec-code text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#D8B467] text-sm">{o.orderNumber}</span>
                          <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] uppercase font-bold">
                            {o.status}
                          </span>
                        </div>
                        <p className="text-gray-300 font-sans mt-0.5">
                          Patron: <strong>{o.patronName}</strong> •{' '}
                          <a
                            href={`tel:${o.patronPhone}`}
                            className="text-[#D8B467] underline hover:text-white"
                          >
                            {o.patronPhone}
                          </a>
                        </p>
                        <p className="text-gray-400 text-[11px] truncate max-w-md">
                          Destination: {o.shippingAddress}, {o.shippingCity}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-white text-sm block">
                          ৳ {o.totalAmount.toLocaleString('en-US')}
                        </span>
                        <span className="text-gray-400 text-[10px]">{o.paymentMethod}</span>
                      </div>
                    </div>

                    {/* State Machine Action Transitions with Touch-Friendly Targets */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {o.status !== 'CONFIRMED' && o.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')}
                          disabled={isUpdating}
                          className="px-3 py-2 bg-blue-900/40 border border-blue-700 text-blue-300 hover:bg-blue-800 text-[11px] uppercase font-bold transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          → Confirm
                        </button>
                      )}

                      {o.status !== 'PACKAGING' && o.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'PACKAGING')}
                          disabled={isUpdating}
                          className="px-3 py-2 bg-yellow-900/40 border border-yellow-700 text-yellow-300 hover:bg-yellow-800 text-[11px] uppercase font-bold transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          → Package
                        </button>
                      )}

                      {o.status !== 'SHIPPED' && o.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'SHIPPED')}
                          disabled={isUpdating}
                          className="px-3 py-2 bg-purple-900/40 border border-purple-700 text-purple-300 hover:bg-purple-800 text-[11px] uppercase font-bold transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          → Dispatch Van
                        </button>
                      )}

                      {o.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'DELIVERED')}
                          disabled={isUpdating}
                          className="px-2.5 py-2 bg-emerald-900/40 border border-emerald-700 text-emerald-300 hover:bg-emerald-800 text-[11px] uppercase font-bold transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          ✓ Mark Delivered
                        </button>
                      )}

                      <Link
                        href={`/order-confirmation/${o.orderNumber}`}
                        target="_blank"
                        className="px-3 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 text-[11px] uppercase transition-colors min-h-[44px] flex items-center justify-center"
                      >
                        Print VAT Slip
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Loom Allocations & Chauffeur Fleet (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            {/* Loom Capacity Tracker */}
            <div className="bg-[#0B1320] border border-[#1C2638] shadow-2xl p-space-lg space-y-space-md font-spec-code text-xs">
              <h3 className="font-headline-md text-headline-md text-white uppercase border-b border-[#1C2638] pb-space-xs font-bold">
                Loom Sericulture Pipeline
              </h3>

              <div className="space-y-3">
                <div className="bg-[#070C14] p-3 border border-[#1C2638] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#D8B467]">Loom R-01 (Rajshahi Basin)</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">Weaving Nawab Tussar Silk (220 GSM)</p>
                  <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#D8B467] h-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="bg-[#070C14] p-3 border border-[#1C2638] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#D8B467]">Loom T-04 (Tangail Heritage)</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">Discontinuous Jamdani Pashmina Weaving</p>
                  <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '64%' }} />
                  </div>
                </div>

                <div className="bg-[#070C14] p-3 border border-[#1C2638] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#D8B467]">Loom B-02 (Banani Studio)</span>
                    <span className="text-purple-400">Zardozi Bullion Couching</span>
                  </div>
                  <p className="text-gray-400 text-[11px]">Bespoke Imperial Velvet Sherwani</p>
                  <div className="w-full bg-[#1C2638] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#0B1320] border border-[#1C2638] p-space-md space-y-2">
              <span className="font-spec-code-sm text-[#D8B467] uppercase font-bold text-[10px]">
                Administrative Shortcuts
              </span>
              <div className="flex flex-col gap-1.5 font-label-caps text-label-caps uppercase text-xs">
                <Link
                  href="/collections"
                  className="p-2 border border-[#1C2638] bg-[#070C14] hover:border-[#D8B467] text-white flex items-center justify-between"
                >
                  <span>Open Public Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tracking/OD-DHAKA-8492"
                  className="p-2 border border-[#1C2638] bg-[#070C14] hover:border-[#D8B467] text-white flex items-center justify-between"
                >
                  <span>Simulate Chauffeur GPS Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
