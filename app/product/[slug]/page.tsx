import React from 'react';
import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product: any = await productService.getBySlug(params.slug);
  if (!product) return { title: 'Product Not Found | Oi Dulavai' };

  return {
    title: `${product.name} | Oi Dulavai Luxury Atelier`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productService.getBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product as any} />;
}
