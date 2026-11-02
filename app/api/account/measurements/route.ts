import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { measurementSchema } from '@/lib/validation';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const measurements = await prisma.measurementVault.findUnique({
    where: { userId: session.userId },
  });

  return NextResponse.json({ success: true, measurements });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = measurementSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || 'Invalid measurements' },
        { status: 400 }
      );
    }

    const updated = await prisma.measurementVault.upsert({
      where: { userId: session.userId },
      update: {
        ...validated.data,
        lastFittedAt: new Date(),
      },
      create: {
        userId: session.userId,
        ...validated.data,
        lastFittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, measurements: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
