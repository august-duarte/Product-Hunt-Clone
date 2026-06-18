import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { getToken } from "@/lib/auth/jwt";
import { clearAuthCookie } from "@/lib/auth/cookies";

export const POST = async (req: Request) => {
  try {
    await verifyToken(req);
    const token = getToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await sql`
      INSERT INTO blacklisted_jwts (jwt) VALUES (${token})
    `;
    await clearAuthCookie();

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && ['Access denied', 'Invalid token', 'Token already used'].includes(error.message)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Logout failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
  }
};
