import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { updateProfileValidation } from "@/lib/validations/profiles";
import {
  emailAlreadyExists,
  internalServerError,
  notFound,
  unauthorized,
  validationError,
} from "@/lib/api/responses";
import {
  findPublicUserById,
  findUserByEmailExcludingId,
  updateUserEmail,
  updateUserName,
  updateUserNameAndEmail,
} from "@/lib/queries/users";

const AUTH_ERRORS = ['Access denied', 'Invalid token', 'Token already used'];

export const GET = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;

    const user = await findPublicUserById(id);

    if (!user) return notFound();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Get profile failed', error);
    return internalServerError();
  }
};

export const PATCH = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;
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
    if (error instanceof Error && AUTH_ERRORS.includes(error.message)) {
      return unauthorized();
    }
    console.error('Information update failed', error);
    return internalServerError();
  }
};
