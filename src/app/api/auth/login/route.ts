import sql from "@/lib/db";
import { loginValidation } from "@/lib/validation";
import { createToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";
import { comparePassword, DUMMY_PASSWORD_HASH } from "@/lib/auth/hash-password";
import { setAuthCookie } from "@/lib/auth/cookies";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { error } = loginValidation(body);
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { email, password } = body;

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    const hashToCompare = user?.password ?? DUMMY_PASSWORD_HASH;
    const validPassword = await comparePassword(password, hashToCompare);
    if (!user || !validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const token = createToken(user.id);

    await setAuthCookie(token);

    return NextResponse.json({ message: 'Login successful' }, { status: 200 })
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 })
  }
}
