import { NextResponse } from 'next/server';
import { authService } from '@/services/authService';
import { patronSignupSchema } from '@/lib/validation';
import { setSessionCookie } from '@/lib/auth';
import { rateLimiter } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = rateLimiter.check(`auth:signup:${ip}`, 5, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Signup rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = patronSignupSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || 'Invalid registration data.' },
        { status: 400 }
      );
    }

    const sessionPayload = await authService.registerPatron(validated.data);
    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      patron: sessionPayload,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed.' }, { status: 400 });
  }
}
