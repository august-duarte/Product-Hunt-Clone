"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AvatarMenuProps = {
  name: string;
};

export function AvatarMenu({ name }: AvatarMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="group relative">
      <div
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-900"
        title={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="absolute right-0 top-full z-50 hidden pt-1 group-hover:block">
        <div className="min-w-40 rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
          >
            Profile
          </Link>
          <Link
            href="/products"
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
