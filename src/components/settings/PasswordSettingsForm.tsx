"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PasswordSettingsForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("Password updated successfully.");
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
      <h2 className="text-lg font-semibold text-gray-900">Password</h2>
      <p className="mt-1 text-sm text-gray-500">
        Choose a new password for your account.
      </p>

      <form
        className="mt-4 flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label className="m-2 text-sm font-medium text-gray-700">
          Current password
        </label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          minLength={6}
        />

        <label className="m-2 text-sm font-medium text-gray-700">
          New password
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />

        <label className="m-2 text-sm font-medium text-gray-700">
          Confirm new password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
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
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </section>
  );
}
