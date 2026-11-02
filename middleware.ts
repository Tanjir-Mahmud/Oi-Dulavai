import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'oi_dulavai_super_secret_session_token_dhaka_atelier_2025';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = 'oi_dulavai_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Initialize Response
  const response = NextResponse.next();

  // 2. Strict Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://lh3.googleusercontent.com https://images.unsplash.com https://*.vercel.app;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.vercel.app https://*.vercel-insights.com https://vitals.vercel-insights.com;
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 3. Extract Session Token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      sessionPayload = payload;
    } catch {
      // Invalid/expired token
    }
  }

  // 4. RBAC Protection for Admin Routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!sessionPayload) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const adminRoles = ['SUPER_ADMIN', 'INVENTORY_MANAGER', 'SUPPORT_AGENT'];
    if (!adminRoles.includes(sessionPayload.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 5. Patron Portal Protection for Account Routes
  if (pathname.startsWith('/account')) {
    if (!sessionPayload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
