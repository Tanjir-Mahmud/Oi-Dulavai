import { NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const order = await orderService.getByOrderNumber(orderNumber);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const invoiceData = {
      invoiceNumber: `INV-${order.orderNumber}`,
      issuedAt: order.createdAt,
      vatRegistrationNumber: 'BIN-004928172-0101',
      taxOffice: 'Large Taxpayers Unit (LTU), Dhaka',
      seller: {
        legalName: 'OI DULAVAI BESPOKE ATELIER LTD.',
        bengaliName: 'ঐ দুলাভাই বুটিক লিমিটেড',
        flagship: 'Plot 42, Road 11, Block D, Banani, Dhaka-1213',
        telephone: '+880 1711-000000',
        email: 'concierge@oidulavai.com',
      },
      patron: {
        name: order.patronName,
        email: order.patronEmail,
        phone: order.patronPhone,
        address: order.shippingAddress,
        city: order.shippingCity,
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.paymentTxnId || 'N/A',
      },
      items: order.items.map((i) => ({
        title: i.title,
        sku: i.sku,
        size: i.size,
        textileSpec: i.textileSpec,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })),
      financials: {
        subtotal: order.subtotal,
        discount: order.discountAmount,
        vatRate: '7.5%',
        vatAmount: order.vatAmount,
        shippingFee: order.shippingFee,
        total: order.totalAmount,
        currency: order.currency,
      },
    };

    return NextResponse.json({ success: true, invoice: invoiceData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
