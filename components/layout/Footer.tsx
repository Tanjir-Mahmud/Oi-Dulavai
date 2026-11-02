'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container border-t border-outline-variant/60 text-on-surface">
      <div className="max-w-[1440px] mx-auto px-gutter-mobile lg:px-margin pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl mb-space-xl">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="font-headline-md text-headline-md tracking-tight uppercase font-bold text-on-surface">
                Oi Dulavai
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed max-w-sm">
              Architectural heritage menswear rooted in Bengali textile traditions. Curating fine Tussar silks,
              hand-spun muslin, bespoke zardozi sherwanis, and structural safari coats for the discerning gentleman.
            </p>
            <div className="space-y-1 font-spec-code text-spec-code text-on-surface-variant">
              <div className="flex items-center gap-space-xs">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>Concierge Hotline: +880 1711-000000</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>concierge@oidulavai.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-space-md">
            <h3 className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface border-b border-outline-variant/40 pb-space-xs">
              Quick Links
            </h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li>
                <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  About Oi Dulavai
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  Contact Atelier
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Panjabi" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  Artisanal Panjabis
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Waskoti" className="text-on-surface-variant hover:text-on-surface transition-colors py-0.5 inline-block">
                  Waskoti & Vests
                </Link>
              </li>
            </ul>
          </div>

          {/* Ateliers */}
          <div className="lg:col-span-3 space-y-space-md">
            <h3 className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface border-b border-outline-variant/40 pb-space-xs">
              Dhaka & Sylhet Ateliers
            </h3>
            <div className="space-y-space-md font-body-sm text-body-sm">
              <div className="border-l-2 border-secondary pl-space-sm">
                <h4 className="font-bold text-on-surface uppercase tracking-wider font-label-caps text-label-caps">
                  Banani 11 Flagship & Salon
                </h4>
                <p className="text-on-surface-variant">Plot 42, Road 11, Block D, Banani, Dhaka</p>
                <p className="font-spec-code-sm text-spec-code-sm text-secondary-fixed-variant mt-0.5">
                  Daily: 11:00 AM – 9:30 PM • Valet Parking
                </p>
              </div>

              <div className="border-l-2 border-outline-variant pl-space-sm">
                <h4 className="font-bold text-on-surface uppercase tracking-wider font-label-caps text-label-caps">
                  Sylhet Artisanal Suite
                </h4>
                <p className="text-on-surface-variant">Kumarpara Heritage Manor, Sylhet</p>
                <p className="font-spec-code-sm text-spec-code-sm text-secondary-fixed-variant mt-0.5">
                  Bespoke Fittings: Thu – Sun
                </p>
              </div>
            </div>
          </div>

          {/* Inquiries & Payment Certifications */}
          <div className="lg:col-span-3 space-y-space-md">
            <h3 className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface border-b border-outline-variant/40 pb-space-xs">
              Concierge & Inquiries
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Subscribe for trunk show invitations, seasonal fabric disclosures, and bridal salon previews.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-space-sm">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="w-full bg-surface-container-lowest border border-outline-variant px-space-sm py-2 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-space-sm py-2 font-label-caps text-label-caps hover:bg-secondary transition-colors uppercase tracking-widest whitespace-nowrap font-bold"
                >
                  Join
                </button>
              </div>
            </form>

            <div className="pt-space-xs">
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-space-xs">
                Certified Payment Gateways
              </div>
              <div className="flex items-center gap-space-xs font-spec-code-sm text-spec-code-sm text-on-surface-variant flex-wrap">
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/60 font-semibold text-pink-700">
                  bKash Merchant
                </span>
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/60 font-semibold text-orange-600">
                  Nagad Direct
                </span>
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/60 font-semibold text-blue-700">
                  AMEX Centurion
                </span>
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant/60 font-semibold text-on-surface">
                  Visa / Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-md border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-spec-code-sm text-spec-code-sm text-on-surface-variant">
          <p>© 2025 OI DULAVAI (ঐ দুলাভাই) BESPOKE ATELIER. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-space-md">
            <Link href="/about" className="hover:text-on-surface transition-colors">
              Bespoke Protocol
            </Link>
            <Link href="/about" className="hover:text-on-surface transition-colors">
              Textile Care Guide
            </Link>
            <Link href="/contact" className="hover:text-on-surface transition-colors">
              Concierge Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
