import { prisma } from '@/lib/prisma';

export const couponService = {
  async validate(code: string, subtotal: number) {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Coupon code cannot be empty' };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return { valid: false, message: 'Invalid or inactive privilege code' };
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return { valid: false, message: 'This privilege voucher has expired' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'This voucher has reached maximum redemption quota' };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Voucher requires a minimum order value of ৳ ${coupon.minOrderAmount.toLocaleString('en-US')}`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
    };
  },

  async incrementUsage(code: string) {
    try {
      await prisma.coupon.update({
        where: { code: code.toUpperCase() },
        data: { usageCount: { increment: 1 } },
      });
    } catch {
      // Ignore if coupon doesn't exist
    }
  },
};

export default couponService;
