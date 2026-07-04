import Link from "next/link";
import { UpvoteButton } from "@/components/products/UpvoteButton";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
  rank: number;
  product: ProductListItem;
};

function getOrdinal(rank: number): string {
  const remainder = rank % 100;
  if (remainder >= 11 && remainder <= 13) return `${rank}th`;

  switch (rank % 10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
}

const PLACEHOLDER_TAGS = ["Tag one", "Tag two", "Tag three"] as const;

export function ProductCard({ rank, product }: ProductCardProps) {
  return (
    <article className="flex items-center gap-4 border-b border-gray-200 py-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-lg font-semibold text-gray-500"
        aria-hidden="true"
      >
        {product.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-gray-900">
          {getOrdinal(rank)}.{" "}
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-orange-500"
          >
            {product.name}
          </Link>{" "}
          <span className="font-normal text-gray-500">
            by {product.maker_name}
          </span>
        </p>
        <p className="mt-1 truncate text-sm text-gray-700">{product.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLACEHOLDER_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled
          aria-label="Comments (coming soon)"
          className="flex min-w-14 flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 opacity-70"
        >
          <span className="text-sm leading-none">💬</span>
          <span className="mt-1 text-sm font-semibold">0</span>
        </button>
        <UpvoteButton count={product.upvote_count} />
      </div>
    </article>
  );
}
