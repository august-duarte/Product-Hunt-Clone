import sql from "@/lib/db";
import { loginValidation } from "@/lib/validation";
import bcrypt from "bcrypt";
import { createToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { error } = loginValidation(await req.json());
    if (error) {
      return NextResponse.json({ error: error.details[0].message }, { status: 400 })
    }

    const { email, password } = await req.json();

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    if (!user) {
      return NextResponse.json({ error: 'User doesn\'t exist. Please check your email and password.' }, { status: 400 })
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword === false) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }
    
    const token = createToken(user.id);

    return NextResponse.json({ token: token }, { status: 200 })
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 })
  }
}
