'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  Menu,
  X,
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Calendar,
  Settings,
  ArrowRight,
  LogOut,
  Package,
  Ruler,
  Shield,
  Layers,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { cart, wishlist, openCart, openWishlist, currency, setCurrency, cartSubtotal } =
    useAtelierStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsAccordionOpen, setIsCollectionsAccordionOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTrackCode, setQuickTrackCode] = useState('');

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Patron Auth State
  const [patron, setPatron] = useState<{
    name: string;
    email: string;
    vaultId?: string;
    tier?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch current session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setPatron(data.user);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackCode.trim()) {
      setIsPrefsOpen(false);
      router.push(`/tracking/${quickTrackCode.trim().toUpperCase()}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setPatron(null);
    setIsAccountOpen(false);
    router.push('/');
    router.refresh();
  };

  const subtotal = cartSubtotal();
  const cartTotalQuantity = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all">
      <div className="h-20 max-w-[1440px] mx-auto px-gutter-mobile lg:px-margin flex items-center justify-between gap-space-md">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-space-lg xl:gap-space-xl">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open Mobile Navigation"
            className="xl:hidden p-2 text-on-surface hover:text-secondary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-space-xs group shrink-0">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight uppercase font-bold text-on-surface group-hover:text-secondary transition-colors leading-none">
                Oi Dulavai
              </span>
              <span className="font-spec-code-sm text-spec-code-sm tracking-[0.2em] text-on-surface-variant uppercase mt-1">
                ঐ দুলাভাই • Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Nav with Luxury Mega-Menu */}
          <nav className="hidden xl:flex items-center gap-space-md 2xl:gap-space-lg font-label-caps text-label-caps tracking-widest">
            <Link
              href="/"
              className="py-1 text-primary font-bold border-b-2 border-primary hover:text-secondary transition-colors"
            >
              Home
            </Link>

            <div className="relative group py-2">
              <Link
                href="/collections"
                className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer py-1"
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-transform group-hover:rotate-180" />
              </Link>

              {/* Luxury Mega Menu Preview Panel */}
              <div className="absolute left-0 top-full hidden group-hover:grid grid-cols-12 gap-6 bg-surface-container-lowest border border-outline-variant shadow-2xl p-6 min-w-[760px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Categories Column */}
                <div className="col-span-5 space-y-3 border-r border-outline-variant/40 pr-6">
                  <span className="font-spec-code-sm text-[10px] uppercase tracking-widest text-secondary font-bold">
                    Heirloom Categories
                  </span>
                  <div className="space-y-1 font-headline-md text-[15px]">
                    <Link
                      href="/collections?category=Panjabi"
                      className="flex items-center justify-between py-1.5 text-on-surface hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      <span>Rajshahi Silk Panjabi</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <Link
                      href="/collections?category=Waskoti"
                      className="flex items-center justify-between py-1.5 text-on-surface hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      <span>Embroidered Waskoti</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <Link
                      href="/collections?category=Sherwani"
                      className="flex items-center justify-between py-1.5 text-on-surface hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      <span>Royal Sherwani</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <Link
                      href="/collections?category=Trousers"
                      className="flex items-center justify-between py-1.5 text-on-surface hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      <span>Bengal Gurkha Pants</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                    <Link
                      href="/collections?category=Shirt"
                      className="flex items-center justify-between py-1.5 text-on-surface hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      <span>Irish Linen Shirts</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/40">
                    <Link
                      href="/collections"
                      className="font-label-caps text-label-caps uppercase text-secondary font-bold hover:underline flex items-center gap-1.5"
                    >
                      <span>View All 2025 Archive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Visual Category Previews (7 Cols) */}
                <div className="col-span-7 grid grid-cols-2 gap-4">
                  <Link
                    href="/product/nawab-tussar-silk-panjabi"
                    className="group/card relative aspect-[3/4] bg-surface-container overflow-hidden border border-outline-variant/60 shadow-md block"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc"
                      alt="Nawab Tussar Silk"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent p-3 flex flex-col justify-end text-on-primary">
                      <span className="font-spec-code-sm text-[9px] uppercase tracking-wider text-secondary-fixed-dim">Featured Vault</span>
                      <span className="font-headline-md text-xs uppercase font-bold truncate">Nawab Silk Panjabi</span>
                      <span className="font-spec-code text-xs text-surface-variant">৳ 16,800</span>
                    </div>
                  </Link>

                  <Link
                    href="/collections?category=Waskoti"
                    className="group/card relative aspect-[3/4] bg-surface-container overflow-hidden border border-outline-variant/60 shadow-md block"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZ4g9R_ZqQJ7_yFj5h6aR9yS1yWd0wX5bE1tP9qL8kZ4uC3vN7mI2oP6rT0yE4wX9bV2kL1jH8gM5fS3dA7cN9pQ0tZ6yW4vB1uN7kX2mO9jR6eS8cT5"
                      alt="Shahi Velvet Waskoti"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent p-3 flex flex-col justify-end text-on-primary">
                      <span className="font-spec-code-sm text-[9px] uppercase tracking-wider text-secondary-fixed-dim">Royal Waistcoat</span>
                      <span className="font-headline-md text-xs uppercase font-bold truncate">Shahi Velvet Waskoti</span>
                      <span className="font-spec-code text-xs text-surface-variant">৳ 21,500</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-on-surface-variant hover:text-on-surface transition-colors py-1"
            >
              Contact
            </Link>

            <Link
              href="/tracking/OD-DHAKA-8492"
              className="text-secondary hover:text-primary transition-colors py-1 flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Live Track</span>
            </Link>
          </nav>
        </div>

        {/* Right Side: Search, Preferences, Wishlist, Bag, Profile */}
        <div className="flex items-center gap-space-sm lg:gap-space-md">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:flex items-center">
            <div className="flex items-center bg-surface-container-low border border-outline-variant/60 rounded-full px-space-sm py-1.5 focus-within:border-secondary transition-all w-52 xl:w-64">
              <Search className="w-4 h-4 text-outline mr-space-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Silk, Waskoti, Linen..."
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
            </div>
          </form>

          {/* Quick Preferences Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPrefsOpen(!isPrefsOpen);
                setIsAccountOpen(false);
              }}
              aria-label="Settings and Preferences"
              className="p-space-xs text-on-surface hover:text-secondary transition-colors flex items-center justify-center"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {isPrefsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant shadow-2xl p-4 z-50 transition-all">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2 mb-3">
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface font-bold">
                    Quick Preferences
                  </span>
                  <button
                    onClick={() => setIsPrefsOpen(false)}
                    className="text-on-surface-variant hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 font-spec-code-sm text-spec-code-sm">
                  {/* Currency Valuation Switcher */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant uppercase text-[10px] tracking-wider font-semibold block">
                      Currency Valuation
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['BDT', 'USD', 'GBP'] as const).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setCurrency(curr)}
                          className={`py-1 border text-center transition-colors ${
                            currency === curr
                              ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                              : 'border-outline-variant/60 hover:border-secondary text-on-surface'
                          }`}
                        >
                          {curr} {curr === 'BDT' ? '৳' : curr === 'USD' ? '$' : '£'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dhaka Express Quick Track */}
                  <div className="space-y-1">
                    <label className="text-on-surface-variant uppercase text-[10px] tracking-wider font-semibold block">
                      Dhaka Express Staging Track
                    </label>
                    <form onSubmit={handleQuickTrackSubmit} className="flex">
                      <input
                        type="text"
                        value={quickTrackCode}
                        onChange={(e) => setQuickTrackCode(e.target.value)}
                        placeholder="OD-DHAKA-8492"
                        className="w-full bg-surface-container-low border border-outline-variant/60 px-2 py-1 text-on-surface focus:outline-none focus:border-secondary text-spec-code uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-on-primary px-2 font-label-caps text-[10px] uppercase tracking-wider hover:bg-secondary transition-colors shrink-0"
                      >
                        Track
                      </button>
                    </form>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/40 space-y-1 font-body-sm text-[12px]">
                    <Link
                      href="/contact"
                      onClick={() => setIsPrefsOpen(false)}
                      className="flex items-center justify-between text-on-surface-variant hover:text-secondary py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-secondary" />
                        Banani Atelier Concierge
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setIsPrefsOpen(false)}
                      className="flex items-center justify-between text-on-surface-variant hover:text-secondary py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Settings className="w-4 h-4 text-secondary" />
                        Patron Settings & Vault
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="relative">
            <button
              onClick={openWishlist}
              aria-label="Wishlist"
              className="relative p-space-xs text-on-surface hover:text-secondary transition-colors flex items-center justify-center"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 font-spec-code-sm text-[9px] bg-secondary text-on-secondary w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Bag & Checkout CTAs */}
          <div className="flex items-center gap-space-xs">
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-2 hover:bg-secondary transition-colors font-label-caps text-label-caps border border-primary"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tracking-wider">BAG ({cartTotalQuantity})</span>
            </button>

            {cart.length > 0 && (
              <Link
                href="/checkout"
                className="hidden sm:inline-flex items-center bg-secondary text-on-secondary px-space-md py-2 hover:bg-primary transition-colors font-label-caps text-label-caps border border-secondary tracking-widest uppercase font-bold"
              >
                <span>Checkout {formatPrice(subtotal, currency)}</span>
              </Link>
            )}
          </div>

          {/* Patron Account Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAccountOpen(!isAccountOpen);
                setIsPrefsOpen(false);
              }}
              aria-label="Account"
              className="w-8 h-8 rounded-full bg-primary hover:bg-secondary text-on-primary flex items-center justify-center ml-space-xs transition-colors"
            >
              <User className="w-4 h-4" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant shadow-2xl p-4 z-50">
                {patron ? (
                  <>
                    <div className="flex items-start justify-between border-b border-outline-variant/40 pb-3 mb-3">
                      <div>
                        <div className="font-label-caps text-label-caps text-secondary font-bold tracking-widest uppercase text-[10px]">
                          {patron.tier || 'Sovereign Patron'}
                        </div>
                        <h4 className="font-headline-md text-[16px] text-on-surface leading-tight mt-0.5">
                          {patron.name}
                        </h4>
                        <p className="font-spec-code-sm text-[10px] text-on-surface-variant">
                          Vault ID • {patron.vaultId || 'SOV-BANANI-409'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAccountOpen(false)}
                        className="text-on-surface-variant hover:text-primary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 font-body-sm text-[13px]">
                      <Link
                        href="/account"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center justify-between p-2 hover:bg-surface-container-low transition-colors text-on-surface"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-secondary" />
                          Orders & Doorstep Fittings
                        </span>
                        <span className="font-spec-code-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 font-bold">
                          Active
                        </span>
                      </Link>

                      <Link
                        href="/account?tab=measurements"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center justify-between p-2 hover:bg-surface-container-low transition-colors text-on-surface"
                      >
                        <span className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-secondary" />
                          Bespoke Measurement Vault
                        </span>
                        <span className="font-spec-code-sm text-[10px] text-on-surface-variant">
                          Ready (40)
                        </span>
                      </Link>

                      {patron.role && patron.role !== 'CUSTOMER' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center justify-between p-2 bg-secondary/10 hover:bg-secondary/20 transition-colors text-secondary font-bold"
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Admin Atelier Console
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="pt-3 mt-2 border-t border-outline-variant/40 flex items-center justify-between">
                      <button
                        onClick={handleLogout}
                        className="font-spec-code-sm text-spec-code-sm text-error hover:underline flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                      <span className="font-spec-code-sm text-[10px] text-on-surface-variant">
                        Banani Flagship Session
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="border-b border-outline-variant/40 pb-2">
                      <h4 className="font-headline-md text-[16px] text-on-surface uppercase">
                        Patron Identification
                      </h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Access your measurement vault and order milestones.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="block w-full text-center bg-primary text-on-primary py-2 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold"
                      >
                        Patron Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsAccountOpen(false)}
                        className="block w-full text-center border border-outline-variant text-on-surface py-2 font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-high transition-colors"
                      >
                        Create Patron Profile
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/40 text-center">
                      <Link
                        href="/admin/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="font-spec-code-sm text-[10px] text-secondary hover:underline flex items-center justify-center gap-1"
                      >
                        <Shield className="w-3 h-3" />
                        Atelier Staff Console Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Full Slide-Over Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-[85vw] max-w-sm bg-surface shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-outline-variant/60">
              <div className="p-space-md space-y-space-md">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-sm">
                  <div>
                    <span className="font-headline-md text-headline-md uppercase font-bold text-on-surface">
                      Oi Dulavai
                    </span>
                    <span className="font-spec-code-sm text-[10px] tracking-widest text-secondary block uppercase">
                      ঐ দুলাভাই • Private Client Atelier
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close Mobile Navigation"
                    className="p-2 text-on-surface-variant hover:text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search Form */}
                <form onSubmit={handleSearchSubmit} className="flex">
                  <div className="flex items-center bg-surface-container-low border border-outline-variant/60 w-full px-3 py-2">
                    <Search className="w-4 h-4 text-outline mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search silk, sherwani, linen..."
                      className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-4 font-label-caps text-xs uppercase font-bold min-h-[44px]"
                  >
                    Go
                  </button>
                </form>

                {/* Primary Nav Links & Collapsible Accordion */}
                <div className="space-y-1 font-label-caps text-label-caps tracking-widest uppercase">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 text-on-surface border-b border-outline-variant/30 font-bold min-h-[44px]"
                  >
                    <span>Atelier Home</span>
                    <ArrowRight className="w-4 h-4 text-outline" />
                  </Link>

                  {/* Collections Accordion */}
                  <div className="border-b border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setIsCollectionsAccordionOpen(!isCollectionsAccordionOpen)}
                      className="w-full flex items-center justify-between py-3 px-2 text-on-surface font-bold min-h-[44px]"
                    >
                      <span>Heirloom Collections</span>
                      <ChevronDown
                        className={`w-4 h-4 text-outline transition-transform duration-200 ${
                          isCollectionsAccordionOpen ? 'rotate-180 text-secondary' : ''
                        }`}
                      />
                    </button>

                    {isCollectionsAccordionOpen && (
                      <div className="bg-surface-container-low/60 px-3 py-2 space-y-1 font-body-sm text-body-sm normal-case border-t border-outline-variant/20 animate-in fade-in">
                        <Link
                          href="/collections?category=Panjabi"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-on-surface-variant hover:text-secondary min-h-[44px]"
                        >
                          <span>Rajshahi Silk Panjabi</span>
                          <span className="font-spec-code-sm text-[10px] text-secondary">View</span>
                        </Link>
                        <Link
                          href="/collections?category=Waskoti"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-on-surface-variant hover:text-secondary min-h-[44px]"
                        >
                          <span>Embroidered Waskoti & Vests</span>
                          <span className="font-spec-code-sm text-[10px] text-secondary">View</span>
                        </Link>
                        <Link
                          href="/collections?category=Sherwani"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-on-surface-variant hover:text-secondary min-h-[44px]"
                        >
                          <span>Royal Ceremonial Sherwani</span>
                          <span className="font-spec-code-sm text-[10px] text-secondary">View</span>
                        </Link>
                        <Link
                          href="/collections?category=Trousers"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-on-surface-variant hover:text-secondary min-h-[44px]"
                        >
                          <span>Bengal Gurkha Pants</span>
                          <span className="font-spec-code-sm text-[10px] text-secondary">View</span>
                        </Link>
                        <Link
                          href="/collections?category=Shirt"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-on-surface-variant hover:text-secondary min-h-[44px]"
                        >
                          <span>Irish Linen Heritage Shirts</span>
                          <span className="font-spec-code-sm text-[10px] text-secondary">View</span>
                        </Link>
                        <Link
                          href="/collections"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-secondary font-bold font-label-caps text-xs uppercase tracking-wider border-t border-outline-variant/30 mt-1 min-h-[44px]"
                        >
                          Complete 2025 Catalog →
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 text-on-surface border-b border-outline-variant/30 min-h-[44px]"
                  >
                    <span>About the Atelier</span>
                    <ArrowRight className="w-4 h-4 text-outline" />
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 text-on-surface border-b border-outline-variant/30 min-h-[44px]"
                  >
                    <span>Bespoke Concierge & Lounge</span>
                    <ArrowRight className="w-4 h-4 text-outline" />
                  </Link>

                  <Link
                    href="/tracking/OD-DHAKA-8492"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-2 text-secondary font-bold border-b border-outline-variant/30 min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Live Order Telemetry
                    </span>
                    <span className="text-xs">→</span>
                  </Link>
                </div>

                {/* Currency Switcher */}
                <div className="pt-2">
                  <span className="font-spec-code-sm text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1.5 font-bold">
                    Currency Settlement
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['BDT', 'USD', 'GBP', 'EUR'] as const).map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setCurrency(cur)}
                        className={`py-2 text-center font-spec-code-sm text-xs border min-h-[44px] transition-colors ${
                          currency === cur
                            ? 'bg-secondary text-on-secondary border-secondary font-bold'
                            : 'bg-surface-container-low border-outline-variant/60 text-on-surface'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Account Shortcut */}
              <div className="p-space-md border-t border-outline-variant/40 bg-surface-container-low/60 space-y-2">
                {patron ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface text-sm block">{patron.name}</span>
                      <span className="font-spec-code-sm text-[10px] text-secondary">
                        {patron.tier || 'VIP Patron'}
                      </span>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-primary text-on-primary px-3 py-2 text-xs font-label-caps uppercase tracking-wider font-bold min-h-[44px] flex items-center"
                    >
                      Dossier
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center bg-primary text-on-primary py-2.5 font-label-caps text-xs uppercase tracking-widest font-bold min-h-[44px] flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center border border-outline-variant text-on-surface py-2.5 font-label-caps text-xs uppercase tracking-widest font-bold min-h-[44px] flex items-center justify-center hover:bg-surface-container-high"
                    >
                      Join Atelier
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
