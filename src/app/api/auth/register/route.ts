import sql from "@/lib/db";
import { registerValidation } from "@/lib/validations/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash-password";
import {
  emailAlreadyExists,
  internalServerError,
  validationError,
} from "@/lib/api/responses";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { error } = registerValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, email, password } = body;

    const hashedPassword = await hashPassword(password);

    const emailExists = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    if (emailExists.length > 0) {
      return emailAlreadyExists();
    }

    const [user] = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;
    return NextResponse.json({ user: user }, { status: 201 })
  } catch (error) {
    console.error('Register failed', error);
    return internalServerError();
  }
}
