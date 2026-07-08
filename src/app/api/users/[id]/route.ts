import { NextResponse } from 'next/server';
import {
  internalServerError,
  invalidUserId,
  notFound,
} from '@/lib/api/responses';
import { findPublicUserProfileById } from '@/lib/queries/users';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseUserId(id: string): number | null {
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) return null;
  return userId;
}

export const GET = async (_req: Request, { params }: RouteContext) => {
  try {
    const { id } = await params;
    const userId = parseUserId(id);

    if (userId === null) {
      return invalidUserId();
    }

    const user = await findPublicUserProfileById(userId);
    if (!user) return notFound();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get public user profile failed', error);
    return internalServerError();
  }
};
