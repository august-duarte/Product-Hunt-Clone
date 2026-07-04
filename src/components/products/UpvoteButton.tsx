"use client";

type UpvoteButtonProps = {
  count?: number;
};

export function UpvoteButton({ count = 0 }: UpvoteButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-label="Upvote (coming soon)"
      className="flex min-w-14 flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 opacity-70"
    >
      <span className="text-sm leading-none">▲</span>
      <span className="mt-1 text-sm font-semibold">{count}</span>
    </button>
  );
}
