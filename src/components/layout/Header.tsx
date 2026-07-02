"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { contentWidthClass } from "@/components/layout/ContentContainer";
import { useUserAuth } from "@/hooks/user-auth";

const navButtonStyles =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 hover:bg-gray-50";

export function Header() {
  const { user, loading, logout } = useUserAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={`sticky top-0 z-50 relative border-b border-gray-300 bg-white px-6 py-4 ${contentWidthClass}`}>
      <Link
        href="/"
        className="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white hover:bg-orange-600"
        aria-label="Home"
      >
        P
      </Link>

      <nav className="flex items-center justify-center gap-4">
        <Link href="/register" className={navButtonStyles}>
          Register
        </Link>
      </nav>

      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        {!loading && user ? (
          <AvatarMenu
            name={user.name}
            avatarUrl={user.avatar_url}
            onLogout={handleLogout}
          />
        ) : (
          <Link href="/login" className={navButtonStyles}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
