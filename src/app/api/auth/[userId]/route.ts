import { NextResponse } from "next/server";
import {
  forbidden,
  internalServerError,
  invalidUserId,
  notFound,
} from "@/lib/api/responses";
import { withAuthParams } from "@/lib/api/with-auth";
import { findPublicUserById, findUserIsAdmin } from "@/lib/queries/users";

export const GET = withAuthParams<{ userId: string }>(async (
  _req,
  { id: currentUserId },
  { params }
) => {
  try {
    const { userId } = await params;
    const requestedUserId = Number(userId);

    if (Number.isNaN(requestedUserId)) {
      return invalidUserId();
    }

    if (currentUserId !== requestedUserId) {
      const currentUser = await findUserIsAdmin(currentUserId);
      if (!currentUser?.is_admin) {
        return forbidden();
      }
    }

    const user = await findPublicUserById(requestedUserId);

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get user failed', error);
    return internalServerError();
  }
});
