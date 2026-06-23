import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { comparePassword, hashPassword } from "@/lib/auth/hash-password";
import { updatePasswordValidation } from "@/lib/validations/profiles";
import {
  internalServerError,
  invalidOldPassword,
  notFound,
  samePassword,
  unauthorized,
  validationError,
} from "@/lib/api/responses";
import { findUserById, updateUserPassword } from "@/lib/queries/users";

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export const PATCH = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;
    const body = await req.json();
    const { error } = updatePasswordValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }
    const { oldPassword, newPassword } = body;
    if (oldPassword === newPassword) {
      return samePassword();
    }
    const user = await findUserById(id);
    if (!user) return notFound();

    const validOldPassword = await comparePassword(oldPassword, user.password);
    if (!validOldPassword) {
      return invalidOldPassword();
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await updateUserPassword(id, hashedNewPassword);

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Password update failed', error);
    return internalServerError();
  }
};
