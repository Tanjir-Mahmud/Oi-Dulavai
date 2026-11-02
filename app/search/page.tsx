import React from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';
import { Search, Sparkles } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const products = query.trim() ? await productService.getAll({ query: query.trim() }) : [];

  const suggestedKeywords = [
    'Rajshahi Silk',
    'Velvet Waskoti',
    'Gurkha Trousers',
    'Irish Linen',
    'Zardozi Sherwani',
    'Brass Cufflinks',
  ];

  return (
    <div className="w-full bg-surface py-space-xl min-h-[85vh]">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
        {/* Search Header */}
        <div className="border-b border-outline-variant/60 pb-space-md space-y-space-md">
          <div>
            <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-xs">
              Atelier Catalog Discovery
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight mt-1">
              {query ? `Search Results for “${query}”` : 'Search Atelier Vaults'}
            </h1>
          </div>

          {/* Search Box */}
          <form method="GET" action="/search" className="flex max-w-2xl">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by weave, garment title, GSM, or SKU..."
              className="w-full bg-surface-container-low border border-outline-variant/60 px-4 py-3 text-on-surface font-body-sm focus:outline-none focus:border-secondary"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary px-8 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Suggested Pills */}
          <div className="flex flex-wrap items-center gap-2 font-spec-code-sm text-spec-code-sm">
            <span className="text-on-surface-variant uppercase text-[10px]">Suggested Queries:</span>
            {suggestedKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="bg-surface-container-low hover:bg-secondary/10 hover:text-secondary border border-outline-variant/60 px-2.5 py-1 text-on-surface transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="flex items-center justify-between font-spec-code-sm text-spec-code-sm text-on-surface-variant">
            <span>
              Found <strong className="text-on-surface">{products.length} matching pieces</strong> in current vault
            </span>
          </div>
        )}

        {products.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-surface-container-low border border-outline-variant/40 p-12">
            <Search className="w-12 h-12 text-outline-variant mx-auto stroke-1" />
            <h2 className="font-headline-lg text-on-surface">
              {query ? `No Pieces Found Matching “${query}”` : 'Enter a Query to Search'}
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Try searching by fabric type (e.g. &apos;Mulberry&apos;, &apos;Linen&apos;), product category (e.g. &apos;Panjabi&apos;, &apos;Waskoti&apos;), or explore our complete archive.
            </p>
            <Link
              href="/collections"
              className="inline-block mt-2 bg-primary text-on-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors font-bold shadow-md"
            >
              Explore Full Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
