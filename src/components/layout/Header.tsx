import Link from "next/link";
import jwt from "jsonwebtoken";
import { getAuthCookie } from "@/lib/auth/cookies";
import { findPublicUserById } from "@/lib/queries/users";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import type { PublicUser } from "@/types/user";

const navButtonStyles =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 hover:bg-gray-50";

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

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 relative border-b border-gray-300 bg-white px-6 py-4">
      <nav className="flex items-center justify-center gap-4">
        <Link href="/" className={navButtonStyles}>
          Home
        </Link>
        <Link href="/register" className={navButtonStyles}>
          Register
        </Link>
      </nav>

      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        {user ? (
          <AvatarMenu name={user.name} />
        ) : (
          <Link href="/login" className={navButtonStyles}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
