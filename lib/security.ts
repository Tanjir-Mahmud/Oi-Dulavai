import crypto from 'crypto';

// CSRF Protection Engine
const CSRF_SECRET = process.env.ADMIN_SECRET || 'oi_dulavai_csrf_secret_salt_2025';

export function generateCsrfToken(sessionId: string): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${sessionId}:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifyCsrfToken(token: string, sessionId: string, maxAgeMs = 3600000): boolean {
  try {
    const [timestamp, signature] = token.split('.');
    if (!timestamp || !signature) return false;

    // Check expiration
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > maxAgeMs) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(`${sessionId}:${timestamp}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

// XSS Sanitization Helper
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// HMAC SHA-256 Webhook Signature Validator
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  try {
    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(computedSignature)
    );
  } catch {
    return false;
  }
}

// Order Integrity Checksum
export function computeOrderChecksum(
  items: Array<{ sku: string; price: number; qty: number }>,
  subtotal: number,
  shipping: number,
  discount: number
): string {
  const payload = JSON.stringify({ items, subtotal, shipping, discount });
  return crypto.createHmac('sha256', CSRF_SECRET).update(payload).digest('hex');
}
