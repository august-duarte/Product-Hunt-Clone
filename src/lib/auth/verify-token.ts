import jwt from 'jsonwebtoken';
import sql from '../db';
import { getToken } from './jwt';
import type { AuthPayload } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

const verifyToken = async (request: Request): Promise<AuthPayload> => {
  const token = getToken(request);
  if (!token) throw new Error('Access denied');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    if (!decoded) throw new Error('Invalid token');

    const usedJwt = await sql`
    SELECT 1 FROM blacklisted_jwts WHERE jwt = ${token}
    `
    if (usedJwt.length > 0) throw new Error('Token already used');
    
    return decoded;
  } catch {
    throw new Error('Invalid token');
  }
};

export default verifyToken;