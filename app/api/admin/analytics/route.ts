import { NextResponse } from 'next/server';
import { analyticsService } from '@/services/analyticsService';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role === 'CUSTOMER') {
    return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 403 });
  }

  try {
    const metrics = await analyticsService.getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
