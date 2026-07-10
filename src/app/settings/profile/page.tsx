"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { useUserAuth } from "@/hooks/user-auth";

export default function ProfileSettingsPage() {
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
      <Link
        href="/settings"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-orange-500"
      >
        ← Back to settings
      </Link>
      <div className="mx-auto max-w-2xl">
        <ProfileSettingsForm />
      </div>
    </main>
  );
}
