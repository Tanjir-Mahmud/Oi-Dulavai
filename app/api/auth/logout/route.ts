import { NextResponse } from 'next/server';
import { removeSessionCookie, getSession } from '@/lib/auth';

export async function POST() {
  await removeSessionCookie();
  return NextResponse.json({ success: true, message: 'Signed out from atelier session.' });
}

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ authenticated: !!session, user: session });
}
