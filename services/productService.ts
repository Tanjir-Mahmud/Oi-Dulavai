import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/redis';

export interface ProductFilterOptions {
  category?: string;
  fabric?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  query?: string;
  limit?: number;
}

export const productService = {
  async getAll(options: ProductFilterOptions = {}) {
    try {
      const { category, fabric, size, minPrice, maxPrice, sort = 'newest', query, limit = 50 } = options;

      const where: any = {};

      if (category && category !== 'All') {
        where.category = { equals: category };
      }

      if (fabric && fabric !== 'All') {
        where.fabric = { contains: fabric };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.basePrice = {};
        if (minPrice !== undefined) where.basePrice.gte = minPrice;
        if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
      }

      if (size && size !== 'All') {
        where.variants = {
          some: {
            size: { equals: size },
          },
        };
      }

      if (query && query.trim()) {
        where.OR = [
          { name: { contains: query } },
          { description: { contains: query } },
          { fabric: { contains: query } },
          { category: { contains: query } },
          { sku: { contains: query } },
        ];
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price-asc') orderBy = { basePrice: 'asc' };
      if (sort === 'price-desc') orderBy = { basePrice: 'desc' };
      if (sort === 'popular') orderBy = { isTrending: 'desc' };

      return await prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          variants: true,
          hotspots: true,
        },
      });
    } catch (err) {
      console.warn('[productService.getAll] Database query fallback during build:', err);
      return [];
    }
  },

  async getBySlug(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    const cached = await cache.get<any>(cacheKey);
    if (cached) return cached;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: true,
        hotspots: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (product) {
      await cache.set(cacheKey, product, 300);
    }
    return product;
  },

  async getFeatured() {
    try {
      return await prisma.product.findMany({
        where: { isFeatured: true },
        take: 6,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          hotspots: true,
        },
      });
    } catch (err) {
      console.warn('[productService.getFeatured] Fallback during build:', err);
      return [];
    }
  },

  async getTrending() {
    try {
      return await prisma.product.findMany({
        where: { isTrending: true },
        take: 8,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          hotspots: true,
        },
      });
    } catch (err) {
      console.warn('[productService.getTrending] Fallback during build:', err);
      return [];
    }
  },

  async updateStock(variantId: string, newCount: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { inventoryCount: newCount },
    });
  },

  async getLowStock() {
    return prisma.productVariant.findMany({
      where: {
        inventoryCount: {
          lte: prisma.productVariant.fields.lowStockThreshold,
        },
      },
      include: {
        product: {
          include: { images: { take: 1 } },
        },
      },
    });
  },
};

export default productService;
