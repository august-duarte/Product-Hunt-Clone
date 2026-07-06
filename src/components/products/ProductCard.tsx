"use client";

import Link from "next/link";
import { UpvoteButton } from "@/components/products/UpvoteButton";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
  rank: number;
  product: ProductListItem;
};

const PLACEHOLDER_TAGS = ["Tag one", "Tag two", "Tag three"] as const;

export function ProductCard({ rank, product }: ProductCardProps) {
  return (
    <article className="group relative flex items-center gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-gray-100">
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={`View ${product.name}`}
      />

      <div className="pointer-events-none relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-lg font-semibold text-gray-500">
        {product.name.charAt(0).toUpperCase()}
      </div>

      <div className="pointer-events-none relative z-10 min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-gray-900">
          {rank}.{" "}
          <span className="group-hover:text-orange-500">{product.name}</span>{" "}
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

      <div className="relative z-10 flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          aria-label="Comments (coming soon)"
          className="flex min-w-14 flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 opacity-70"
        >
          <span className="text-sm leading-none">💬</span>
          <span className="mt-1 text-sm font-semibold">0</span>
        </button>
        <UpvoteButton productId={product.id} count={product.upvote_count} />
      </div>
    </article>
  );
}
