import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { adminLoginSchema } from '@/lib/validation';
import { setSessionCookie } from '@/lib/auth';
import { rateLimiter } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = rateLimiter.check(`admin:login:${ip}`, 5, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Administrative security threshold reached. Wait ${rateLimit.resetInSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = adminLoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Valid email and password required.' },
        { status: 400 }
      );
    }

    const sessionPayload = await authService.loginAdmin(
      validated.data.email,
      validated.data.password
    );

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      admin: sessionPayload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Administrative verification failed.' },
      { status: 401 }
    );
  }
}
