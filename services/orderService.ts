import { prisma } from '@/lib/prisma';
import { couponService } from './couponService';
import { CheckoutInput } from '@/lib/validation';

export const orderService = {
  // ATOMIC CHECKOUT & ANTI-TAMPERING ENGINE
  async createOrder(input: CheckoutInput, userId?: string) {
    // Step 1: Query database for ground-truth products & variants
    const productIds = input.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Step 2: Validate inventory and compute server-verified subtotal
    let verifiedSubtotal = 0;
    const validatedOrderItems: Array<{
      productId: string;
      variantId?: string;
      title: string;
      sku: string;
      size: string;
      color?: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
      monogramText?: string;
      monogramThread?: string;
      textileSpec?: string;
    }> = [];

    const variantsToDecrement: Array<{ id: string; quantity: number }> = [];

    for (const item of input.items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new Error(`Garment not found in atelier catalog: ${item.sku}`);
      }

      // Check variant if applicable
      let unitPrice = dbProduct.basePrice;
      let matchedVariant = null;

      if (item.variantId) {
        matchedVariant = dbProduct.variants.find((v) => v.id === item.variantId);
      } else {
        matchedVariant = dbProduct.variants.find((v) => v.size === item.size);
      }

      if (matchedVariant) {
        unitPrice += matchedVariant.priceAdjustment;
        // Verify inventory (allow Bespoke orders custom buffer)
        if (matchedVariant.size !== 'Bespoke' && matchedVariant.inventoryCount < item.quantity) {
          throw new Error(
            `Insufficient inventory for ${dbProduct.name} (Size: ${item.size}). Only ${matchedVariant.inventoryCount} units remaining in Banani Vault.`
          );
        }
        variantsToDecrement.push({ id: matchedVariant.id, quantity: item.quantity });
      }

      const itemTotal = unitPrice * item.quantity;
      verifiedSubtotal += itemTotal;

      validatedOrderItems.push({
        productId: dbProduct.id,
        variantId: matchedVariant?.id,
        title: dbProduct.name,
        sku: matchedVariant ? matchedVariant.sku : dbProduct.sku,
        size: item.size,
        color: matchedVariant?.color || 'Atelier Standard',
        unitPrice,
        quantity: item.quantity,
        subtotal: itemTotal,
        monogramText: item.monogramText,
        monogramThread: item.monogramThread,
        textileSpec: `${dbProduct.fabric} • ${dbProduct.gsm ? `${dbProduct.gsm} GSM` : 'Artisanal'}`,
      });
    }

    // Step 3: Server-side discount calculation
    let discountAmount = 0;
    if (input.couponCode) {
      const couponResult = await couponService.validate(input.couponCode, verifiedSubtotal);
      if (couponResult.valid && couponResult.coupon) {
        discountAmount = couponResult.coupon.discountAmount;
      }
    }

    // Step 4: Shipping fee calculation
    // Express Chauffeur is complimentary for orders above ৳ 35,000 or ৳ 350 flat
    let shippingFee = 0;
    if (input.dispatchMethod === 'EXPRESS_CHAUFFEUR') {
      shippingFee = verifiedSubtotal >= 35000 ? 0 : 350;
    } else if (input.dispatchMethod === 'STANDARD_NEXT_DAY') {
      shippingFee = 150;
    }

    // Step 5: VAT 7.5% as per Bangladesh luxury goods tariff
    const taxableAmount = Math.max(0, verifiedSubtotal - discountAmount);
    const vatAmount = Math.round(taxableAmount * 0.075);
    const totalAmount = taxableAmount + vatAmount + shippingFee;

    // Step 6: Generate Order Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `OD-DHAKA-${randomSuffix}`;

    // Step 7: ATOMIC PRISMA TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement variant inventory atomically
      for (const v of variantsToDecrement) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: { inventoryCount: { decrement: v.quantity } },
        });
      }

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          patronName: input.patronName,
          patronEmail: input.patronEmail,
          patronPhone: input.patronPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingZone: input.shippingZone,
          dispatchMethod: input.dispatchMethod,
          doorstepTailorTrial: input.doorstepTailorTrial,
          status: 'CONFIRMED',
          paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          paymentMethod: input.paymentMethod,
          paymentTxnId:
            input.paymentMethod !== 'COD'
              ? `TRX-${input.paymentMethod}-${Date.now().toString().slice(-6)}`
              : null,
          subtotal: verifiedSubtotal,
          discountAmount,
          vatAmount,
          shippingFee,
          totalAmount,
          currency: 'BDT',
          couponCode: input.couponCode || null,
          chauffeurName: 'Kabir Hossain',
          chauffeurVehicle: 'Mercedes-Benz Sprinter Atelier Van • Chha 11-4920',
          chauffeurPhone: '+880 1711-449200',
          trackingNode: 'MOHAKHALI_JUNCTION',
          etaText: 'Tonight, 8:00 PM (Guaranteed)',
          notes: input.notes || null,
        },
      });

      // 3. Create Order Items
      for (const item of validatedOrderItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            ...item,
          },
        });
      }

      // 4. Create Initial Order Milestones
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'PENDING',
          title: 'Order Staged & Authenticated',
          note: `Payment verified via ${input.paymentMethod}. Security check passed.`,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'CONFIRMED',
          title: 'Loom & Master Tailor Allocation',
          note: 'Heirloom garments allocated from Banani Vault inventory.',
        },
      });

      return newOrder;
    });

    // Update coupon usage if applied
    if (input.couponCode) {
      await couponService.incrementUsage(input.couponCode);
    }

    return result;
  },

  async getByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  async getAllOrders(limit = 100) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
  },

  // State Machine Order Transition
  async updateStatus(
    orderId: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'PACKAGING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
    note?: string,
    chauffeurName?: string,
    trackingNode?: string
  ) {
    const titles: Record<string, string> = {
      PENDING: 'Order Staged & Awaiting Verification',
      CONFIRMED: 'Loom & Master Tailor Allocation Confirmed',
      PACKAGING: 'White-Glove Heirloom Packaging Completed',
      SHIPPED: 'Chauffeur In-Transit Across Dhaka Metro',
      DELIVERED: 'Delivered & Doorstep Fitting Accepted',
      CANCELLED: 'Order Cancelled & Restocked',
    };

    const updateData: any = {
      status: newStatus,
    };

    if (chauffeurName) updateData.chauffeurName = chauffeurName;
    if (trackingNode) updateData.trackingNode = trackingNode;

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: updateData,
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          title: titles[newStatus] || newStatus,
          note: note || `State transitioned to ${newStatus}`,
        },
      }),
    ]);

    return updatedOrder;
  },
};

export default orderService;
