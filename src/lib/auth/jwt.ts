import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './cookies';

export const getToken = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.split(' ')[1];
  if (bearerToken) return bearerToken;

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  return match?.slice(COOKIE_NAME.length + 1);
};

export const createToken = (userId: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');

  return jwt.sign(
    { id: userId },  
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};
