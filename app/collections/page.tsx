import React, { Suspense } from 'react';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';
import CollectionsFilterBar from './CollectionsFilterBar';
import { Ruler, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface CollectionsPageProps {
  searchParams: {
    category?: string;
    fabric?: string;
    size?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
    q?: string;
  };
}

export const revalidate = 60;

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const { category, fabric, size, sort, q } = searchParams;

  const products = await productService.getAll({
    category,
    fabric,
    size,
    sort,
    query: q,
  });

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Sub-header / Collection Editorial Strip */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/60 py-space-lg">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-1">
              <div className="flex items-center gap-space-xs font-spec-code-sm text-spec-code-sm uppercase tracking-widest text-secondary font-bold">
                <span>Atelier Vault Series</span>
                <span>•</span>
                <span>Tranche 2025</span>
              </div>
              <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface uppercase tracking-tight">
                {category ? `${category} Collection` : 'The Imperial Menswear Archive'}
              </h1>
              <p className="font-body-md text-on-surface-variant max-w-xl">
                Loomed with pure Mulberry silk, wild Tussar slub, and handspun Barendra Khadi. Each piece is cut with architectural precision for modern royal ceremonial wear.
              </p>
            </div>

            <div className="flex items-center gap-space-md font-spec-code-sm text-spec-code-sm text-on-surface-variant bg-surface px-4 py-2 border border-outline-variant/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-secondary font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Showing {products.length} Heirloom Pieces</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter & Taxonomy Control Bar */}
      <Suspense fallback={<div className="h-16 bg-surface-container-low" />}>
        <CollectionsFilterBar
          currentCategory={category}
          currentFabric={fabric}
          currentSize={size}
          currentSort={sort}
        />
      </Suspense>

      {/* 4-Column Catalog Grid */}
      <section className="w-full py-space-xl min-h-[60vh]">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          {products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-surface-container-low border border-outline-variant/40 p-8">
              <p className="font-headline-lg text-on-surface">No Garments Found</p>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                No archived pieces match the selected fabric, size, or category filter combination. Try resetting your filter criteria.
              </p>
              <a
                href="/collections"
                className="inline-block mt-2 bg-primary text-on-primary px-6 py-2.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                Reset All Filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Atelier Sizing & Fitting Assurance Strip */}
      <section className="w-full bg-surface-container-high/40 border-t border-outline-variant/60 py-space-lg">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md font-spec-code text-spec-code">
            <div className="flex items-start gap-3 bg-surface p-4 border border-outline-variant/40 shadow-sm">
              <Truck className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-on-surface text-sm uppercase">Complimentary Dhaka Chauffeur</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                  Guaranteed same-evening delivery in Banani, Gulshan, Baridhara & Uttara for orders staged before 4 PM.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-surface p-4 border border-outline-variant/40 shadow-sm">
              <Ruler className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-on-surface text-sm uppercase">Two-Size Trial Guarantee</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                  Request two adjacent sizes (e.g. 40 & 42) at zero added cost. Try both on doorstep, hand back the other.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-surface p-4 border border-outline-variant/40 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-on-surface text-sm uppercase">Rajshahi Authenticity Seal</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-relaxed">
                  Every silk piece includes sericulture certification coordinates and handloom serial registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
