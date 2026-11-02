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
      return NextResponse.json(
        { error: `No consignment located for Order #${orderNumber}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
