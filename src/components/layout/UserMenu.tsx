"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useUserAuth } from "@/hooks/user-auth";
import { userProfilePath } from "@/lib/utils/slug";

const navButtonStyles =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 hover:bg-gray-50";

export function UserMenu() {
  const { user, loading, logout } = useUserAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Link href="/login" className={navButtonStyles}>
        Login
      </Link>
    );
  }

  return (
    <div className="group relative shrink-0">
      <div className="cursor-pointer">
        <Avatar name={user.name} avatarUrl={user.avatar_url} />
      </div>

      <div className="absolute right-0 top-full z-50 hidden pt-1 group-hover:block">
        <div className="min-w-40 rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
          <Link
            href={userProfilePath(user.name)}
            className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
          >
            Profile
          </Link>
          <Link
            href={userProfilePath(user.name)}
            className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
          >
            My products
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
