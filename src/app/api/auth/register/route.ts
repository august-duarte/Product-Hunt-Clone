import { registerValidation } from "@/lib/validations/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash-password";
import {
  emailAlreadyExists,
  internalServerError,
  validationError,
} from "@/lib/api/responses";
import { createUser, findUserByEmail } from "@/lib/queries/users";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { error } = registerValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, email, password } = body;

    const hashedPassword = await hashPassword(password);

    if (await findUserByEmail(email)) {
      return emailAlreadyExists();
    }

    const user = await createUser(name, email, hashedPassword);
    return NextResponse.json({ user: user }, { status: 201 })
  } catch (error) {
    console.error('Register failed', error);
    return internalServerError();
  }
}
