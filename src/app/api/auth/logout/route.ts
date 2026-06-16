import sql from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const token = await req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await sql`
      INSERT INTO blacklisted_jwts (jwt) VALUES (${token})
    `;
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })

  } catch (error) {
    console.error('Logout failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
  }
};