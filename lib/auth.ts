// Authentication & Session Management Module
// Signs and validates JWT tokens using 'jose' for Edge/Node compatibility

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'oi_dulavai_super_secret_session_token_dhaka_atelier_2025';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export const AUTH_COOKIE_NAME = 'oi_dulavai_session';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SUPPORT_AGENT' | 'INVENTORY_MANAGER' | 'SUPER_ADMIN';
  vaultId?: string | null;
  tier?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<string> {
  const token = await signToken(payload);
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return token;
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// RBAC Hierarchy Checker
export function hasRequiredRole(
  userRole: string,
  allowedRoles: Array<'CUSTOMER' | 'SUPPORT_AGENT' | 'INVENTORY_MANAGER' | 'SUPER_ADMIN'>
): boolean {
  if (userRole === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(userRole as any);
}
