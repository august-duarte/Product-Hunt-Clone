import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getAuthCookie } from "@/lib/auth/cookies";
import { findPublicUserById } from "@/lib/queries/users";
import { Avatar } from "@/components/ui/Avatar";
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

  return (
    <main className="flex flex-col items-center py-12">
      <Avatar
        name={user.name}
        avatarUrl={user.avatar_url}
        className="h-24 w-24 text-2xl"
      />
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">{user.name}</h1>
    </main>
  );
}
