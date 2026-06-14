const jwt = require('jsonwebtoken');
const sql = require('../db');

const verifyToken = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) throw new Error('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usedJwt = await sql`
    SELECT 1 FROM blacklisted_jwts WHERE jwt = ${token}
    `
    if (usedJwt.length > 0) throw new Error('Token already used');
    
    return decoded;
  } catch {
    throw new Error('Invalid token');
  }
};

module.exports = verifyToken;