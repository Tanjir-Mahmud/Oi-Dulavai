import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { bespokeAppointmentSchema } from '@/lib/validation';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appointments = await prisma.bespokeAppointment.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, appointments });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const validated = bespokeAppointmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || 'Invalid appointment details' },
        { status: 400 }
      );
    }

    const appointment = await prisma.bespokeAppointment.create({
      data: {
        userId: session?.userId || null,
        ...validated.data,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
