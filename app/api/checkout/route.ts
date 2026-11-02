import { NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { checkoutSchema } from '@/lib/validation';
import { getSession } from '@/lib/auth';
import { rateLimiter } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = rateLimiter.check(`checkout:${ip}`, 10, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'High checkout transaction volume. Please wait 30 seconds before retry.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = checkoutSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || 'Invalid checkout parameters.' },
        { status: 400 }
      );
    }

    const session = await getSession();
    const order = await orderService.createOrder(validated.data, session?.userId);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status,
    });
  } catch (err: any) {
    console.error('Checkout processing error:', err);
    return NextResponse.json(
      { error: err.message || 'Atelier checkout transaction could not be completed.' },
      { status: 400 }
    );
  }
}
