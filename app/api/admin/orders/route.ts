import { NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { orderStatusUpdateSchema } from '@/lib/validation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const orders = await orderService.getAllOrders(100);
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { orderId, ...updateParams } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const validated = orderStatusUpdateSchema.safeParse(updateParams);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || 'Invalid state transition' },
        { status: 400 }
      );
    }

    const updated = await orderService.updateStatus(
      orderId,
      validated.data.status,
      validated.data.note,
      validated.data.chauffeurName,
      validated.data.trackingNode
    );

    await prisma.adminActivityLog.create({
      data: {
        adminEmail: session.email,
        action: 'ORDER_STATUS_UPDATE',
        entityType: 'ORDER',
        entityId: orderId,
        details: `State transitioned to ${validated.data.status}. Note: ${validated.data.note || 'None'}`,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
