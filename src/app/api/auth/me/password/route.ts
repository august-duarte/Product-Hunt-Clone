import { NextResponse } from "next/server";
import { comparePassword, hashPassword } from "@/lib/auth/hash-password";
import { updatePasswordValidation } from "@/lib/validations/profiles";
import {
  internalServerError,
  invalidOldPassword,
  notFound,
  samePassword,
  validationError,
} from "@/lib/api/responses";
import { withAuth } from "@/lib/api/with-auth";
import { findUserById, updateUserPassword } from "@/lib/queries/users";

export const PATCH = withAuth(async (req, { id }) => {
  try {
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
    console.error('Password update failed', error);
    return internalServerError();
  }
});
