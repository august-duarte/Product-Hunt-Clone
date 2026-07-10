import { NextResponse } from "next/server";
import { updateProfileValidation } from "@/lib/validations/profiles";
import {
  emailAlreadyExists,
  internalServerError,
  notFound,
  usernameAlreadyExists,
  validationError,
} from "@/lib/api/responses";
import { withAuth } from "@/lib/api/with-auth";
import {
  findPublicUserById,
  findUserByEmailExcludingId,
  findUserByUsernameExcludingId,
  updateUserEmail,
  updateUserName,
  updateUserNameAndEmail,
  updateUserUsername,
} from "@/lib/queries/users";
import type { PublicUser, UpdateProfileInput } from "@/types/user";

export const GET = withAuth(async (_req, { id }) => {
  try {
    const user = await findPublicUserById(id);

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Get profile failed", error);
    return internalServerError();
  }
});

export const PATCH = withAuth(async (req, { id }) => {
  try {
    const body: unknown = await req.json();
    const { error, value } = updateProfileValidation(body);
    if (error) {
      return validationError(error.details[0].message);
    }

    const { name, email, username } = value as UpdateProfileInput;

    if (email) {
      const emailExists = await findUserByEmailExcludingId(email, id);
      if (emailExists.length > 0) {
        return emailAlreadyExists();
      }
    }

    if (username) {
      const usernameExists = await findUserByUsernameExcludingId(username, id);
      if (usernameExists.length > 0) {
        return usernameAlreadyExists();
      }
    }

    let user: PublicUser | undefined = await findPublicUserById(id);
    if (!user) return notFound();

    if (name && email) {
      user = await updateUserNameAndEmail(id, name, email);
    } else if (name) {
      user = await updateUserName(id, name);
    } else if (email) {
      user = await updateUserEmail(id, email);
    }

    if (username) {
      user = await updateUserUsername(id, username);
    }

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Information update failed", error);
    return internalServerError();
  }
});
