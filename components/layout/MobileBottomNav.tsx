'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, wishlist, openCart, openWishlist } = useAtelierStore();

  // If in admin dashboard, hide storefront mobile bottom nav
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navItems = [
    { label: 'Atelier', href: '/', icon: Home, isAction: false },
    { label: 'Archive', href: '/collections', icon: Compass, isAction: false },
    {
      label: 'Wishlist',
      icon: Heart,
      isAction: true,
      onClick: openWishlist,
      badge: wishlistCount,
    },
    {
      label: 'Bag',
      icon: ShoppingBag,
      isAction: true,
      onClick: openCart,
      badge: cartCount,
    },
    { label: 'Patron', href: '/account', icon: User, isAction: false },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/60 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <nav className="max-w-md mx-auto grid grid-cols-5 items-center px-1 py-1.5 font-label-caps text-[9px] tracking-widest uppercase">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            !item.isAction &&
            item.href &&
            (pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href)));

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                aria-label={`Open ${item.label}`}
                className="relative flex flex-col items-center justify-center py-1 text-on-surface hover:text-secondary transition-colors min-h-[44px] min-w-[44px]"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-secondary text-on-secondary font-spec-code-sm text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 font-semibold">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] min-w-[44px] ${
                isActive ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full" />
                )}
              </div>
              <span className="mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
