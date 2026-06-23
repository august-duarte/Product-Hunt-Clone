import { loginValidation } from "@/lib/validations/auth";
import { createToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";
import { comparePassword, DUMMY_PASSWORD_HASH } from "@/lib/auth/hash-password";
import { setAuthCookie } from "@/lib/auth/cookies";
import {
  internalServerError,
  invalidEmailOrPassword,
  validationError,
} from "@/lib/api/responses";
import { findUserByEmail } from "@/lib/queries/users";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { error } = loginValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { email, password } = body;

    const user = await findUserByEmail(email);

    const hashToCompare = user?.password ?? DUMMY_PASSWORD_HASH;
    const validPassword = await comparePassword(password, hashToCompare);
    if (!user || !validPassword) {
      return invalidEmailOrPassword();
    }

    const token = createToken(user.id);

    await setAuthCookie(token);

    return NextResponse.json({ message: 'Login successful' }, { status: 200 })
  } catch (error) {
    console.error('Login failed', error);
    return internalServerError();
  }
}
