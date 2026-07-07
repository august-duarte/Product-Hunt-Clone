"use client";

import { useUpvote } from "@/hooks/use-upvote";

type UpvoteButtonProps = {
  productId: number;
  count?: number;
};

export function UpvoteButton({ productId, count = 0 }: UpvoteButtonProps) {
  const { upvoteCount, upvoted, loading, toggleUpvote } = useUpvote({
    productId,
    initialCount: count,
  });

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    await toggleUpvote();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Upvote"
      className={`flex min-w-14 flex-col items-center justify-center rounded-lg border-2 px-3 py-2 text-gray-900 ${
        upvoted
          ? "border-orange-500 bg-orange-50"
          : "border-gray-300 bg-white hover:bg-gray-50"
      } ${loading ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span className="text-sm leading-none">▲</span>
      <span className="mt-1 text-sm font-semibold">{upvoteCount}</span>
    </button>
  );
}
