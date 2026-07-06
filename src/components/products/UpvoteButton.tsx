"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserAuth } from "@/hooks/user-auth";

type UpvoteButtonProps = {
  productId: number;
  count?: number;
};

type ToggleUpvoteResponse = {
  upvoted: boolean;
  upvote_count: number;
};

export function UpvoteButton({ productId, count = 0 }: UpvoteButtonProps) {
  const [upvoteCount, setUpvoteCount] = useState(count);
  const [upvoted, setUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useUserAuth();
  const router = useRouter();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading || loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/upvote`, {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) return;

      const data = (await response.json()) as ToggleUpvoteResponse;
      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvote_count);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || loading}
      aria-label="Upvote"
      className={`flex min-w-14 flex-col items-center justify-center rounded-lg border-2 px-3 py-2 text-gray-900 ${
        upvoted
          ? "border-orange-500 bg-orange-50"
          : "border-gray-300 bg-white hover:bg-gray-50"
      } ${isLoading || loading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className="text-sm leading-none">▲</span>
      <span className="mt-1 text-sm font-semibold">{upvoteCount}</span>
    </button>
  );
}
