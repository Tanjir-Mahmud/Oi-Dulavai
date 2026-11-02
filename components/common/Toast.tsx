'use client';

import React from 'react';
import { useAtelierStore } from '@/lib/store';
import { CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export function Toast() {
  const { toast, hideToast, openCart } = useAtelierStore();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary p-4 shadow-2xl max-w-sm w-full border border-secondary/40 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-secondary-fixed-dim shrink-0" />
          <div>
            <p className="font-label-caps text-label-caps uppercase font-bold text-surface-container-lowest">
              {toast.title}
            </p>
            <p className="font-spec-code-sm text-spec-code-sm text-surface-variant">
              {toast.desc}
            </p>
          </div>
        </div>
        {toast.price && (
          <span className="font-spec-code text-spec-code font-bold text-secondary-fixed-dim shrink-0">
            {toast.price}
          </span>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-outline/30 flex items-center justify-between font-label-caps text-label-caps">
        <span className="text-surface-variant text-[10px]">Staged for Instant Checkout</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              hideToast();
              openCart();
            }}
            className="text-secondary-fixed-dim hover:underline uppercase tracking-wider font-bold"
          >
            View Bag
          </button>
          <button onClick={hideToast} className="text-surface-variant hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
