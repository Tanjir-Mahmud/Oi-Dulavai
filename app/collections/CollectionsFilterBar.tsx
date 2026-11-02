'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, X, Check, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  currentCategory?: string;
  currentFabric?: string;
  currentSize?: string;
  currentSort?: string;
}

export default function CollectionsFilterBar({
  currentCategory = 'All',
  currentFabric = 'All',
  currentSize = 'All',
  currentSort = 'newest',
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const categories = [
    { label: 'All Garments', value: 'All' },
    { label: 'Rajshahi Panjabis', value: 'Panjabi' },
    { label: 'Embroidered Waskoti', value: 'Waskoti' },
    { label: 'Ceremonial Sherwanis', value: 'Sherwani' },
    { label: 'Bengal Gurkha Pants', value: 'Trousers' },
    { label: 'Irish Linen Shirts', value: 'Shirt' },
  ];

  const fabrics = [
    'All Fabrics',
    'Rajshahi Raw Silk',
    'Irish Linen',
    'Barendra Khadi',
    'Velvet',
    'Pashmina',
    'Cotton',
  ];

  const sizes = ['All Sizes', '38', '40', '42', '44', '46', 'Bespoke'];

  const activeFilterCount =
    (currentCategory && currentCategory !== 'All' ? 1 : 0) +
    (currentFabric && currentFabric !== 'All' && currentFabric !== 'All Fabrics' ? 1 : 0) +
    (currentSize && currentSize !== 'All' && currentSize !== 'All Sizes' ? 1 : 0);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'All' || value === 'All Fabrics' || value === 'All Sizes') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/collections?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/collections');
    setIsMobileSheetOpen(false);
  };

  return (
    <>
      {/* Sticky Filter Bar on Desktop & Mobile Strip */}
      <div className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 py-2.5 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-2.5">
          {/* Mobile Quick Bar: Horizontal Scroll Categories + Filter Trigger */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-label-caps text-[10px] sm:text-label-caps uppercase tracking-wider flex-1 py-1">
              {categories.map((c) => {
                const isActive =
                  c.value === 'All'
                    ? !currentCategory || currentCategory === 'All'
                    : currentCategory === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => updateParam('category', c.value)}
                    className={`px-3 sm:px-4 py-2 whitespace-nowrap transition-all border min-h-[40px] flex items-center ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary font-bold shadow-sm'
                        : 'bg-surface hover:bg-surface-container border-outline-variant/60 text-on-surface'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Bottom Sheet Trigger Button */}
            <button
              onClick={() => setIsMobileSheetOpen(true)}
              aria-label="Open Filter & Sort Sheet"
              className="lg:hidden shrink-0 flex items-center gap-1.5 bg-secondary text-on-secondary px-3 py-2 font-label-caps text-xs uppercase font-bold tracking-wider shadow-md min-h-[40px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-on-primary w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-mono">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Refinements (Fabric, Sizes, Sort, Reset) */}
          <div className="hidden lg:flex flex-wrap items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/30 font-spec-code-sm text-spec-code-sm">
            <div className="flex flex-wrap items-center gap-space-md">
              {/* Fabric Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant uppercase text-[10px] font-bold">Fabric:</span>
                <select
                  value={currentFabric || 'All Fabrics'}
                  onChange={(e) => updateParam('fabric', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/60 px-2.5 py-1.5 text-on-surface font-spec-code text-xs focus:outline-none focus:border-secondary min-h-[36px]"
                >
                  {fabrics.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inline Size Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant uppercase text-[10px] font-bold">Size:</span>
                <div className="flex border border-outline-variant/60 bg-surface">
                  {sizes.slice(1, 6).map((sz) => {
                    const isSzActive = currentSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => updateParam('size', isSzActive ? 'All' : sz)}
                        className={`px-2.5 py-1 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                          isSzActive
                            ? 'bg-secondary text-on-secondary font-bold'
                            : 'hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-md">
              {/* Sort Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant uppercase text-[10px] font-bold">Sort:</span>
                <select
                  value={currentSort || 'newest'}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/60 px-2.5 py-1.5 text-on-surface font-spec-code text-xs focus:outline-none focus:border-secondary min-h-[36px]"
                >
                  <option value="newest">Newest Vault Editions</option>
                  <option value="popular">Most In-Demand</option>
                  <option value="price-asc">Price: Ascending (Low → High)</option>
                  <option value="price-desc">Price: Descending (High → Low)</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              {(currentCategory !== 'All' || currentFabric !== 'All' || currentSize !== 'All') && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-error hover:underline uppercase text-[10px] font-bold min-h-[36px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Sheet Drawer */}
          <div className="relative bg-surface w-full max-h-[85vh] rounded-t-2xl shadow-2xl border-t border-outline-variant/60 flex flex-col z-10 animate-in slide-in-from-bottom duration-300 pb-safe">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto my-3" />

            <div className="flex items-center justify-between px-4 pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-md text-base uppercase font-bold text-on-surface">
                  Filter & Sort Archive
                </h3>
              </div>
              <button
                onClick={() => setIsMobileSheetOpen(false)}
                className="p-2 text-on-surface-variant hover:text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-5 font-spec-code text-xs">
              {/* Category Filter */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant block mb-2 font-bold">
                  Garment Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const isSelected =
                      c.value === 'All'
                        ? !currentCategory || currentCategory === 'All'
                        : currentCategory === c.value;
                    return (
                      <button
                        key={c.value}
                        onClick={() => updateParam('category', c.value)}
                        className={`p-2.5 text-left border min-h-[44px] flex items-center justify-between font-label-caps text-[10px] uppercase ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary font-bold'
                            : 'bg-surface-container-low border-outline-variant/60 text-on-surface'
                        }`}
                      >
                        <span className="truncate">{c.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-secondary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Filter */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant block mb-2 font-bold">
                  Textile Origin & Fabric
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fabrics.map((f) => {
                    const isSelected = (currentFabric || 'All Fabrics') === f;
                    return (
                      <button
                        key={f}
                        onClick={() => updateParam('fabric', f)}
                        className={`px-3 py-2 border font-spec-code-sm text-xs min-h-[44px] flex items-center ${
                          isSelected
                            ? 'bg-secondary text-on-secondary border-secondary font-bold'
                            : 'bg-surface-container-low border-outline-variant/60 text-on-surface'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizing Grid */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant block mb-2 font-bold">
                  Suiting Sizing (RTW & Bespoke)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((sz) => {
                    const isSelected = currentSize === sz || (sz === 'All Sizes' && (!currentSize || currentSize === 'All'));
                    return (
                      <button
                        key={sz}
                        onClick={() => updateParam('size', sz)}
                        className={`p-2 text-center border font-spec-code text-xs min-h-[44px] flex items-center justify-center font-bold ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container-low border-outline-variant/60 text-on-surface'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant block mb-2 font-bold">
                  Sort Editions
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: 'Newest Vault Editions', value: 'newest' },
                    { label: 'Most In-Demand', value: 'popular' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                  ].map((s) => {
                    const isSelected = (currentSort || 'newest') === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => updateParam('sort', s.value)}
                        className={`w-full p-2.5 text-left border flex items-center justify-between min-h-[44px] ${
                          isSelected
                            ? 'bg-secondary/10 border-secondary text-secondary font-bold'
                            : 'border-outline-variant/40 bg-surface'
                        }`}
                      >
                        <span>{s.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-secondary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-outline-variant/40 bg-surface-container-low flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 text-center border border-outline-variant font-label-caps text-xs uppercase tracking-wider text-on-surface min-h-[44px] flex items-center justify-center font-bold"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileSheetOpen(false)}
                className="flex-1 py-3 text-center bg-primary text-on-primary font-label-caps text-xs uppercase tracking-wider min-h-[44px] flex items-center justify-center font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
