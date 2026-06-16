import jwt from 'jsonwebtoken';

export const getToken = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  return token;
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
