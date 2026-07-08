import { NextResponse } from 'next/server';
import {
  internalServerError,
  notFound,
} from '@/lib/api/responses';
import { findPublicUserProfileByUsername } from '@/lib/queries/users';

type RouteContext = {
  params: Promise<{ username: string }>;
};

export const GET = async (_req: Request, { params }: RouteContext) => {
  try {
    const { username } = await params;

    if (!username.trim()) {
      return notFound();
    }

    const user = await findPublicUserProfileByUsername(username);
    if (!user) return notFound();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get public user profile failed', error);
    return internalServerError();
  }
};
