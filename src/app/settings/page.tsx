"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/hooks/user-auth";

export default function SettingsPage() {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  return (
    <main className="py-8">
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Settings</h1>
      <p className="mb-8 text-sm text-gray-500">
        Choose what you want to update.
      </p>

      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Link
          href="/settings/profile"
          className="rounded-xl border border-gray-300 bg-white px-6 py-5 text-left hover:bg-gray-50"
        >
          <p className="text-lg font-semibold text-gray-900">Edit profile</p>
          <p className="mt-1 text-sm text-gray-500">
            Change your name, username, email, and avatar.
          </p>
        </Link>

        <Link
          href="/settings/password"
          className="rounded-xl border border-gray-300 bg-white px-6 py-5 text-left hover:bg-gray-50"
        >
          <p className="text-lg font-semibold text-gray-900">Change password</p>
          <p className="mt-1 text-sm text-gray-500">
            Update the password you use to sign in.
          </p>
        </Link>
      </div>
    </main>
  );
}
