import React from 'react';
import Link from 'next/link';
import { Scissors, Sparkles, ShieldCheck, MapPin, Compass, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full bg-surface">
      {/* Hero Editorial Header */}
      <section className="relative w-full min-h-[60vh] flex items-end bg-primary text-on-primary py-space-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYUcir0k4E8-2WgWdl4dVyv4zdzUv0w2qlFccpLoTqOuda9xDg4xcSJ6AL4isRUb-KvRzjs3MWKgWNtlhZvckGSP4FkHOLXColbfGCgMHZLvMrvnPZcd7xMuYdnjuYNpkz9NZxx2WC0QGBQoWMAscrHm4NGQB2OmYvSmhCtqI1mWtUa5PcNRKJkGAB_mkxypcDsMNFC6xNSvlAv7M88-76EuM5z2yCFBBlK0VPozQ')`,
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-md">
          <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-3 py-1 font-label-caps text-label-caps uppercase tracking-widest font-bold">
            <Compass className="w-4 h-4" />
            <span>Atelier Manifesto • Established in Bengal</span>
          </div>

          <h1 className="font-headline-xl text-[48px] sm:text-[64px] text-surface-container-lowest uppercase tracking-tight leading-none max-w-3xl">
            Architectural Heritage. Royal Sericulture.
          </h1>

          <p className="font-body-lg text-surface-variant max-w-2xl leading-relaxed">
            Oi Dulavai (ঐ দুলাভাই) was conceived to rescue Bengali royal sartorial traditions from ornamental excess, returning them to structural clarity, raw textile pedigree, and Savile Row discipline.
          </p>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-6 space-y-space-md">
            <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest">
              Sericulture Origins
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase leading-tight">
              Four Centuries of Rajshahi Mulberry Silk
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Centuries before modern industrial synthetic blends, the weavers of Bengal crafted fabrics so delicate they passed through a signet ring, yet sturdy enough to drape emperors. Our Tussar and Mulberry silks are sourced exclusively from rural cooperatives along the Padma basin.
            </p>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              We reject artificial silicone softeners and chemical lustering agents. The distinctive tactile slub of our fabrics is living silk—breathing naturally in our humid summers and insulating through winter celebrations.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] bg-surface-container border border-outline-variant/60 shadow-xl overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc"
              alt="Raw Tussar Silk Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Core Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="bg-surface-container-low p-space-lg border border-outline-variant/60 space-y-3">
            <Scissors className="w-8 h-8 text-secondary" />
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              Zero Excess Tailoring
            </h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              Every seam, placket, and shoulder drop is engineered with geometric rigor. Clean contours replace gaudy ornamentation, letting the natural luster of handspun thread command the room.
            </p>
          </div>

          <div className="bg-surface-container-low p-space-lg border border-outline-variant/60 space-y-3">
            <Sparkles className="w-8 h-8 text-secondary" />
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              24K Bullion Zardozi
            </h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              Our embroiderers work exclusively with hand-turned metallic wires and antique bullion threads. Every crest and placket is couched stitch-by-stitch over dozens of artisanal hours.
            </p>
          </div>

          <div className="bg-surface-container-low p-space-lg border border-outline-variant/60 space-y-3">
            <ShieldCheck className="w-8 h-8 text-secondary" />
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              White-Glove Chauffeur Fleet
            </h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              Luxury ends when the experience feels like mass courier logistics. Our dedicated climate-controlled fleet ensures your garments arrive impeccably steamed, with two trial sizes and master tailor support.
            </p>
          </div>
        </div>

        {/* Atelier Locations Section */}
        <div className="bg-primary text-on-primary p-space-xl border border-secondary/40 shadow-2xl">
          <div className="max-w-3xl space-y-space-md">
            <span className="font-spec-code-sm text-secondary-fixed-dim uppercase font-bold tracking-widest">
              Private Fitting Salons
            </span>
            <h2 className="font-headline-lg text-headline-lg text-white uppercase leading-tight">
              Experience the Banani Flagship Salon
            </h2>
            <p className="font-body-md text-surface-variant leading-relaxed">
              Located on Banani Road 11, our flagship pavilion features private groom fitting suites, textile archive displays, and heirloom sample chests. Appointments include dedicated draper consultation and swatch customization.
            </p>
            <div className="pt-space-xs flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-secondary text-on-secondary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold hover:bg-white hover:text-primary transition-colors shadow-lg"
              >
                Book Private Salon Fitting
              </Link>
              <Link
                href="/collections"
                className="border border-white/40 text-white px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold hover:bg-white/10 transition-colors"
              >
                Explore Current Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
