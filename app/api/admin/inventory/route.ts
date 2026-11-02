import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const variants = await prisma.productVariant.findMany({
    orderBy: { inventoryCount: 'asc' },
    include: {
      product: {
        include: { images: { take: 1 } },
      },
    },
  });

  return NextResponse.json({ success: true, variants });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { variantId, count } = await request.json();

    if (!variantId || typeof count !== 'number') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { inventoryCount: count },
      include: { product: true },
    });

    await prisma.adminActivityLog.create({
      data: {
        adminEmail: session.email,
        action: 'INVENTORY_RESTOCK',
        entityType: 'PRODUCT_VARIANT',
        entityId: variantId,
        details: `Updated SKU ${updated.sku} inventory count to ${count}`,
      },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
