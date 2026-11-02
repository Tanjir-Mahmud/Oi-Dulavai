'use client';

import React, { useState } from 'react';
import { useAtelierStore } from '@/lib/store';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useAtelierStore();

  const [patronName, setPatronName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salonLocation, setSalonLocation] = useState<'BANANI_11_FLAGSHIP' | 'SYLHET_ARTISANAL_SUITE' | 'PRIVATE_RESIDENCE'>('BANANI_11_FLAGSHIP');
  const [occasion, setOccasion] = useState<'ROYAL_WEDDING' | 'CEREMONIAL_EID' | 'WARDROBE_COMMISSION' | 'OTHER'>('ROYAL_WEDDING');
  const [appointmentDate, setAppointmentDate] = useState('2025-11-20');
  const [timeSlot, setTimeSlot] = useState('04:00 PM – 05:30 PM');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patronName,
          phone,
          email,
          salonLocation,
          occasion,
          appointmentDate,
          timeSlot,
          partySize: Number(partySize),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not schedule appointment.');
      }

      setIsSuccess(true);
      showToast('Salon Slot Reserved', `Appointment confirmed for ${appointmentDate} at ${timeSlot}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error booking appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-surface py-space-xl min-h-[90vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Header */}
        <div className="border-b border-outline-variant/60 pb-space-sm">
          <div className="flex items-center gap-2 font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Banani 11 VIP Concierge Desk</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
            Bespoke Lounge & Fitting Appointments
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-2xl mt-1">
            Private fittings, groom trunk consultations, and heirloom fabric customization. Book your dedicated salon suite with our master drapers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Form: Booking Engine (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg border border-outline-variant/60 shadow-lg space-y-space-md">
            {isSuccess ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-secondary mx-auto" />
                <h2 className="font-headline-lg text-on-surface uppercase">Salon Fitting Confirmed</h2>
                <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                  Thank you, <strong className="text-on-surface">{patronName}</strong>. Your private fitting suite at{' '}
                  {salonLocation === 'BANANI_11_FLAGSHIP'
                    ? 'Banani 11 Flagship'
                    : salonLocation === 'SYLHET_ARTISANAL_SUITE'
                    ? 'Sylhet Manor'
                    : 'Private Residence'}{' '}
                  has been reserved for {appointmentDate} at {timeSlot}.
                </p>
                <p className="font-spec-code-sm text-xs text-secondary font-bold">
                  Our Chief Draper will confirm concierge details via telephone.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase tracking-wider font-bold"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-space-md font-body-sm">
                <div className="border-b border-outline-variant/40 pb-space-xs">
                  <h3 className="font-headline-md text-headline-md text-on-surface uppercase font-bold">
                    Salon Slot Reservation
                  </h3>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-error-container text-on-error-container border border-error/30 text-xs font-spec-code">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Patron Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asif Mahmud Chowdhury"
                      value={patronName}
                      onChange={(e) => setPatronName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Direct Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary font-spec-code"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patron@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Atelier Location
                    </label>
                    <select
                      value={salonLocation}
                      onChange={(e) => setSalonLocation(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface text-xs font-spec-code"
                    >
                      <option value="BANANI_11_FLAGSHIP">Banani Road 11 Flagship Salon</option>
                      <option value="SYLHET_ARTISANAL_SUITE">Sylhet Artisanal Manor Suite</option>
                      <option value="PRIVATE_RESIDENCE">Private Residence Doorstep Fitting</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Ceremonial Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface text-xs font-spec-code"
                    >
                      <option value="ROYAL_WEDDING">Royal Wedding & Groom Matrimony</option>
                      <option value="CEREMONIAL_EID">Eid Ul-Fitr / Eid Ul-Adha Couture</option>
                      <option value="WARDROBE_COMMISSION">Private Wardrobe Commission</option>
                      <option value="OTHER">Other Sartorial Inquiries</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Requested Date
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface font-spec-code text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface text-xs font-spec-code"
                    >
                      <option>11:00 AM – 12:30 PM</option>
                      <option>02:00 PM – 03:30 PM</option>
                      <option>04:00 PM – 05:30 PM</option>
                      <option>07:00 PM – 08:30 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                      Party Size
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 px-3 py-2 text-on-surface font-spec-code text-xs text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                    Special Fabric Preferences or Customization Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Groom and two groomsmen, looking for matching Tussar silk panjabis and contrasting velvet waskotis..."
                    className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="pt-space-xs">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-secondary text-on-primary py-4 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registering With Salon...' : 'Confirm Appointment Slot'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Info: Flagship Salons & Concierge Contacts (5 Cols) */}
          <div className="lg:col-span-5 space-y-space-md">
            <div className="bg-surface-container-low p-space-lg border border-outline-variant/60 shadow-lg space-y-space-md">
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase border-b border-outline-variant/40 pb-space-xs font-bold">
                Atelier Salons
              </h3>

              <div className="space-y-space-md font-body-sm text-body-sm">
                <div className="border-l-2 border-secondary pl-3 space-y-1">
                  <h4 className="font-bold text-on-surface text-base uppercase font-label-caps text-label-caps">
                    Banani 11 Flagship & VIP Fitting Salon
                  </h4>
                  <p className="text-on-surface-variant">Plot 42, Road 11, Block D, Banani, Dhaka-1213</p>
                  <p className="font-spec-code-sm text-xs text-secondary-fixed-variant">
                    Hours: Daily 11:00 AM – 9:30 PM • Valet Service Available
                  </p>
                  <p className="font-spec-code-sm text-xs text-on-surface-variant">
                    Direct Line: +880 1711-000001
                  </p>
                </div>

                <div className="border-l-2 border-outline-variant pl-3 space-y-1">
                  <h4 className="font-bold text-on-surface text-base uppercase font-label-caps text-label-caps">
                    Sylhet Artisanal Manor Suite
                  </h4>
                  <p className="text-on-surface-variant">Kumarpara Heritage Manor, Sylhet</p>
                  <p className="font-spec-code-sm text-xs text-secondary-fixed-variant">
                    Bespoke Fittings: Thursday – Sunday (By Appointment)
                  </p>
                  <p className="font-spec-code-sm text-xs text-on-surface-variant">
                    Direct Line: +880 1711-000002
                  </p>
                </div>
              </div>

              <div className="pt-space-sm border-t border-outline-variant/40 space-y-2 font-spec-code text-spec-code text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary shrink-0" />
                  <span>VIP Concierge: +880 1711-000000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary shrink-0" />
                  <span>concierge@oidulavai.com</span>
                </div>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-space-md border border-secondary/40 shadow-md space-y-2">
              <span className="font-spec-code-sm text-secondary-fixed-dim uppercase font-bold text-[10px]">
                Complimentary In-Salon Hospitality
              </span>
              <h4 className="font-headline-md text-white text-base uppercase font-bold">
                Private Matrimonial Concierge
              </h4>
              <p className="font-body-sm text-xs text-surface-variant leading-relaxed">
                Enjoy single-estate Sylhet organic green tea, Tussar silk swatch decks, and personalized digital silhouette renderings while our master drapers take your bespoke measurements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
