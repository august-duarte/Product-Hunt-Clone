import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { getToken } from "@/lib/auth/jwt";
import { clearAuthCookie } from "@/lib/auth/cookies";
import { internalServerError, unauthorized } from "@/lib/api/responses";

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export const POST = async (req: Request) => {
  try {
    await verifyToken(req);
    const token = getToken(req);
    if (!token) return unauthorized();

    await sql`
      INSERT INTO blacklisted_jwts (jwt) VALUES (${token})
    `;
    await clearAuthCookie();

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Logout failed', error);
    return internalServerError();
  }
};
