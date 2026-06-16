import sql from "@/lib/db";
import { registerValidation } from "@/lib/validation";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { error } = registerValidation(await req.json());
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { name, email, password } = await req.json();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const emailExists = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    if (emailExists.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const [user] = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;
    return NextResponse.json({ user: user }, { status: 201 })
  } catch (error) {
    console.error('Register failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 })
  }
}