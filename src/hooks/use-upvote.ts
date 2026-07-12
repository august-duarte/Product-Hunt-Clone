"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserAuth } from "@/hooks/user-auth";

type UseUpvoteOptions = {
  productId: number;
  initialCount?: number;
  initialUpvoted?: boolean;
};

type ToggleUpvoteResponse = {
  upvoted: boolean;
  upvote_count: number;
};

export function useUpvote({
  productId,
  initialCount = 0,
  initialUpvoted = false,
}: UseUpvoteOptions) {
  const [upvoteCount, setUpvoteCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  const toggleUpvote = async () => {
    if (isLoading || authLoading) return;

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

  return {
    upvoteCount,
    upvoted,
    loading: isLoading || authLoading,
    toggleUpvote,
  };
}
