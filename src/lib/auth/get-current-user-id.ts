import jwt from 'jsonwebtoken';
import { getAuthCookie } from '@/lib/auth/cookies';
import { findPublicUserById } from '@/lib/queries/users';

export async function getCurrentUserId(): Promise<number | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return null;

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: number | string };
    const user = await findPublicUserById(Number(decoded.id));
    return user?.id ?? null;
  } catch {
    return null;
  }
}
