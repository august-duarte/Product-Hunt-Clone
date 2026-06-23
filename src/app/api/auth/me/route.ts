import { NextResponse } from "next/server";
import { updateProfileValidation } from "@/lib/validations/profiles";
import {
  emailAlreadyExists,
  internalServerError,
  notFound,
  validationError,
} from "@/lib/api/responses";
import { withAuth } from "@/lib/api/with-auth";
import {
  findPublicUserById,
  findUserByEmailExcludingId,
  updateUserEmail,
  updateUserName,
  updateUserNameAndEmail,
} from "@/lib/queries/users";

export const GET = withAuth(async (_req, { id }) => {
  try {
    const user = await findPublicUserById(id);

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get profile failed', error);
    return internalServerError();
  }
});

export const PATCH = withAuth(async (req, { id }) => {
  try {
    const body = await req.json();

    const { error } = updateProfileValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, email } = body;

    if (email) {
      const emailExists = await findUserByEmailExcludingId(email, id);
      if (emailExists.length > 0) {
        return emailAlreadyExists();
      }
    }

    let user;

    if (name && email) {
      user = await updateUserNameAndEmail(id, name, email);
    } else if (name) {
      user = await updateUserName(id, name);
    } else if (email) {
      user = await updateUserEmail(id, email);
    }

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Information update failed', error);
    return internalServerError();
  }
});
