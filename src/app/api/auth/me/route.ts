import sql from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { id } = await req.json();
    const [user] = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${id}
    `;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: user }, { status: 200 });

  } catch (error) {
    console.error('Get profile failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
    
  }
};
