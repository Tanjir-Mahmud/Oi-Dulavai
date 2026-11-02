'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
  };

  return (
    <div className="sticky top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 py-3 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-3">
        {/* Primary Category Horizontal Strip */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar font-label-caps text-label-caps uppercase tracking-wider">
          {categories.map((c) => {
            const isActive =
              c.value === 'All'
                ? !currentCategory || currentCategory === 'All'
                : currentCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => updateParam('category', c.value)}
                className={`px-4 py-2 whitespace-nowrap transition-all border ${
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

        {/* Secondary Refinements (Fabric, Sizes, Sort, Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/30 font-spec-code-sm text-spec-code-sm">
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Fabric Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-on-surface-variant uppercase text-[10px]">Fabric:</span>
              <select
                value={currentFabric || 'All Fabrics'}
                onChange={(e) => updateParam('fabric', e.target.value)}
                className="bg-surface-container-low border border-outline-variant/60 px-2 py-1 text-on-surface font-spec-code text-xs focus:outline-none focus:border-secondary"
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
              <span className="text-on-surface-variant uppercase text-[10px]">Size:</span>
              <div className="flex border border-outline-variant/60 bg-surface">
                {sizes.slice(1, 6).map((sz) => {
                  const isSzActive = currentSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => updateParam('size', isSzActive ? 'All' : sz)}
                      className={`px-2 py-0.5 transition-colors ${
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

          <div className="flex items-center gap-space-sm">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-on-surface-variant uppercase text-[10px]">Sort:</span>
              <select
                value={currentSort || 'newest'}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-surface-container-low border border-outline-variant/60 px-2 py-1 text-on-surface font-spec-code text-xs focus:outline-none focus:border-secondary"
              >
                <option value="newest">Newest Vault Editions</option>
                <option value="popular">Most In-Demand</option>
                <option value="price-asc">Price: Ascending (Low → High)</option>
                <option value="price-desc">Price: Descending (High → Low)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(currentCategory || currentFabric !== 'All' || currentSize !== 'All') && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-error hover:underline uppercase text-[10px] font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
