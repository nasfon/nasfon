import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'nasfon_admin_session';

function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || (import.meta.env && import.meta.env.ADMIN_PASSWORD) || 'nasfon2026!';
}

/**
 * Creates a simple hash token based on the admin secret.
 */
function generateSessionToken(secret: string): string {
  // Simple deterministic token combined with secret
  const buffer = Buffer.from(`admin:${secret}:session`, 'utf-8');
  return buffer.toString('base64');
}

export function verifyAdminPassword(password: string): boolean {
  const secret = getAdminSecret();
  return password.trim() === secret.trim();
}

export function isValidAdminSession(cookies: AstroCookies): boolean {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const expectedToken = generateSessionToken(getAdminSecret());
  return token === expectedToken;
}

export function setAdminSession(cookies: AstroCookies): void {
  const token = generateSessionToken(getAdminSecret());
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, {
    path: '/',
  });
}
