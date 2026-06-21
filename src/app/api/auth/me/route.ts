import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { updateProfileValidation } from "@/lib/validations/profiles";

export const GET = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;

    const [user] = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${id}
    `;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && ['Access denied', 'Invalid token', 'Token already used'].includes(error.message)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get profile failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;
    const body = await req.json();

    const { error } = updateProfileValidation(body);
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    const { name, email } = body;

    if (email) {
      const emailExists = await sql`
        SELECT * FROM users WHERE email = ${email} AND id != ${id}
      `;
      if (emailExists.length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    let user;

    if (name && email) {
      [user] = await sql`
        UPDATE users SET name = ${name}, email = ${email}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;
    } else if (name) {
      [user] = await sql`
        UPDATE users SET name = ${name}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;
    } else if (email) {
      [user] = await sql`
        UPDATE users SET email = ${email}
        WHERE id = ${id}
        RETURNING id, name, email, created_at
      `;
    }

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && ['Access denied', 'Invalid token', 'Token already used'].includes(error.message)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Information update failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
  }
};
