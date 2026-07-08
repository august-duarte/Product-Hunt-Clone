import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getAuthCookie } from "@/lib/auth/cookies";
import { findPublicUserById } from "@/lib/queries/users";
import { userProfilePath } from "@/lib/utils/slug";
import type { PublicUser } from "@/types/user";

async function getCurrentUser(): Promise<PublicUser | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return null;

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: number | string };
    const user = await findPublicUserById(Number(decoded.id));
    return user ?? null;
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(userProfilePath(user.name));
}
