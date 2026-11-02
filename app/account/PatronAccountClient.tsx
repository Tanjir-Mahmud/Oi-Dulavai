'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAtelierStore } from '@/lib/store';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  User,
  Package,
  Calendar,
  Ruler,
  MapPin,
  Award,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  Scissors,
  Truck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PatronProps {
  initialPatron: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    vaultId?: string | null;
    tier: string;
    loyaltyPoints: number;
    currency: string;
    language: string;
    addresses: Array<any>;
    measurements?: any;
    orders: Array<any>;
    appointments: Array<any>;
  };
}

export default function PatronAccountClient({ initialPatron }: PatronProps) {
  const { currency, setCurrency, showToast } = useAtelierStore();
  const [activeTab, setActiveTab] = useState<'regional' | 'orders' | 'lounge' | 'measurements' | 'addresses' | 'loyalty'>('orders');

  // Patron State
  const [patron] = useState(initialPatron);
  const [addresses, setAddresses] = useState(initialPatron.addresses);
  const [measurements, setMeasurements] = useState(
    initialPatron.measurements || {
      collar: 15.5,
      chest: 40.0,
      waist: 34.0,
      shoulder: 18.0,
      sleeve: 25.5,
      kurtaLength: 42.0,
      monogramInitials: 'AMC',
      monogramThread: 'ANTIQUE_GOLD',
    }
  );

  // Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('Gulshan 2');
  const [newCity, setNewCity] = useState('Dhaka');

  // Appointment Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [appLocation, setAppLocation] = useState<'BANANI_11_FLAGSHIP' | 'SYLHET_ARTISANAL_SUITE' | 'PRIVATE_RESIDENCE'>('BANANI_11_FLAGSHIP');
  const [appOccasion, setAppOccasion] = useState<'ROYAL_WEDDING' | 'CEREMONIAL_EID' | 'WARDROBE_COMMISSION' | 'OTHER'>('ROYAL_WEDDING');
  const [appDate, setAppDate] = useState('2025-11-20');
  const [appTime, setAppTime] = useState('04:00 PM – 05:30 PM');
  const [appointmentsList, setAppointmentsList] = useState(initialPatron.appointments);

  // Handle Save Measurements
  const handleSaveMeasurements = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/measurements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurements),
      });
      if (res.ok) {
        showToast('Vault Measurements Saved', 'Tailoring metrics synced with Banani master cutting ledger.');
      }
    } catch {
      showToast('Error', 'Could not save measurement specs.');
    }
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newLabel || 'Haven',
          recipientName: patron.name,
          phone: patron.phone || '+8801711409822',
          street: newStreet,
          area: newArea,
          city: newCity,
          division: 'Dhaka',
          postalCode: '1213',
          country: 'Bangladesh',
          isDefault: addresses.length === 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.address) {
        setAddresses([...addresses, data.address]);
        setIsAddAddressOpen(false);
        setNewLabel('');
        setNewStreet('');
        showToast('Delivery Haven Added', 'New destination registered for white-glove chauffeur delivery.');
      }
    } catch {
      showToast('Error', 'Could not register new haven.');
    }
  };

  // Handle Appointment Booking
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patronName: patron.name,
          phone: patron.phone || '+8801711409822',
          email: patron.email,
          salonLocation: appLocation,
          occasion: appOccasion,
          appointmentDate: appDate,
          timeSlot: appTime,
          partySize: 2,
          notes: 'Private salon fitting requested via patron portal.',
        }),
      });
      const data = await res.json();
      if (res.ok && data.appointment) {
        setAppointmentsList([data.appointment, ...appointmentsList]);
        setIsBookingOpen(false);
        showToast('Salon Slot Confirmed', `Appointment reserved for ${appDate} at ${appTime}`);
      }
    } catch {
      showToast('Error', 'Could not book salon appointment.');
    }
  };

  return (
    <div className="w-full bg-surface py-space-xl min-h-[90vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Editorial Patron Header */}
        <section className="bg-surface-container-low border border-outline-variant/60 shadow-lg p-space-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-16 h-16 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-headline-md text-2xl border-2 border-secondary shadow-md shrink-0">
                {patron.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                    {patron.tier}
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-spec-code-sm text-xs text-on-surface-variant font-bold">
                    Vault ID: {patron.vaultId}
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-0.5">
                  {patron.name}
                </h1>
                <p className="font-spec-code-sm text-xs text-on-surface-variant">{patron.email}</p>
              </div>
            </div>

            {/* Quick Metrics Ribbon */}
            <div className="flex items-center gap-space-md font-spec-code text-spec-code text-xs bg-surface p-3 border border-outline-variant/60 shadow-sm">
              <div className="text-center px-2">
                <span className="block text-[10px] text-on-surface-variant uppercase">Sovereign Points</span>
                <span className="font-bold text-secondary text-sm">{patron.loyaltyPoints} PTS</span>
              </div>
              <div className="text-center border-l border-outline-variant/40 px-2">
                <span className="block text-[10px] text-on-surface-variant uppercase">Active Consignments</span>
                <span className="font-bold text-on-surface text-sm">{patron.orders.length} Orders</span>
              </div>
              <div className="text-center border-l border-outline-variant/40 px-2">
                <span className="block text-[10px] text-on-surface-variant uppercase">Saved Havens</span>
                <span className="font-bold text-on-surface text-sm">{addresses.length} Havens</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Working Deck: Sidebar + Dynamic Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Navigation Ledger (Horizontal Swipe on Mobile, Sticky Sidebar on Desktop) */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-2 sm:p-space-md flex overflow-x-auto no-scrollbar lg:flex-col gap-1.5 font-label-caps text-label-caps uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'orders'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-secondary" />
                Track Orders & Dispatches
              </span>
              <span className="font-spec-code text-xs">({patron.orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('measurements')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'measurements'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Ruler className="w-4 h-4 text-secondary" />
                Wardrobe & Measurements
              </span>
              <span className="font-spec-code text-xs">40 Regular</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'addresses'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-secondary" />
                Delivery Havens & Address Book
              </span>
              <span className="font-spec-code text-xs">({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('lounge')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'lounge'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-secondary" />
                Banani Bespoke Lounge
              </span>
              <span className="font-spec-code text-xs">({appointmentsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'loyalty'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-secondary" />
                Loyalty & Sovereign Credits
              </span>
              <span className="font-spec-code text-xs text-secondary font-bold">1,250 PTS</span>
            </button>

            <button
              onClick={() => setActiveTab('regional')}
              className={`text-left p-3 flex items-center justify-between transition-colors min-h-[44px] shrink-0 lg:shrink whitespace-nowrap gap-3 ${
                activeTab === 'regional'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low border border-outline-variant/40 lg:border-none'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-secondary" />
                Currency & Regional Settings
              </span>
              <span className="font-spec-code text-xs">{currency}</span>
            </button>
          </div>

          {/* Dynamic Content Workspace (8 Cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-space-lg">
            {/* TAB B: TRACK ORDERS & DISPATCHES */}
            {activeTab === 'orders' && (
              <div className="space-y-space-md">
                <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Consignment Dossier & Dispatches
                  </h3>
                  <span className="font-spec-code-sm text-xs text-secondary font-bold">
                    Live Metropolitan Staging
                  </span>
                </div>

                <div className="space-y-space-md">
                  {patron.orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-surface-container-low border border-outline-variant/60 p-space-md space-y-space-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/40 pb-2">
                        <div>
                          <span className="font-spec-code-sm text-[10px] text-secondary font-bold uppercase">
                            Consignment #{o.orderNumber}
                          </span>
                          <h4 className="font-bold text-on-surface text-base">
                            {formatPrice(o.totalAmount, o.currency)} • {o.items.length} Pieces
                          </h4>
                          <span className="font-spec-code-sm text-xs text-on-surface-variant">
                            Staged: {formatDate(o.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/tracking/${o.orderNumber}`}
                            className="bg-secondary text-on-secondary px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-wider font-bold hover:bg-primary transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Route</span>
                          </Link>

                          <Link
                            href={`/order-confirmation/${o.orderNumber}`}
                            className="border border-outline-variant bg-surface px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-wider text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            Dossier
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-1 font-spec-code text-xs text-on-surface-variant">
                        {o.items.map((it: any) => (
                          <div key={it.id} className="flex justify-between">
                            <span>
                              {it.title} (Size {it.size}) × {it.quantity}
                            </span>
                            <span className="font-bold text-on-surface">
                              {formatPrice(it.subtotal, o.currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-spec-code-sm text-[11px]">
                        <span className="text-secondary font-bold">Chauffeur: {o.chauffeurName}</span>
                        <span className="text-on-surface font-semibold">ETA: {o.etaText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB D: WARDROBE & MEASUREMENTS */}
            {activeTab === 'measurements' && (
              <form onSubmit={handleSaveMeasurements} className="space-y-space-md">
                <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Bespoke Measurement Vault
                  </h3>
                  <span className="font-spec-code-sm text-xs text-secondary font-bold">
                    Savile Row-Dhaka Standard
                  </span>
                </div>

                <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                  Measurements saved here are stamped on your permanent atelier record and automatically applied to all bespoke orders and custom monogrammed commissions.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md font-spec-code text-spec-code">
                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Collar (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.collar}
                      onChange={(e) => setMeasurements({ ...measurements, collar: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Chest (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Waist (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Shoulder (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.shoulder}
                      onChange={(e) => setMeasurements({ ...measurements, shoulder: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Sleeve (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.sleeve}
                      onChange={(e) => setMeasurements({ ...measurements, sleeve: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Kurta Length (in)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.kurtaLength}
                      onChange={(e) => setMeasurements({ ...measurements, kurtaLength: Number(e.target.value) })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Monogram Initials
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={measurements.monogramInitials || 'AMC'}
                      onChange={(e) => setMeasurements({ ...measurements, monogramInitials: e.target.value.toUpperCase() })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-center uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-on-surface-variant uppercase text-[10px] block mb-1">
                      Thread Color
                    </label>
                    <select
                      value={measurements.monogramThread || 'ANTIQUE_GOLD'}
                      onChange={(e) => setMeasurements({ ...measurements, monogramThread: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-2 text-on-surface font-bold text-xs"
                    >
                      <option value="ANTIQUE_GOLD">Antique Gold</option>
                      <option value="STERLING_SILVER">Silver</option>
                      <option value="TONE_ON_TONE">Tone-on-Tone</option>
                    </select>
                  </div>
                </div>

                <div className="pt-space-sm text-right">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-secondary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors shadow-md"
                  >
                    Sync Measurements To Vault
                  </button>
                </div>
              </form>
            )}

            {/* TAB E: DELIVERY HAVENS / ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-space-md">
                <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Delivery Havens ({addresses.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(true)}
                    className="bg-secondary text-on-secondary px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1 font-bold hover:bg-primary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Haven</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="bg-surface-container-low p-space-md border border-outline-variant/60 relative space-y-1 font-body-sm"
                    >
                      {a.isDefault && (
                        <span className="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-0.5 font-spec-code-sm text-[9px] uppercase font-bold">
                          Primary
                        </span>
                      )}
                      <h4 className="font-bold text-on-surface">{a.label}</h4>
                      <p className="text-on-surface-variant text-xs leading-relaxed">{a.street}</p>
                      <p className="text-on-surface-variant text-xs">
                        {a.area}, {a.city} • {a.country}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal Form */}
                {isAddAddressOpen && (
                  <form onSubmit={handleAddAddress} className="mt-4 p-space-md bg-surface border border-secondary/40 space-y-3 font-body-sm animate-in fade-in">
                    <h4 className="font-label-caps text-label-caps uppercase font-bold text-secondary">
                      Register New Delivery Destination
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Label (e.g. Uttara Residence)"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="p-2 border border-outline-variant/60 bg-surface-container-low"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Area (e.g. Uttara Sector 4)"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        className="p-2 border border-outline-variant/60 bg-surface-container-low"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Street & Apartment Number"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full p-2 border border-outline-variant/60 bg-surface-container-low"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="px-4 py-2 text-xs uppercase font-label-caps"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-on-primary px-6 py-2 text-xs font-label-caps uppercase font-bold hover:bg-secondary transition-colors"
                      >
                        Save Haven
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB C: BANANI BESPOKE LOUNGE */}
            {activeTab === 'lounge' && (
              <div className="space-y-space-md">
                <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Salon Appointments & Fittings
                  </h3>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-secondary text-on-secondary px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1 font-bold hover:bg-primary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Fitting Slot</span>
                  </button>
                </div>

                <div className="space-y-space-sm">
                  {appointmentsList.map((app) => (
                    <div
                      key={app.id}
                      className="bg-surface-container-low p-space-md border border-outline-variant/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-spec-code-sm text-[10px] text-secondary font-bold uppercase">
                          {app.occasion} • Status: {app.status}
                        </span>
                        <h4 className="font-bold text-on-surface text-base">
                          {app.salonLocation === 'BANANI_11_FLAGSHIP'
                            ? 'Banani Road 11 VIP Flagship Salon'
                            : 'Sylhet Manor Artisanal Suite'}
                        </h4>
                        <p className="font-spec-code-sm text-xs text-on-surface-variant">
                          Date: {app.appointmentDate} • Slot: {app.timeSlot}
                        </p>
                      </div>

                      <span className="bg-secondary text-on-secondary px-3 py-1 font-spec-code-sm text-[10px] uppercase font-bold">
                        Confirmed
                      </span>
                    </div>
                  ))}
                </div>

                {isBookingOpen && (
                  <form onSubmit={handleBookAppointment} className="mt-4 p-space-md bg-surface border border-secondary/40 space-y-3 font-body-sm animate-in fade-in">
                    <h4 className="font-label-caps text-label-caps uppercase font-bold text-secondary">
                      Reserve Private Fitting Slot
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase block mb-1">Salon Location</label>
                        <select
                          value={appLocation}
                          onChange={(e) => setAppLocation(e.target.value as any)}
                          className="w-full p-2 border border-outline-variant/60 bg-surface-container-low font-spec-code text-xs"
                        >
                          <option value="BANANI_11_FLAGSHIP">Banani 11 Flagship Salon</option>
                          <option value="SYLHET_ARTISANAL_SUITE">Sylhet Artisanal Suite</option>
                          <option value="PRIVATE_RESIDENCE">Private Residence Doorstep</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase block mb-1">Occasion</label>
                        <select
                          value={appOccasion}
                          onChange={(e) => setAppOccasion(e.target.value as any)}
                          className="w-full p-2 border border-outline-variant/60 bg-surface-container-low font-spec-code text-xs"
                        >
                          <option value="ROYAL_WEDDING">Royal Wedding Matrimony</option>
                          <option value="CEREMONIAL_EID">Eid Ceremonial Couture</option>
                          <option value="WARDROBE_COMMISSION">Private Wardrobe Commission</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase block mb-1">Fitting Date</label>
                        <input
                          type="date"
                          value={appDate}
                          onChange={(e) => setAppDate(e.target.value)}
                          className="w-full p-2 border border-outline-variant/60 bg-surface-container-low font-spec-code text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase block mb-1">Time Slot</label>
                        <select
                          value={appTime}
                          onChange={(e) => setAppTime(e.target.value)}
                          className="w-full p-2 border border-outline-variant/60 bg-surface-container-low font-spec-code text-xs"
                        >
                          <option>11:00 AM – 12:30 PM</option>
                          <option>02:00 PM – 03:30 PM</option>
                          <option>04:00 PM – 05:30 PM</option>
                          <option>07:00 PM – 08:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsBookingOpen(false)}
                        className="px-4 py-2 text-xs uppercase font-label-caps"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-on-primary px-6 py-2 text-xs font-label-caps uppercase font-bold hover:bg-secondary transition-colors"
                      >
                        Confirm Slot
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB F: LOYALTY & SOVEREIGN CREDITS */}
            {activeTab === 'loyalty' && (
              <div className="space-y-space-md font-spec-code text-spec-code">
                <div className="border-b border-outline-variant/40 pb-space-xs flex items-center justify-between">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Sovereign Privilege Ledger
                  </h3>
                  <span className="text-secondary font-bold text-sm">{patron.loyaltyPoints} Available Points</span>
                </div>

                <div className="bg-secondary-fixed/30 border border-secondary/30 p-4 space-y-2">
                  <div className="flex items-center justify-between font-label-caps text-label-caps uppercase font-bold text-secondary">
                    <span>Sovereign Tier Status</span>
                    <span>Level 3 Patron</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: '80%' }} />
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">
                    You have unlocked: Complimentary Valet Parking at Banani 11, Annual Trunk Show Previews, and Priority Loom Weaving.
                  </p>
                </div>
              </div>
            )}

            {/* TAB A: CURRENCY & REGIONAL SETTINGS */}
            {activeTab === 'regional' && (
              <div className="space-y-space-md">
                <div className="border-b border-outline-variant/40 pb-space-xs">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Currency & Valuation Settings
                  </h3>
                </div>

                <div className="space-y-3 font-spec-code text-spec-code">
                  <label className="text-on-surface-variant uppercase text-xs block">
                    Select Active Valuation Currency:
                  </label>
                  <div className="grid grid-cols-3 gap-space-sm">
                    {(['BDT', 'USD', 'GBP', 'AED', 'EUR'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          showToast('Valuation Updated', `Currency standard switched to ${c}`);
                        }}
                        className={`p-3 border text-center transition-colors ${
                          currency === c
                            ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-md'
                            : 'border-outline-variant/60 hover:border-secondary text-on-surface'
                        }`}
                      >
                        <span className="text-base font-bold block">{c}</span>
                        <span className="text-xs text-on-surface-variant">
                          {c === 'BDT' ? 'Bangladeshi Taka (৳)' : c === 'USD' ? 'US Dollar ($)' : 'British Pound (£)'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
