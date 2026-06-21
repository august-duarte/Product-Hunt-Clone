import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import {
  forbidden,
  internalServerError,
  invalidUserId,
  notFound,
  unauthorized,
} from "@/lib/api/responses";

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const decoded = await verifyToken(req);
    const currentUserId = (decoded as { id: number }).id;
    const { userId } = await params;
    const requestedUserId = Number(userId);

    if (Number.isNaN(requestedUserId)) {
      return invalidUserId();
    }

    if (currentUserId !== requestedUserId) {
      const [currentUser] = await sql`
        SELECT is_admin FROM users WHERE id = ${currentUserId}
      `;
      if (!currentUser?.is_admin) {
        return forbidden();
      }
    }

    const [user] = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${requestedUserId}
    `;

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Get user failed', error);
    return internalServerError();
  }
};
