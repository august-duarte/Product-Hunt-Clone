import { cookies } from 'next/headers';

const COOKIE_NAME = 'auth_token';
if (!COOKIE_NAME) throw new Error('COOKIE_NAME is not set');

export const getAuthCookieOptions = (maxAgeSeconds = 3600) => {
  return {
    httpOnly: true,           // JS cannot read it (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax' as const, // CSRF mitigation; 'lax' is fine for most apps
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getAuthCookieOptions());
}

export const getAuthCookie = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export const clearAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}