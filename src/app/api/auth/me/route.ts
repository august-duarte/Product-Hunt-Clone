import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { updateProfileValidation } from "@/lib/validations/profiles";
import {
  emailAlreadyExists,
  internalServerError,
  notFound,
  unauthorized,
  validationError,
} from "@/lib/api/responses";

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export const GET = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;

    const [user] = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${id}
    `;

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Get profile failed', error);
    return internalServerError();
  }
};

export const PATCH = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;
    const body = await req.json();

    const { error } = updateProfileValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, email } = body;

    if (email) {
      const emailExists = await sql`
        SELECT * FROM users WHERE email = ${email} AND id != ${id}
      `;
      if (emailExists.length > 0) {
        return emailAlreadyExists();
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

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Information update failed', error);
    return internalServerError();
  }
};
