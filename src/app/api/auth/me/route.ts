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
  updateUserProfile,
} from "@/lib/queries/users";
import type { UpdateProfileInput } from "@/types/user";

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

    const updates = value as UpdateProfileInput;
    const existing = await findPublicUserById(id);
    if (!existing) return notFound();

    const name = updates.name ?? existing.name;
    const username = updates.username ?? existing.username;
    const email = updates.email ?? existing.email;
    const avatar_url =
      updates.avatar_url === undefined
        ? existing.avatar_url
        : updates.avatar_url === ""
          ? null
          : updates.avatar_url;

    if (email !== existing.email) {
      const emailExists = await findUserByEmailExcludingId(email, id);
      if (emailExists.length > 0) {
        return emailAlreadyExists();
      }
    }

    if (username !== existing.username) {
      const usernameExists = await findUserByUsernameExcludingId(username, id);
      if (usernameExists.length > 0) {
        return usernameAlreadyExists();
      }
    }

    const user = await updateUserProfile(id, {
      name,
      username,
      email,
      avatar_url,
    });

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Information update failed", error);
    return internalServerError();
  }
});
