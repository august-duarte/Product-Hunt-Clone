import sql from "@/lib/db";
import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth/jwt";
import { clearAuthCookie } from "@/lib/auth/cookies";
import { internalServerError, unauthorized } from "@/lib/api/responses";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (req) => {
  try {
    const token = getToken(req);
    if (!token) return unauthorized();

    await sql`
      INSERT INTO blacklisted_jwts (jwt) VALUES (${token})
    `;
    await clearAuthCookie();

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout failed', error);
    return internalServerError();
  }
});
