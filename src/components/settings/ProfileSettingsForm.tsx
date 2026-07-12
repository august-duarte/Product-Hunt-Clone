"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserAuth } from "@/hooks/user-auth";

export function ProfileSettingsForm() {
  const { user, refreshUser } = useUserAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setAvatarUrl(user.avatar_url ?? "");
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          username,
          email,
          avatar_url: avatarUrl.trim() || null,
        }),
      });

      if (response.ok) {
        await refreshUser();
        setSuccessMessage("Profile updated successfully.");
        return;
      }

      const data = await response.json();
      setErrorMessage(data.error ?? "Something went wrong, please try again.");
    } catch {
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-300 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm text-gray-500">
        Update your public name, username, email, and avatar.
      </p>

      <form
        className="mt-4 flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label className="m-2 text-sm font-medium text-gray-700">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="m-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          title="Lowercase letters, numbers, and hyphens only"
          required
        />

        <label className="m-2 text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="m-2 text-sm font-medium text-gray-700">
          Avatar URL
        </label>
        <Input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />

        {errorMessage && (
          <p className="m-2 text-sm text-red-600">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="m-2 text-sm text-green-600">{successMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={`mt-2 w-full !border-orange-500 !bg-orange-500 !text-white hover:!bg-orange-600 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </section>
  );
}
