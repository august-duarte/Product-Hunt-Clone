import { registerValidation } from "@/lib/validations/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash-password";
import { createToken } from "@/lib/auth/jwt";
import { attachAuthCookie } from "@/lib/auth/cookies";
import {
  emailAlreadyExists,
  internalServerError,
  usernameAlreadyExists,
  validationError,
} from "@/lib/api/responses";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/lib/queries/users";
import type { RegisterInput } from "@/types/user";

export const POST = async (req: Request) => {
  try {
    const body: unknown = await req.json();
    const { error, value } = registerValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, username, email, password } = value as RegisterInput;

    const hashedPassword = await hashPassword(password);

    if (await findUserByEmail(email)) {
      return emailAlreadyExists();
    }

    if (await findUserByUsername(username)) {
      return usernameAlreadyExists();
    }

    const user = await createUser(name, username, email, hashedPassword);
    const token = createToken(String(user.id));

    return attachAuthCookie(NextResponse.json({ user }, { status: 201 }), token);
  } catch (error) {
    console.error("Register failed", error);
    return internalServerError();
  }
};
