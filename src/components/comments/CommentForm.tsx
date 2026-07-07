"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserAuth } from "@/hooks/user-auth";

type CommentFormProps = {
  productId: number;
};

export function CommentForm({ productId }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, loading } = useUserAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (isLoading || body.trim().length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ body }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error ?? "Could not post comment.");
        return;
      }

      setBody("");
      router.refresh();
    } catch {
      setErrorMessage("Could not post comment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <Link href="/login" className="text-orange-500 hover:underline">
          Log in
        </Link>{" "}
        to add a comment.
      </p>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add a comment..."
        className="min-h-28 w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
        required
      />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <Button
        type="submit"
        disabled={isLoading || body.trim().length === 0}
        className={`!border-orange-500 !bg-orange-500 !text-white hover:!bg-orange-600 ${
          isLoading || body.trim().length === 0
            ? "cursor-not-allowed opacity-60"
            : ""
        }`}
      >
        {isLoading ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
}
